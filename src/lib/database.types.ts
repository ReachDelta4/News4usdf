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
      articles: {
        Row: {
          id: number
          title: string
          summary: string | null
          content: string | null
          author_id: number | null
          category_id: number | null
          status: 'draft' | 'scheduled' | 'published' | string | null
          published_at: string | null
          created_at: string | null
          updated_at: string | null
          views: number | null
          is_featured: boolean | null
          // added to align with app usage
          slug: string | null
          featured: boolean | null
          featured_image_url: string | null
          video_url: string | null
          read_time: number | null
          publish_date: string | null
          scheduled_date: string | null
        }
        Insert: {
          id?: number
          title: string
          summary?: string | null
          content?: string | null
          author_id?: number | null
          category_id?: number | null
          status?: 'draft' | 'scheduled' | 'published' | string | null
          published_at?: string | null
          created_at?: string | null
          updated_at?: string | null
          views?: number | null
          is_featured?: boolean | null
          slug?: string | null
          featured?: boolean | null
          featured_image_url?: string | null
          video_url?: string | null
          read_time?: number | null
          publish_date?: string | null
          scheduled_date?: string | null
        }
        Update: Partial<Database['public']['Tables']['articles']['Row']>
      }
      categories: {
        Row: {
          id: number
          name: string
          description: string | null
          created_at: string | null
          updated_at: string | null
          // added
          slug: string | null
          color: string | null
          icon: string | null
          featured: boolean | null
          parent_id: number | null
          display_order: number | null
          article_count: number | null
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
          slug?: string | null
          color?: string | null
          icon?: string | null
          featured?: boolean | null
          parent_id?: number | null
          display_order?: number | null
          article_count?: number | null
        }
        Update: Partial<Database['public']['Tables']['categories']['Row']>
      }
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          role: 'admin' | 'editor' | 'viewer' | string
          status: 'active' | 'inactive' | string
          email_verified: boolean
          phone_verified: boolean
          two_factor_enabled: boolean
          avatar_url: string | null
          bio: string | null
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          phone?: string | null
          role?: 'admin' | 'editor' | 'viewer' | string
          status?: 'active' | 'inactive' | string
          email_verified?: boolean
          phone_verified?: boolean
          two_factor_enabled?: boolean
          avatar_url?: string | null
          bio?: string | null
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      media_files: {
        Row: {
          id: string
          title: string
          alt_text: string | null
          file_url: string
          storage_path: string | null
          file_type: 'leadership' | 'banner' | 'article' | 'category' | 'logo' | 'general' | string
          mime_type: string | null
          file_size: number | null
          width: number | null
          height: number | null
          uploaded_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          alt_text?: string | null
          file_url: string
          storage_path?: string | null
          file_type: 'leadership' | 'banner' | 'article' | 'category' | 'logo' | 'general' | string
          mime_type?: string | null
          file_size?: number | null
          width?: number | null
          height?: number | null
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['media_files']['Row']>
      }
      e_papers: {
        Row: {
          id: string
          title: string
          description: string | null
          publication_date: string
          file_url: string
          storage_path: string | null
          file_name: string
          file_size: number | null
          visible: boolean
          downloads: number
          uploaded_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          publication_date: string
          file_url: string
          storage_path?: string | null
          file_name: string
          file_size?: number | null
          visible?: boolean
          downloads?: number
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['e_papers']['Row']>
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['site_settings']['Row']>
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string | null
          article_id: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          article_id?: number | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['bookmarks']['Row']>
      }
      article_tags: {
        Row: {
          article_id: number
          tag_id: number
        }
        Insert: {
          article_id: number
          tag_id: number
        }
        Update: Partial<Database['public']['Tables']['article_tags']['Row']>
      }
      tags: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: Partial<Database['public']['Tables']['tags']['Row']>
      }
      users: {
        Row: {
          id: number
          email: string
          password: string | null
          name: string | null
          role: string | null
          created_at: string | null
          updated_at: string | null
          last_login: string | null
          is_active: boolean | null
        }
        Insert: {
          id?: number
          email: string
          password?: string | null
          name?: string | null
          role?: string | null
          created_at?: string | null
          updated_at?: string | null
          last_login?: string | null
          is_active?: boolean | null
        }
        Update: Partial<Database['public']['Tables']['users']['Row']>
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
  }
}
