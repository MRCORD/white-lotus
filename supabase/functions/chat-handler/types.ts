export interface ChatRequest {
    phone: string
    message: string
    state?: string
    ai_response?: string
    occasion?: string
    budget?: string
    style?: string[]
  }
  
  export interface SessionResponse {
    session_id: string
    state: string
    is_new: boolean
    current_data?: {
      occasion?: string
      budget?: string
      style?: string[]
    }
    error?: string
  }