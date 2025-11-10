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
  const [remotive, jobicy, arbeitnow, remoteok, web3] = await Promise.all([
    fetchRemotiveJobs(),
    fetchJobicyJobs(),
    fetchArbeitnowJobs(),
    fetchRemoteOKJobs(),
    fetchWeb3Jobs()
  ]);
  
  return [...remotive, ...jobicy, ...arbeitnow, ...remoteok, ...web3];
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, allJobs: providedJobs } = await request.json();

    if (!process.env.OPENAI_API_KEY || !openai) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    // Use provided jobs from client if available, otherwise fetch from APIs
    const allJobs = providedJobs && providedJobs.length > 0 ? providedJobs : await getAllJobs();
    
    // Create a detailed summary of available jobs for the AI
    const jobsSummary = allJobs.slice(0, 150).map((job, index) => ({
      id: index,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      source: job.source,
      salary: job.salary,
      url: job.url,
      description: job.description ? job.description.substring(0, 300) + '...' : 'No description',
      tags: job.tags || []
    }));

    // Prepare messages for OpenAI
    const messages: any[] = [
      {
        role: 'system',
        content: `You are an AI job search assistant helping users find their perfect remote job opportunity. You have access to job listings from multiple sources: Remotive, Jobicy, Arbeitnow, RemoteOK, and Web3.career.

Your capabilities:
1. Analyze user preferences and requirements
2. Search and filter through available job listings
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
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // This model can browse the internet if needed
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    const aiResponse = completion.choices[0].message.content;

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
        
        // Find the actual job from database
        const actualJob = allJobs.find(job => 
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
      totalJobsAvailable: allJobs.length
    });

  } catch (error: any) {
    console.error('Error in AI Jobs API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch all available jobs
export async function GET() {
  try {
    const allJobs = await getAllJobs();
    
    return NextResponse.json({
      jobs: allJobs,
      totalCount: allJobs.length,
      sources: ['Remotive', 'Jobicy', 'Arbeitnow', 'RemoteOK', 'Web3.career']
    });
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
