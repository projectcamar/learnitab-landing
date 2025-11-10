# AI Jobs Feature Setup Guide

This guide explains how to set up and use the new AI Jobs chatbot feature in Learnitab.

## Features

The AI Jobs tab provides an intelligent chatbot assistant that:

- 🤖 **AI-Powered Recommendations**: Uses OpenAI's GPT-4 to understand your job preferences and provide personalized recommendations
- 🌐 **Multi-Source Job Aggregation**: Fetches real-time job listings from:
  - Remotive
  - Jobicy
  - Arbeitnow
  - RemoteOK
  - Web3 Career
- 💬 **Conversational Interface**: Natural language interaction for finding jobs
- 🎯 **Smart Matching**: AI analyzes your skills, preferences, and requirements to match you with relevant positions
- 📋 **Direct Job Links**: Quick access to apply for recommended positions

## Environment Variables Required

You need to set the following environment variable in Vercel:

### `OPENAI_API_KEY`

**Required**: Yes  
**Description**: Your OpenAI API key for accessing GPT-4 model  
**How to get it**:
1. Go to https://platform.openai.com/api-keys
2. Sign in or create an OpenAI account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Add it to Vercel environment variables

**In Vercel**:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add new variable:
   - Name: `OPENAI_API_KEY`
   - Value: `sk-your-actual-key-here`
   - Environments: Select Production, Preview, and Development
4. Redeploy your application

## Usage

1. Navigate to the **AI Jobs** tab in the Learnitab app
2. Start a conversation by:
   - Clicking one of the suggested prompts, or
   - Typing your own question about jobs
3. Examples of what you can ask:
   - "Show me remote software engineering jobs"
   - "What are the best Web3 jobs available?"
   - "Find me entry-level design jobs"
   - "I'm a full-stack developer with React and Node.js experience. What jobs would fit me?"
   - "Show me marketing jobs that pay over $80,000"

## API Endpoints

### POST `/api/ai-jobs`

Send chat messages to the AI assistant.

**Request Body**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Show me remote software engineering jobs"
    }
  ]
}
```

**Response**:
```json
{
  "response": "AI-generated response with job recommendations",
  "jobs": [
    {
      "id": "...",
      "title": "Senior Software Engineer",
      "company": "Company Name",
      "location": "Remote",
      "type": "Full Time",
      "url": "https://...",
      "salary": "$120k-$150k",
      "source": "Remotive"
    }
  ],
  "totalJobsAvailable": 500
}
```

### GET `/api/ai-jobs`

Fetch all available jobs without AI processing.

**Response**:
```json
{
  "jobs": [...],
  "total": 500,
  "sources": ["Remotive", "Jobicy", "Arbeitnow", "RemoteOK", "Web3 Career"]
}
```

## Cost Considerations

- The AI Jobs feature uses OpenAI's GPT-4 model
- Each chat interaction costs approximately $0.01-$0.05 depending on message length
- Monitor your OpenAI usage at https://platform.openai.com/usage
- Consider setting usage limits in your OpenAI account settings

## Troubleshooting

**Issue**: "OPENAI_API_KEY is not set" error  
**Solution**: Make sure you've added the environment variable in Vercel and redeployed

**Issue**: AI responses are slow  
**Solution**: This is normal - GPT-4 can take 3-10 seconds to respond. The UI shows a "Thinking..." indicator.

**Issue**: No jobs appearing  
**Solution**: The jobs are fetched in real-time from external APIs. If one API is down, jobs from other sources will still appear.

## UI Components

- **Chat Interface**: Modern gradient design with purple/blue theme
- **Message Bubbles**: User messages (right, purple gradient) and AI responses (left, white)
- **Quick Actions**: Pre-defined prompts for common job searches
- **Job Cards**: Recommended jobs with direct apply links
- **Icons**: Uses Feather Icons (react-icons/fi) - open source and free to use

## Icons Used

All icons are from the open-source Feather Icons library:
- `FiMessageCircle` - AI Jobs tab icon and chat indicators
- `FiBriefcase` - Jobs-related indicators
- `FiSend` - Send message button
- All other icons from `react-icons/fi`

## Support

For issues or questions about the AI Jobs feature, contact: learnitab@gmail.com
