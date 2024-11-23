# White Lotus Edge Function

Session management edge function for White Lotus AI Florist.

## Setup

1. Clone repository
\`\`\`bash
git clone https://github.com/yourusername/white-lotus.git
cd white-lotus
\`\`\`

2. Set up environment variables
\`\`\`bash
cp .env.example .env
# Edit .env with your values
\`\`\`

3. Deploy function
\`\`\`bash
supabase functions deploy chat-handler
\`\`\`

## API

### Request
\`\`\`typescript
{
  phone: string,     // Required: Phone number
  message: string,   // Required: User message
  state?: string,    // Optional: New state
  ai_response?: string, // Optional: AI response to store
  occasion?: string, // Optional: Selected occasion
  budget?: string,   // Optional: Selected budget
  style?: string[]   // Optional: Selected styles
}
\`\`\`

### Response
\`\`\`typescript
{
  session_id: string,
  state: string,
  is_new: boolean,
  current_data?: {
    occasion?: string,
    budget?: string,
    style?: string[]
  }
}
\`\`\`

## Local Development

1. Start local server
\`\`\`bash
supabase functions serve chat-handler --env-file .env
\`\`\`

2. Test function
\`\`\`bash
curl -i --location --request POST 'http://localhost:54321/functions/v1/chat-handler' \\
  --header 'Authorization: Bearer your-anon-key' \\
  --header 'Content-Type: application/json' \\
  --data '{"phone":"+51999999999","message":"Hola"}'
\`\`\`