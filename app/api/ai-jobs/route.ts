import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// This route requires dynamic rendering
export const dynamic = 'force-dynamic';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

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

    // Simple system message
    const systemMessage = {
      role: 'system',
      content: `You are a helpful AI job search assistant. Help users with their job search queries. Be friendly and conversational.
      
When users ask about jobs, provide helpful advice and information about job searching, resume tips, interview preparation, etc.

Keep your responses concise and helpful.`
    };

    // Prepare messages (keep only last 4 messages to avoid payload issues)
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
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0].message.content;

    return NextResponse.json({
      message: aiResponse,
      jobCards: []
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
