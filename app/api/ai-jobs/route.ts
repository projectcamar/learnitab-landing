import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// This route requires dynamic rendering
export const dynamic = 'force-dynamic';

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

// Job API fetching functions
async function fetchRemotiveJobs() {
  try {
    const response = await fetch('https://remotive.com/api/remote-jobs');
    const data = await response.json();
    return data.jobs.map((job: any) => ({
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
  } catch (error) {
    console.error('Error fetching Remotive jobs:', error);
    return [];
  }
}

async function fetchJobicyJobs() {
  try {
    const response = await fetch('https://jobicy.com/api/v2/remote-jobs?count=50');
    const data = await response.json();
    return data.jobs.map((job: any) => ({
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
  } catch (error) {
    console.error('Error fetching Jobicy jobs:', error);
    return [];
  }
}

async function fetchArbeitnowJobs() {
  try {
    const response = await fetch('https://www.arbeitnow.com/api/job-board-api');
    const data = await response.json();
    return data.data.map((job: any) => ({
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
  } catch (error) {
    console.error('Error fetching Arbeitnow jobs:', error);
    return [];
  }
}

async function fetchRemoteOKJobs() {
  try {
    const response = await fetch('https://remoteok.com/api?limit=100', {
      headers: {
        'User-Agent': 'Learnitab (https://learnitab.com)'
      }
    });
    const data = await response.json();
    const jobs = data.slice(1); // Skip metadata
    
    return jobs.map((job: any) => ({
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
  } catch (error) {
    console.error('Error fetching RemoteOK jobs:', error);
    return [];
  }
}

async function fetchWeb3Jobs() {
  try {
    const response = await fetch('https://web3.career/api/v1/jobs');
    const data = await response.json();
    return data.jobs?.map((job: any) => ({
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
  } catch (error) {
    console.error('Error fetching Web3 jobs:', error);
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
    try {
      allJobs = providedJobs && providedJobs.length > 0 ? providedJobs : await getCachedJobsWithBatching();
      
      // If no jobs were fetched, return an error
      if (allJobs.length === 0) {
        console.warn('No jobs available from any source');
        return NextResponse.json(
          { 
            error: 'No jobs available',
            errorType: 'no_jobs',
            message: 'Unable to fetch job listings at the moment. The job APIs might be temporarily unavailable. Please try again later.' 
          },
          { status: 503 }
        );
      }
    } catch (jobFetchError) {
      console.error('Error fetching jobs:', jobFetchError);
      // Continue with empty jobs array but log the error
      allJobs = [];
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

    // Call OpenAI API
    let aiResponse;
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
      });
      
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
export async function GET() {
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
