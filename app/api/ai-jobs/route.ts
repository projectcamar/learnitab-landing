import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// This route requires dynamic rendering
export const dynamic = 'force-dynamic';

// Route timeout - max 55 seconds (Vercel/Netlify limit is 60s)
export const maxDuration = 55;

// Initialize OpenAI only when API key is available
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// ==================== BATCHING & CACHING STRATEGY ====================
// In-memory cache untuk jobs dengan TTL (Time To Live)
// Ini akan mengurangi fetch dari 5 APIs setiap request
interface JobsCache {
  data: any[];
  timestamp: number;
  expiresAt: number;
}

let jobsCache: JobsCache | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache
const CACHE_STALE_WHILE_REVALIDATE = 10 * 60 * 1000; // 10 minutes stale-while-revalidate

// Flag untuk prevent multiple simultaneous fetches (batching)
let fetchInProgress = false;
let fetchPromise: Promise<any[]> | null = null;

// ==================== CIRCUIT BREAKER PATTERN ====================
// Prevents cascading failures by tracking API errors and temporarily disabling failing APIs
interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  isOpen: boolean; // true = circuit open (API disabled temporarily)
}

const circuitBreakers: Map<string, CircuitBreakerState> = new Map();
const CIRCUIT_BREAKER_THRESHOLD = 3; // Open circuit after 3 consecutive failures
const CIRCUIT_BREAKER_TIMEOUT = 60000; // Try again after 60 seconds
const CIRCUIT_BREAKER_RESET_SUCCESS_COUNT = 2; // Reset after 2 successful calls

function checkCircuitBreaker(apiName: string): boolean {
  const state = circuitBreakers.get(apiName);
  if (!state) return true; // No state = circuit closed, allow request
  
  if (state.isOpen) {
    const timeSinceLastFailure = Date.now() - state.lastFailureTime;
    if (timeSinceLastFailure > CIRCUIT_BREAKER_TIMEOUT) {
      console.log(`🔄 Circuit breaker for ${apiName} attempting reset (timeout reached)`);
      state.isOpen = false;
      state.failures = 0;
      return true;
    }
    console.log(`⚠️ Circuit breaker OPEN for ${apiName} (${Math.floor((CIRCUIT_BREAKER_TIMEOUT - timeSinceLastFailure) / 1000)}s remaining)`);
    return false;
  }
  
  return true;
}

function recordCircuitBreakerSuccess(apiName: string) {
  const state = circuitBreakers.get(apiName);
  if (state && state.failures > 0) {
    state.failures = Math.max(0, state.failures - 1);
    console.log(`✅ ${apiName} success - circuit breaker failures: ${state.failures}`);
    if (state.failures === 0) {
      circuitBreakers.delete(apiName);
    }
  }
}

function recordCircuitBreakerFailure(apiName: string) {
  let state = circuitBreakers.get(apiName);
  if (!state) {
    state = { failures: 0, lastFailureTime: 0, isOpen: false };
    circuitBreakers.set(apiName, state);
  }
  
  state.failures++;
  state.lastFailureTime = Date.now();
  
  if (state.failures >= CIRCUIT_BREAKER_THRESHOLD) {
    state.isOpen = true;
    console.error(`🔴 Circuit breaker OPENED for ${apiName} after ${state.failures} failures`);
  } else {
    console.warn(`⚠️ ${apiName} failure ${state.failures}/${CIRCUIT_BREAKER_THRESHOLD}`);
  }
}

// ==================== TIMEOUT UTILITIES ====================
// Helper function to add timeout to fetch requests
function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 10000): Promise<Response> {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) => 
      setTimeout(() => reject(new Error(`Request timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
}

// Helper function to add timeout to any async operation
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, operation: string = 'Operation'): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(`${operation} timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
}

// ==================== JOB API FETCHING WITH TIMEOUTS ====================
// Job API fetching functions with circuit breaker
async function fetchRemotiveJobs() {
  const apiName = 'Remotive';
  if (!checkCircuitBreaker(apiName)) {
    console.log(`⏭️ Skipping ${apiName} (circuit breaker open)`);
    return [];
  }
  
  try {
    const response = await fetchWithTimeout('https://remotive.com/api/remote-jobs', {}, 8000);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const jobs = data.jobs.map((job: any) => ({
      id: job.id.toString(),
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location || 'Remote',
      type: job.job_type || 'Full Time',
      description: job.description,
      url: job.url,
      source: 'Remotive',
      salary: job.salary || 'Not specified',
      logo: job.company_logo,
      date: job.publication_date
    }));
    recordCircuitBreakerSuccess(apiName);
    return jobs;
  } catch (error) {
    console.error('Error fetching Remotive jobs:', error);
    recordCircuitBreakerFailure(apiName);
    return [];
  }
}

async function fetchJobicyJobs() {
  const apiName = 'Jobicy';
  if (!checkCircuitBreaker(apiName)) {
    console.log(`⏭️ Skipping ${apiName} (circuit breaker open)`);
    return [];
  }
  
  try {
    const response = await fetchWithTimeout('https://jobicy.com/api/v2/remote-jobs?count=50', {}, 8000);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const jobs = data.jobs.map((job: any) => ({
      id: job.id,
      title: job.jobTitle,
      company: job.companyName,
      location: job.jobGeo,
      type: job.jobType,
      description: job.jobDescription,
      url: job.url,
      source: 'Jobicy',
      salary: job.annualSalaryMin && job.annualSalaryMax 
        ? `${job.salaryCurrency || '$'}${job.annualSalaryMin}-${job.annualSalaryMax}`
        : 'Not specified',
      logo: job.companyLogo,
      date: job.pubDate
    }));
    recordCircuitBreakerSuccess(apiName);
    return jobs;
  } catch (error) {
    console.error('Error fetching Jobicy jobs:', error);
    recordCircuitBreakerFailure(apiName);
    return [];
  }
}

async function fetchArbeitnowJobs() {
  const apiName = 'Arbeitnow';
  if (!checkCircuitBreaker(apiName)) {
    console.log(`⏭️ Skipping ${apiName} (circuit breaker open)`);
    return [];
  }
  
  try {
    const response = await fetchWithTimeout('https://www.arbeitnow.com/api/job-board-api', {}, 8000);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const jobs = data.data.map((job: any) => ({
      id: job.slug,
      title: job.title,
      company: job.company_name,
      location: job.location,
      type: job.job_types.join(', '),
      description: job.description,
      url: job.url,
      source: 'Arbeitnow',
      salary: 'Not specified',
      tags: job.tags,
      date: new Date(job.created_at * 1000).toISOString()
    }));
    recordCircuitBreakerSuccess(apiName);
    return jobs;
  } catch (error) {
    console.error('Error fetching Arbeitnow jobs:', error);
    recordCircuitBreakerFailure(apiName);
    return [];
  }
}

async function fetchRemoteOKJobs() {
  const apiName = 'RemoteOK';
  if (!checkCircuitBreaker(apiName)) {
    console.log(`⏭️ Skipping ${apiName} (circuit breaker open)`);
    return [];
  }
  
  try {
    const response = await fetchWithTimeout('https://remoteok.com/api?limit=100', {
      headers: {
        'User-Agent': 'Learnitab (https://learnitab.com)'
      }
    }, 8000);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const jobs = data.slice(1); // Skip metadata
    
    const mappedJobs = jobs.map((job: any) => ({
      id: job.id,
      title: job.position,
      company: job.company,
      location: job.location || 'Remote',
      type: 'Remote',
      description: job.description,
      url: job.url,
      source: 'RemoteOK',
      salary: job.salary_min && job.salary_max 
        ? `$${job.salary_min}-${job.salary_max}`
        : 'Not specified',
      logo: job.company_logo,
      tags: job.tags,
      date: job.date
    }));
    recordCircuitBreakerSuccess(apiName);
    return mappedJobs;
  } catch (error) {
    console.error('Error fetching RemoteOK jobs:', error);
    recordCircuitBreakerFailure(apiName);
    return [];
  }
}

async function fetchWeb3Jobs() {
  const apiName = 'Web3.career';
  if (!checkCircuitBreaker(apiName)) {
    console.log(`⏭️ Skipping ${apiName} (circuit breaker open)`);
    return [];
  }
  
  try {
    const response = await fetchWithTimeout('https://web3.career/api/v1/jobs', {}, 8000);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const jobs = data.jobs?.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: job.company_name,
      location: job.location || 'Remote',
      type: job.employment_type || 'Full Time',
      description: job.description,
      url: job.url,
      source: 'Web3.career',
      salary: job.salary_range || 'Not specified',
      logo: job.company_logo,
      date: job.published_at
    })) || [];
    recordCircuitBreakerSuccess(apiName);
    return jobs;
  } catch (error) {
    console.error('Error fetching Web3 jobs:', error);
    recordCircuitBreakerFailure(apiName);
    return [];
  }
}

async function getAllJobs() {
  console.log('Fetching jobs from all sources...');
  
  const [remotive, jobicy, arbeitnow, remoteok, web3] = await Promise.all([
    fetchRemotiveJobs(),
    fetchJobicyJobs(),
    fetchArbeitnowJobs(),
    fetchRemoteOKJobs(),
    fetchWeb3Jobs()
  ]);
  
  const allJobs = [...remotive, ...jobicy, ...arbeitnow, ...remoteok, ...web3];
  
  console.log(`Fetched ${allJobs.length} jobs total:`);
  console.log(`- Remotive: ${remotive.length}`);
  console.log(`- Jobicy: ${jobicy.length}`);
  console.log(`- Arbeitnow: ${arbeitnow.length}`);
  console.log(`- RemoteOK: ${remoteok.length}`);
  console.log(`- Web3: ${web3.length}`);
  
  return allJobs;
}

// ==================== BATCHED & CACHED JOB FETCHING ====================
// This function implements batching and caching to avoid fetching from APIs on every request
async function getCachedJobsWithBatching(): Promise<any[]> {
  const now = Date.now();
  
  // 1. CHECK CACHE: If cache is fresh, return immediately
  if (jobsCache && now < jobsCache.expiresAt) {
    console.log(`✅ Cache HIT - Using cached jobs (age: ${Math.floor((now - jobsCache.timestamp) / 1000)}s)`);
    return jobsCache.data;
  }
  
  // 2. STALE-WHILE-REVALIDATE: If cache is stale but within revalidate window
  if (jobsCache && now < jobsCache.timestamp + CACHE_STALE_WHILE_REVALIDATE) {
    console.log(`⚠️ Cache STALE - Returning stale data while revalidating in background`);
    
    // Return stale data immediately
    const staleData = jobsCache.data;
    
    // Trigger background revalidation (fire-and-forget)
    if (!fetchInProgress) {
      fetchInProgress = true;
      getAllJobs()
        .then(freshJobs => {
          jobsCache = {
            data: freshJobs,
            timestamp: Date.now(),
            expiresAt: Date.now() + CACHE_TTL
          };
          console.log(`✅ Background revalidation completed - Cache updated with ${freshJobs.length} jobs`);
        })
        .catch(err => console.error('Background revalidation failed:', err))
        .finally(() => {
          fetchInProgress = false;
          fetchPromise = null;
        });
    }
    
    return staleData;
  }
  
  // 3. BATCHING: If fetch is already in progress, wait for it
  if (fetchInProgress && fetchPromise) {
    console.log(`⏳ Fetch in progress - Batching request (waiting for existing fetch)`);
    return fetchPromise;
  }
  
  // 4. CACHE MISS: Fetch fresh data
  console.log(`❌ Cache MISS - Fetching fresh jobs from all APIs`);
  fetchInProgress = true;
  fetchPromise = getAllJobs()
    .then(jobs => {
      jobsCache = {
        data: jobs,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_TTL
      };
      console.log(`✅ Cache updated with ${jobs.length} jobs (TTL: ${CACHE_TTL / 1000}s)`);
      return jobs;
    })
    .finally(() => {
      fetchInProgress = false;
      fetchPromise = null;
    });
  
  return fetchPromise;
}

// RAG: Filter and rank jobs based on relevance to user query
// Returns top N most relevant jobs to minimize payload size
function filterRelevantJobs(jobs: any[], userQuery: string, limit: number = 20): any[] {
  // Extract keywords from user query
  const queryLower = userQuery.toLowerCase();
  const keywords = queryLower
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !['the', 'and', 'for', 'are', 'with', 'looking', 'need', 'want', 'show', 'find', 'get'].includes(word));
  
  console.log(`Filtering jobs with keywords: ${keywords.join(', ')}`);
  
  // Score each job based on relevance
  const scoredJobs = jobs.map(job => {
    let score = 0;
    const titleLower = (job.title || '').toLowerCase();
    const descLower = (job.description || '').toLowerCase().substring(0, 500);
    const companyLower = (job.company || '').toLowerCase();
    const tagsLower = (job.tags || []).join(' ').toLowerCase();
    
    // Higher weight for title matches
    keywords.forEach(keyword => {
      if (titleLower.includes(keyword)) score += 10;
      if (companyLower.includes(keyword)) score += 5;
      if (descLower.includes(keyword)) score += 3;
      if (tagsLower.includes(keyword)) score += 4;
    });
    
    // Bonus for common tech keywords
    const techKeywords = ['senior', 'junior', 'lead', 'principal', 'staff', 'developer', 'engineer', 'designer', 'manager', 'remote', 'full-time', 'part-time'];
    techKeywords.forEach(tech => {
      if (queryLower.includes(tech) && titleLower.includes(tech)) score += 8;
    });
    
    // Boost recent jobs slightly
    const daysSincePosted = job.date ? (Date.now() - new Date(job.date).getTime()) / (1000 * 60 * 60 * 24) : 30;
    if (daysSincePosted < 7) score += 2;
    else if (daysSincePosted < 14) score += 1;
    
    return { ...job, relevanceScore: score };
  });
  
  // Sort by score and return top results
  const topJobs = scoredJobs
    .filter(job => job.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
  
  console.log(`Filtered to ${topJobs.length} most relevant jobs (scores: ${topJobs.slice(0, 5).map(j => j.relevanceScore).join(', ')})`);
  
  // If we don't have enough relevant jobs, add some random jobs to reach a minimum
  if (topJobs.length < 10) {
    const remainingJobs = scoredJobs
      .filter(job => !topJobs.includes(job))
      .slice(0, Math.min(20, jobs.length - topJobs.length));
    return [...topJobs, ...remainingJobs];
  }
  
  return topJobs;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request with error handling for large payloads
    let body;
    try {
      body = await request.json();
    } catch (parseError: any) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { 
          error: 'Invalid request format',
          errorType: 'invalid_request',
          message: 'Unable to parse your request. If your message is very long, try a shorter one.' 
        },
        { status: 400 }
      );
    }
    
    const { message, conversationHistory, allJobs: providedJobs } = body;

    // Validate required fields
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { 
          error: 'Message is required',
          errorType: 'invalid_request',
          message: 'Please provide a valid message.' 
        },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || !openai) {
      console.error('OpenAI API key is not configured');
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured', 
          errorType: 'missing_api_key',
          message: 'The AI assistant is not configured properly. Please contact support or try again later.' 
        },
        { status: 500 }
      );
    }

    // Use provided jobs from client if available, otherwise fetch from APIs WITH BATCHING & CACHING
    let allJobs = [];
    let jobsFetchedSuccessfully = false;
    try {
      allJobs = providedJobs && providedJobs.length > 0 ? providedJobs : await getCachedJobsWithBatching();
      jobsFetchedSuccessfully = allJobs.length > 0;
      
      // If no jobs were fetched, provide a fallback response instead of error
      if (allJobs.length === 0) {
        console.warn('No jobs available from any source - using fallback response');
        
        // Instead of returning an error, provide a helpful fallback message
        const fallbackMessage = `I apologize, but I'm currently unable to fetch job listings from our partner sites. This could be due to:\n\n` +
          `• **Temporary API unavailability** - The job boards might be experiencing high traffic\n` +
          `• **Network connectivity issues** - There might be a temporary connection problem\n` +
          `• **Rate limiting** - We may have reached temporary API limits\n\n` +
          `**What you can do:**\n` +
          `• Wait a few minutes and try again\n` +
          `• Visit these job boards directly:\n` +
          `  - [Remotive](https://remotive.com)\n` +
          `  - [RemoteOK](https://remoteok.com)\n` +
          `  - [We Work Remotely](https://weworkremotely.com)\n` +
          `• Try a different search query when the service is back\n\n` +
          `I'll be ready to help you search through thousands of jobs once the connection is restored! 🚀`;
        
        return NextResponse.json({
          message: fallbackMessage,
          jobCards: [],
          totalJobsAvailable: 0,
          relevantJobsCount: 0,
          fallbackMode: true
        });
      }
    } catch (jobFetchError) {
      console.error('Error fetching jobs:', jobFetchError);
      // Continue with empty jobs array and provide fallback
      allJobs = [];
      jobsFetchedSuccessfully = false;
    }
    
    // ==================== RAG APPROACH ====================
    // Filter jobs based on user query to reduce payload size
    // Combined with BATCHING & CACHING above:
    // - BEFORE: Every request fetches 150+ jobs from 5 APIs (slow, expensive)
    // - AFTER: Use cached jobs (5min TTL) + RAG filtering (fast, efficient)
    // Result: Only 20 most relevant jobs sent to OpenAI
    const relevantJobs = filterRelevantJobs(allJobs, message, 20);
    console.log(`RAG: Reduced from ${allJobs.length} to ${relevantJobs.length} relevant jobs`);
    
    // Create a compact summary of relevant jobs for the AI (optimized for minimal payload size)
    const jobsSummary = relevantJobs.map((job: any, index: number) => ({
      id: index,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      source: job.source,
      salary: job.salary,
      url: job.url,
      // Reduced description length from 400 to 200 chars to minimize payload
      description: job.description ? job.description.substring(0, 200) + '...' : 'No description',
      // Only include tags if they exist and limit to first 3
      tags: job.tags ? job.tags.slice(0, 3) : []
    }));

    // Prepare messages for OpenAI
    const messages: any[] = [
      {
        role: 'system',
        content: `You are an AI job search assistant helping users find their perfect remote job opportunity. You have access to job listings from multiple sources: Remotive, Jobicy, Arbeitnow, RemoteOK, and Web3.career.

**IMPORTANT: The jobs shown below have been pre-filtered using RAG (Retrieval Augmented Generation) based on the user's query. These are the MOST RELEVANT jobs from thousands of listings. You're seeing only the top matches.**

Your capabilities:
1. Analyze user preferences and requirements
2. Search and filter through the pre-filtered relevant job listings
3. Provide personalized job recommendations with FULL details
4. Answer questions about job opportunities
5. Help users understand job market trends

CRITICAL FORMATTING INSTRUCTIONS:

**MARKDOWN FORMATTING:**
- Use **bold** for emphasis on important points (e.g., **3-5 years experience**, **remote-first**)
- Use *italic* for subtle emphasis or notes
- Use bullet points (•) or numbered lists for clarity
- Use proper paragraphs for readability
- Make your responses visually engaging with proper formatting!

**JOB RECOMMENDATIONS:**
When recommending jobs, you MUST format them as interactive cards:

🎯 I found **[X] jobs** that match your criteria:

[JOB_CARD]
Title: [Job Title]
Company: [Company Name]
Location: [Location]
Type: [Job Type]
Salary: [Salary]
Source: [Source]
Apply: [URL]
[/JOB_CARD]

**IMPORTANT RULES:**
- Use the EXACT format above for each job
- Include ALL available details (title, company, location, type, salary, source, url)
- Always wrap job details in [JOB_CARD] tags
- Be conversational and use **markdown formatting** in your explanations
- Explain **WHY** these jobs are good matches with **bold** highlights
- Use bullet points for listing requirements or benefits

**Example Response Format:**
"Great! I found **5 business analyst positions** that match your criteria. Here's why they're good fits:

• **Strong match for your skills** - These roles require analytical thinking
• **Remote-first companies** - All positions are 100% remote
• **Competitive compensation** - Salary ranges from $70k-$120k

[JOB_CARD sections here]

Would you like me to find more positions or refine the search based on **specific criteria** like salary range or company size?"

Available jobs database:
${JSON.stringify(jobsSummary, null, 2)}

When a user asks for jobs:
1. Search the database for matching jobs
2. Select 3-5 best matches
3. Format them using [JOB_CARD] tags
4. Explain why they're good fits using **markdown formatting**
5. Ask if they want to see more or refine the search

Be conversational, friendly, and helpful with **proper markdown formatting**!`
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call OpenAI API with timeout (30 seconds max)
    let aiResponse;
    try {
      // Create the completion request
      const completionPromise = openai.chat.completions.create(
        {
          model: 'gpt-4o',
          messages: messages,
          temperature: 0.7,
          max_tokens: 2000,
        },
        {
          timeout: 30000, // 30 second timeout in options parameter
        }
      );
      
      // Add additional timeout wrapper for safety
      const completion = await withTimeout(
        completionPromise,
        35000, // 35 seconds total (5s buffer)
        'OpenAI API call'
      );
      
      aiResponse = completion.choices[0].message.content;
      
      if (!aiResponse) {
        throw new Error('Empty response from OpenAI');
      }
    } catch (openaiError: any) {
      console.error('OpenAI API error:', openaiError);
      
      // Check for specific OpenAI errors
      if (openaiError.status === 401) {
        return NextResponse.json(
          { 
            error: 'Invalid OpenAI API key',
            errorType: 'invalid_api_key',
            message: 'The AI service is not configured correctly. Please contact support.' 
          },
          { status: 401 }
        );
      } else if (openaiError.status === 429) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            errorType: 'rate_limit',
            message: 'Too many requests. Please wait a moment and try again.' 
          },
          { status: 429 }
        );
      } else if (openaiError.code === 'ENOTFOUND' || openaiError.code === 'ECONNREFUSED') {
        return NextResponse.json(
          { 
            error: 'Network error',
            errorType: 'network_error',
            message: 'Unable to connect to the AI service. Please check your internet connection and try again.' 
          },
          { status: 503 }
        );
      } else if (openaiError.message?.includes('timeout')) {
        return NextResponse.json(
          { 
            error: 'Request timeout',
            errorType: 'timeout',
            message: 'The AI service took too long to respond. Please try again with a simpler query or try again later.' 
          },
          { status: 504 }
        );
      }
      
      // Generic OpenAI error
      return NextResponse.json(
        { 
          error: 'AI service error',
          errorType: 'openai_error',
          message: 'The AI assistant encountered an error. Please try again later.',
          details: openaiError.message 
        },
        { status: 500 }
      );
    }

    // Parse job cards from AI response and enrich with full job data
    const jobCardRegex = /\[JOB_CARD\]([\s\S]*?)\[\/JOB_CARD\]/g;
    const jobCards = [];
    let match;
    
    while ((match = jobCardRegex.exec(aiResponse || '')) !== null) {
      const cardContent = match[1];
      const titleMatch = cardContent.match(/Title:\s*(.+?)\n/);
      const companyMatch = cardContent.match(/Company:\s*(.+?)\n/);
      
      if (titleMatch && companyMatch) {
        const title = titleMatch[1].trim();
        const company = companyMatch[1].trim();
        
        // Find the actual job from the relevant jobs (RAG filtered list)
        const actualJob = relevantJobs.find((job: any) => 
          job.title.toLowerCase().includes(title.toLowerCase()) &&
          job.company.toLowerCase().includes(company.toLowerCase())
        );
        
        if (actualJob) {
          jobCards.push(actualJob);
        }
      }
    }

    return NextResponse.json({
      message: aiResponse,
      jobCards: jobCards,
      totalJobsAvailable: allJobs.length,
      relevantJobsCount: relevantJobs.length
    });

  } catch (error: any) {
    console.error('Error in AI Jobs API:', error);
    
    // Determine error type
    let errorType = 'unknown_error';
    let errorMessage = 'An unexpected error occurred. Please try again.';
    
    if (error.message?.includes('JSON')) {
      errorType = 'invalid_request';
      errorMessage = 'Invalid request format. Please try again.';
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorType = 'network_error';
      errorMessage = 'Network connection error. Please check your internet connection.';
    }
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to process request',
        errorType: errorType,
        message: errorMessage,
        details: error.stack 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch all available jobs WITH BATCHING & CACHING
// Also serves as health check endpoint
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const healthCheck = searchParams.get('health') === 'true';
  
  // Health check mode - return system status
  if (healthCheck) {
    const circuitBreakerStatus = Array.from(circuitBreakers.entries()).map(([api, state]) => ({
      api,
      status: state.isOpen ? 'OPEN (disabled)' : 'CLOSED (active)',
      failures: state.failures,
      lastFailure: state.lastFailureTime ? new Date(state.lastFailureTime).toISOString() : null
    }));
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      cache: jobsCache ? {
        hasData: true,
        jobCount: jobsCache.data.length,
        age: Math.floor((Date.now() - jobsCache.timestamp) / 1000),
        expiresIn: Math.floor((jobsCache.expiresAt - Date.now()) / 1000),
        isStale: Date.now() > jobsCache.expiresAt
      } : {
        hasData: false
      },
      circuitBreakers: circuitBreakerStatus.length > 0 ? circuitBreakerStatus : 'All APIs healthy',
      openaiConfigured: !!process.env.OPENAI_API_KEY
    });
  }
  
  // Regular GET - fetch jobs
  try {
    const allJobs = await getCachedJobsWithBatching();
    
    const response = NextResponse.json({
      jobs: allJobs,
      totalCount: allJobs.length,
      sources: ['Remotive', 'Jobicy', 'Arbeitnow', 'RemoteOK', 'Web3.career'],
      cached: jobsCache ? {
        age: Math.floor((Date.now() - jobsCache.timestamp) / 1000),
        expiresIn: Math.floor((jobsCache.expiresAt - Date.now()) / 1000)
      } : null
    });
    
    // Add cache headers for client-side caching
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=300');
    response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=300');
    
    return response;
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
