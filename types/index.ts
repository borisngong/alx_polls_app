export interface User {
  id: string
  email: string
  name: string
  created_at: Date
  updated_at: Date
}

export interface Poll {
  id: string
  title: string
  description?: string
  created_by: string
  is_active: boolean
  expires_at?: Date
  created_at: Date
  updated_at: Date
  options?: PollOption[]
  user?: User
}

export interface PollOption {
  id: string
  poll_id: string
  text: string
  votes: number
  created_at: Date
  updated_at: Date
}

export interface PollVote {
  id: string
  poll_id: string
  option_id: string
  user_id: string
  created_at: Date
}

export interface CreatePollData {
  title: string
  description?: string
  options: string[]
  expiresAt?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      polls: {
        Row: Poll
        Insert: Omit<Poll, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Poll, 'id' | 'created_at' | 'updated_at'>>
      }
      poll_options: {
        Row: PollOption
        Insert: Omit<PollOption, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<PollOption, 'id' | 'created_at' | 'updated_at'>>
      }
      poll_votes: {
        Row: PollVote
        Insert: Omit<PollVote, 'id' | 'created_at'>
        Update: Partial<Omit<PollVote, 'id' | 'created_at'>>
      }
    }
  }
}
