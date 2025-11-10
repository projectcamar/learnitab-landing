import { NextRequest, NextResponse } from 'next/server';

type JobFromAPI = {
  id?: string | number;
  title: string;
  company: string;
  company_name?: string;
  companyName?: string;
  location: string;
  candidate_required_location?: string;
  tags?: string[];
  job_type?: string;
  jobType?: string;
  salary?: string;
  url: string;
  description: string;
  source: string;
};

type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
};

// Fetch all jobs from various APIs
async function fetchAllJobs(): Promise<JobFromAPI[]> {
  const jobs: JobFromAPI[] = [];

  try {
    // Fetch from Remotive
    const remotiveRes = await fetch('https://remotive.com/api/remote-jobs');
    const remotiveData = await remotiveRes.json();
    jobs.push(...remotiveData.jobs.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location || 'Remote',
      tags: job.tags || [],
      salary: job.salary || '',
      url: job.url,
      description: job.description,
      source: 'remotive',
      job_type: job.job_type
    })));
  } catch (error) {
    console.error('Error fetching Remotive jobs:', error);
  }

  try {
    // Fetch from Jobicy
    const jobicyRes = await fetch('https://jobicy.com/api/v2/remote-jobs?count=50');
    const jobicyData = await jobicyRes.json();
    if (jobicyData.jobs) {
      jobs.push(...jobicyData.jobs.map((job: any) => ({
        id: job.id,
        title: job.jobTitle,
        company: job.companyName,
        location: job.jobGeo || 'Remote',
        tags: job.jobIndustry ? [job.jobIndustry] : [],
        salary: '',
        url: job.url,
        description: job.jobExcerpt || '',
        source: 'jobicy',
        job_type: job.jobType
      })));
    }
  } catch (error) {
    console.error('Error fetching Jobicy jobs:', error);
  }

  try {
    // Fetch from Arbeitnow
    const arbeitnowRes = await fetch('https://www.arbeitnow.com/api/job-board-api');
    const arbeitnowData = await arbeitnowRes.json();
    if (arbeitnowData.data) {
      jobs.push(...arbeitnowData.data.map((job: any) => ({
        id: job.slug,
        title: job.title,
        company: job.company_name,
        location: job.location || 'Remote',
        tags: job.tags || [],
        salary: '',
        url: job.url,
        description: job.description || '',
        source: 'arbeitnow',
        job_type: job.job_types?.join(', ') || ''
      })));
    }
  } catch (error) {
    console.error('Error fetching Arbeitnow jobs:', error);
  }

  try {
    // Fetch from RemoteOK
    const remoteokRes = await fetch('https://remoteok.com/api?limit=100', {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    const remoteokData = await remoteokRes.json();
    const remoteokJobs = remoteokData.slice(1); // First item is metadata
    jobs.push(...remoteokJobs.map((job: any) => ({
      id: job.id,
      title: job.position,
      company: job.company,
      location: job.location || 'Remote',
      tags: job.tags || [],
      salary: '',
      url: job.url,
      description: job.description || '',
      source: 'remoteok',
      job_type: ''
    })));
  } catch (error) {
    console.error('Error fetching RemoteOK jobs:', error);
  }

  try {
    // Fetch from Web3 Career
    const web3Res = await fetch('https://web3.career/api/v1?token=o8KS57qZNyYZfGAqqQnPuVDK5URZjgwH');
    const web3Data = await web3Res.json();
    if (web3Data[2]) {
      jobs.push(...web3Data[2].map((job: any) => ({
        id: job.id,
        title: job.title,
        company: job.company_name,
        location: job.location || 'Remote',
        tags: job.tags || [],
        salary: job.salary_min && job.salary_max ? `${job.salary_min} - ${job.salary_max}` : '',
        url: job.url,
        description: job.description || '',
        source: 'web3',
        job_type: job.job_type
      })));
    }
  } catch (error) {
    console.error('Error fetching Web3 jobs:', error);
  }

  return jobs;
}

// Filter and rank jobs based on user query
function filterAndRankJobs(jobs: JobFromAPI[], userQuery: string, context: string = ''): JobFromAPI[] {
  const queryLower = userQuery.toLowerCase();
  const contextLower = context.toLowerCase();
  
  const scoredJobs = jobs.map(job => {
    let score = 0;
    const titleLower = job.title.toLowerCase();
    const companyLower = job.company.toLowerCase();
    const descriptionLower = job.description.toLowerCase();
    const tagsLower = job.tags?.map(t => t.toLowerCase()).join(' ') || '';
    
    // Title match (highest weight)
    if (titleLower.includes(queryLower)) score += 50;
    queryLower.split(' ').forEach(word => {
      if (word.length > 2 && titleLower.includes(word)) score += 10;
    });
    
    // Tags match
    if (tagsLower.includes(queryLower)) score += 30;
    queryLower.split(' ').forEach(word => {
      if (word.length > 2 && tagsLower.includes(word)) score += 8;
    });
    
    // Description match
    if (descriptionLower.includes(queryLower)) score += 20;
    queryLower.split(' ').forEach(word => {
      if (word.length > 2 && descriptionLower.includes(word)) score += 5;
    });
    
    // Company match
    if (companyLower.includes(queryLower)) score += 15;
    
    // Context-based scoring
    if (context) {
      contextLower.split(' ').forEach(word => {
        if (word.length > 3) {
          if (titleLower.includes(word)) score += 8;
          if (tagsLower.includes(word)) score += 6;
          if (descriptionLower.includes(word)) score += 3;
        }
      });
    }
    
    return { ...job, match_score: Math.min(score, 100) };
  });
  
  return scoredJobs
    .filter(job => job.match_score > 0)
    .sort((a, b) => (b.match_score || 0) - (a.match_score || 0))
    .slice(0, 10);
}

// Generate AI response using OpenAI
async function generateAIResponse(
  userMessage: string, 
  relevantJobs: JobFromAPI[], 
  conversationHistory: ConversationMessage[]
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return "I found some jobs for you based on your query. Let me know if you'd like to refine your search!";
  }

  try {
    const systemPrompt = `You are an AI job search assistant specializing in remote and tech jobs. You help users find the perfect job match from various job boards including Remotive, Jobicy, Arbeitnow, RemoteOK, and Web3 Career.

Your role:
- Understand user job preferences and requirements
- Provide personalized job recommendations
- Offer career advice and job search tips
- Be friendly, professional, and helpful
- Keep responses concise and actionable

When presenting jobs:
- Highlight the best matches first
- Explain why certain jobs might be a good fit
- Ask clarifying questions to better understand their needs
- Provide insights about companies and roles when relevant`;

    const userContext = relevantJobs.length > 0 
      ? `I found ${relevantJobs.length} relevant jobs matching the query. The top matches include positions like: ${relevantJobs.slice(0, 3).map(j => j.title).join(', ')}.`
      : "I couldn't find jobs matching the specific query, but I can help search with different keywords or provide general job search advice.";

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-5),
      { 
        role: 'user', 
        content: `${userMessage}\n\n[Context: ${userContext}]` 
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return relevantJobs.length > 0
      ? "I found some great job opportunities for you! Check out the recommendations below."
      : "I'm here to help you find the perfect job. Could you tell me more about what you're looking for? For example, what role, skills, or industry interests you?";
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Fetch all jobs
    const allJobs = await fetchAllJobs();
    
    // Build context from conversation history
    const context = conversationHistory
      .map((msg: ConversationMessage) => msg.content)
      .join(' ');
    
    // Filter and rank jobs
    const relevantJobs = filterAndRankJobs(allJobs, message, context);
    
    // Generate AI response
    const aiMessage = await generateAIResponse(message, relevantJobs, conversationHistory);
    
    // Format jobs for response
    const jobRecommendations = relevantJobs.map(job => ({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      url: job.url,
      description: job.description.substring(0, 200) + (job.description.length > 200 ? '...' : ''),
      source: job.source,
      tags: job.tags || [],
      match_score: job.match_score
    }));

    return NextResponse.json({
      message: aiMessage,
      jobs: jobRecommendations,
      totalJobsSearched: allJobs.length
    });
  } catch (error) {
    console.error('Error in AI jobs API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
