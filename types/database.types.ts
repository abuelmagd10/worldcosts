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
      files: {
        Row: {
          id: string
          created_at: string
          file_name: string
          file_type: string
          file_size: number
          mime_type: string | null
          public_url: string
          supabase_path: string
        }
        Insert: {
          id?: string
          created_at?: string
          file_name: string
          file_type: string
          file_size: number
          mime_type?: string | null
          public_url: string
          supabase_path: string
        }
        Update: {
          id?: string
          created_at?: string
          file_name?: string
          file_type?: string
          file_size?: number
          mime_type?: string | null
          public_url?: string
          supabase_path?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}