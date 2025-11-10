import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configure route as dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Initialize OpenAI client lazily
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Function to fetch all jobs from various APIs
async function fetchAllJobs() {
  const jobs: any[] = [];

  try {
    // Fetch from Remotive
    const remotiveResponse = await fetch('https://remotive.com/api/remote-jobs');
    const remotiveData = await remotiveResponse.json();
    jobs.push(...remotiveData.jobs.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location || 'Remote',
      type: job.job_type || 'Full Time',
      url: job.url,
      description: job.description,
      salary: job.salary || 'Not specified',
      tags: job.tags || [],
      source: 'Remotive',
      published: job.publication_date
    })));
  } catch (error) {
    console.error('Error fetching Remotive jobs:', error);
  }

  try {
    // Fetch from Jobicy
    const jobicyResponse = await fetch('https://jobicy.com/api/v2/remote-jobs?count=50');
    const jobicyData = await jobicyResponse.json();
    if (jobicyData.jobs) {
      jobs.push(...jobicyData.jobs.map((job: any) => ({
        id: job.id,
        title: job.jobTitle,
        company: job.companyName,
        location: job.jobGeo,
        type: job.jobType,
        url: job.url,
        description: job.jobDescription,
        salary: job.annualSalaryMin && job.annualSalaryMax 
          ? `${job.salaryCurrency} ${job.annualSalaryMin}-${job.annualSalaryMax}` 
          : 'Not specified',
        tags: [],
        source: 'Jobicy',
        published: job.pubDate
      })));
    }
  } catch (error) {
    console.error('Error fetching Jobicy jobs:', error);
  }

  try {
    // Fetch from Arbeitnow
    const arbeitnowResponse = await fetch('https://www.arbeitnow.com/api/job-board-api');
    const arbeitnowData = await arbeitnowResponse.json();
    if (arbeitnowData.data) {
      jobs.push(...arbeitnowData.data.map((job: any) => ({
        id: job.slug,
        title: job.title,
        company: job.company_name,
        location: job.location,
        type: job.job_types.join(', '),
        url: job.url,
        description: job.description,
        salary: 'Not specified',
        tags: job.tags || [],
        source: 'Arbeitnow',
        published: new Date(job.created_at * 1000).toISOString()
      })));
    }
  } catch (error) {
    console.error('Error fetching Arbeitnow jobs:', error);
  }

  try {
    // Fetch from RemoteOK
    const remoteokResponse = await fetch('https://remoteok.com/api?limit=100', {
      headers: {
        'User-Agent': 'Learnitab (https://learnitab.com)'
      }
    });
    const remoteokData = await remoteokResponse.json();
    // Skip first item (metadata)
    jobs.push(...remoteokData.slice(1).map((job: any) => ({
      id: job.id,
      title: job.position,
      company: job.company,
      location: job.location || 'Remote',
      type: job.tags?.[0] || 'Full Time',
      url: job.url,
      description: job.description,
      salary: job.salary_min && job.salary_max 
        ? `$${job.salary_min.toLocaleString()}-$${job.salary_max.toLocaleString()}` 
        : 'Not specified',
      tags: job.tags || [],
      source: 'RemoteOK',
      published: job.date
    })));
  } catch (error) {
    console.error('Error fetching RemoteOK jobs:', error);
  }

  try {
    // Fetch from Web3 Career
    const web3Response = await fetch('https://web3.career/api/v1?token=o8KS57qZNyYZfGAqqQnPuVDK5URZjgwH');
    const web3Data = await web3Response.json();
    if (web3Data[2]) {
      jobs.push(...web3Data[2].map((job: any) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location || `${job.city}, ${job.country}`,
        type: job.tags.includes('remote') ? 'Remote' : 'On-site',
        url: job.apply_url,
        description: job.description,
        salary: 'Not specified',
        tags: job.tags || [],
        source: 'Web3 Career',
        published: new Date(job.date_epoch * 1000).toISOString()
      })));
    }
  } catch (error) {
    console.error('Error fetching Web3 jobs:', error);
  }

  return jobs;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, includeJobSearch } = await req.json();

    // Get OpenAI client
    const openai = getOpenAIClient();

    // Fetch all jobs
    const allJobs = await fetchAllJobs();
    
    // Prepare job database context for AI
    const jobContext = `You are an AI career assistant specialized in helping users find remote job opportunities. 
You have access to a database of ${allJobs.length} current job listings from multiple sources including Remotive, Jobicy, Arbeitnow, RemoteOK, and Web3 Career.

When a user asks about jobs, analyze their requirements (role, skills, location preferences, salary expectations, etc.) and recommend the most relevant positions from the database.

Available jobs summary:
${allJobs.slice(0, 50).map(job => `- ${job.title} at ${job.company} (${job.source}) - ${job.location} - ${job.type}`).join('\n')}
... and ${allJobs.length - 50} more jobs available.

When recommending jobs:
1. Match user skills and preferences with job requirements
2. Consider location preferences (remote, specific countries, etc.)
3. Factor in job type (full-time, part-time, contract, etc.)
4. Mention salary information when available
5. Provide 3-5 most relevant recommendations with brief explanations
6. Include the job URL so users can apply
7. Be conversational and helpful

If the user asks for something you don't have in the database, you can suggest they search online or check specific job boards.`;

    // Create the chat completion
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Use GPT-4 for better results
      messages: [
        {
          role: 'system',
          content: jobContext
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const aiResponse = completion.choices[0].message.content;

    // Extract mentioned jobs for detailed display
    const mentionedJobs = allJobs.filter(job => 
      aiResponse?.toLowerCase().includes(job.title.toLowerCase()) ||
      aiResponse?.toLowerCase().includes(job.company.toLowerCase())
    ).slice(0, 5);

    return NextResponse.json({
      response: aiResponse,
      jobs: mentionedJobs,
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

// GET endpoint to just fetch jobs
export async function GET() {
  try {
    const allJobs = await fetchAllJobs();
    
    return NextResponse.json({
      jobs: allJobs,
      total: allJobs.length,
      sources: ['Remotive', 'Jobicy', 'Arbeitnow', 'RemoteOK', 'Web3 Career']
    });
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
