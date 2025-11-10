import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// This route requires dynamic rendering
export const dynamic = 'force-dynamic';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Simplified job fetching - only from RemoteOK (fastest API)
async function fetchSimpleJobs() {
  try {
    const response = await fetch('https://remoteok.com/api?limit=30', {
      headers: { 'User-Agent': 'Learnitab' }
    });
    const data = await response.json();
    
    // Skip first item (metadata) and return simplified jobs
    return data.slice(1, 21).map((job: any) => ({
      id: job.id,
      title: job.position,
      company: job.company,
      location: job.location || 'Remote',
      type: 'Remote',
      salary: job.salary_min && job.salary_max ? `$${job.salary_min}-${job.salary_max}` : 'Not specified',
      url: job.url,
      tags: job.tags?.slice(0, 3) || [],
      logo: job.company_logo,
      description: (job.description || '').substring(0, 150) + '...'
    }));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured',
          errorType: 'missing_api_key',
          message: 'The AI assistant is not configured properly. Please contact support.'
        },
        { status: 500 }
      );
    }

    // Fetch jobs (simple & fast)
    const jobs = await fetchSimpleJobs();

    // Simple system message with jobs
    const systemMessage = {
      role: 'system',
      content: `You are a helpful AI job search assistant. You have access to ${jobs.length} remote job listings.

**Available Jobs:**
${jobs.map((job, idx) => `${idx + 1}. ${job.title} at ${job.company} | ${job.location} | ${job.tags.join(', ')}`).join('\n')}

When users ask for job recommendations:
1. Search through the jobs list above
2. Recommend 3-5 best matches based on their query
3. Format recommendations like this:

**[Job Title]** at **[Company]**
- Location: [location]
- Tags: [tags]
- URL: [url]

Be conversational and helpful. If they ask general questions, provide career advice.`
    };

    // Keep only last 4 messages
    const recentHistory = conversationHistory.slice(-4) || [];
    const messages = [
      systemMessage,
      ...recentHistory,
      {
        role: 'user',
        content: message
      }
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1500,
    });

    const aiResponse = completion.choices[0].message.content;

    // Extract job recommendations from response
    const jobCards = [];
    const urlMatches = aiResponse?.matchAll(/URL:\s*(https?:\/\/[^\s]+)/g) || [];
    
    for (const match of urlMatches) {
      const url = match[1];
      const job = jobs.find(j => j.url === url);
      if (job) {
        jobCards.push(job);
      }
    }

    return NextResponse.json({
      message: aiResponse,
      jobCards: jobCards,
      totalJobs: jobs.length
    });

  } catch (error: any) {
    console.error('Error in AI Jobs API:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to process request',
        errorType: 'server_error',
        message: 'An error occurred. Please try again.'
      },
      { status: 500 }
    );
  }
}
