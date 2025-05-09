export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      notes: {
        Row: {
          id: number
          title: string
        }
        Insert: {
          id?: number
          title: string
        }
        Update: {
          id?: number
          title?: string
        }
        Relationships: []
      }
      company_info: {
        Row: {
          id: number
          name: string
          address: string
          phone: string
          logo?: string
          pdf_file_name?: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          address: string
          phone: string
          logo?: string
          pdf_file_name?: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          address?: string
          phone?: string
          logo?: string
          pdf_file_name?: string
          created_at?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
