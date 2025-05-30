export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_sessions: {
        Row: {
          id: string
          user_id: string
          started_at: string
          ended_at: string | null
          total_focus_time: number
          tasks_completed: number
          microsteps_completed: number
        }
        Insert: {
          id?: string
          user_id: string
          started_at?: string
          ended_at?: string | null
          total_focus_time?: number
          tasks_completed?: number
          microsteps_completed?: number
        }
        Update: {
          id?: string
          user_id?: string
          started_at?: string
          ended_at?: string | null
          total_focus_time?: number
          tasks_completed?: number
          microsteps_completed?: number
        }
      }
      user_events: {
        Row: {
          id: string
          user_id: string
          session_id: string
          event_type: string
          event_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id: string
          event_type: string
          event_data?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          event_type?: string
          event_data?: Json
          created_at?: string
        }
      }
    }
  }
}