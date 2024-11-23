import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'
import { ChatRequest, SessionResponse } from './types.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

serve(async (req) => {
  try {
    const { phone, message, state, ai_response, occasion, budget, style } = 
      await req.json() as ChatRequest

    // Get or create session
    const { data: session } = await supabase
      .from('sessions')
      .select('*')
      .eq('phone', phone)
      .eq('status', 'active')
      .single()

    if (!session) {
      // Create new session
      const { data: newSessionId, error } = await supabase
        .rpc('create_new_session', {
          p_phone: phone,
          p_initial_message: message
        })
      
      if (error) throw error

      return new Response(
        JSON.stringify({
          session_id: newSessionId,
          state: 'welcome',
          is_new: true
        } as SessionResponse),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Update existing session
    const updates: any = {
      last_message: message,
      last_update: new Date().toISOString()
    }

    if (state) updates.state = state
    if (occasion) updates.occasion = occasion
    if (budget) updates.budget = budget
    if (style) updates.style = style

    const { error: updateError } = await supabase
      .from('sessions')
      .update(updates)
      .eq('id', session.id)

    if (updateError) throw updateError

    // Update chat history if AI response is provided
    if (ai_response) {
      await supabase.rpc('update_session_state', {
        p_phone: phone,
        p_new_state: state || session.state,
        p_message: message
      })
    }

    return new Response(
      JSON.stringify({
        session_id: session.id,
        state: state || session.state,
        is_new: false,
        current_data: {
          occasion: session.occasion,
          budget: session.budget,
          style: session.style
        }
      } as SessionResponse),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        session_id: '',
        state: '',
        is_new: false
      } as SessionResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})