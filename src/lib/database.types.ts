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
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          role: 'admin' | 'editor' | 'viewer'
          status: 'active' | 'inactive'
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
          role?: 'admin' | 'editor' | 'viewer'
          status?: 'active' | 'inactive'
          email_verified?: boolean
          phone_verified?: boolean
          two_factor_enabled?: boolean
          avatar_url?: string | null
          bio?: string | null
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          role?: 'admin' | 'editor' | 'viewer'
          status?: 'active' | 'inactive'
          email_verified?: boolean
          phone_verified?: boolean
          two_factor_enabled?: boolean
          avatar_url?: string | null
          bio?: string | null
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          color: string
          icon: string | null
          featured: boolean
          parent_id: string | null
          display_order: number
          article_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          color?: string
          icon?: string | null
          featured?: boolean
          parent_id?: string | null
          display_order?: number
          article_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          color?: string
          icon?: string | null
          featured?: boolean
          parent_id?: string | null
          display_order?: number
          article_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          summary: string | null
          content: string
          category_id: string | null
          author_id: string | null
          status: 'draft' | 'scheduled' | 'published'
          featured: boolean
          featured_image_url: string | null
          video_url: string | null
          views: number
          read_time: number | null
          publish_date: string | null
          scheduled_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          summary?: string | null
          content: string
          category_id?: string | null
          author_id?: string | null
          status?: 'draft' | 'scheduled' | 'published'
          featured?: boolean
          featured_image_url?: string | null
          video_url?: string | null
          views?: number
          read_time?: number | null
          publish_date?: string | null
          scheduled_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          summary?: string | null
          content?: string
          category_id?: string | null
          author_id?: string | null
          status?: 'draft' | 'scheduled' | 'published'
          featured?: boolean
          featured_image_url?: string | null
          video_url?: string | null
          views?: number
          read_time?: number | null
          publish_date?: string | null
          scheduled_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      article_tags: {
        Row: {
          id: string
          article_id: string | null
          tag: string
          created_at: string
        }
        Insert: {
          id?: string
          article_id?: string | null
          tag: string
          created_at?: string
        }
        Update: {
          id?: string
          article_id?: string | null
          tag?: string
          created_at?: string
        }
      }
      media_files: {
        Row: {
          id: string
          title: string
          alt_text: string | null
          file_url: string
          storage_path: string | null
          file_type: 'leadership' | 'banner' | 'article' | 'category' | 'logo' | 'general'
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
          file_type: 'leadership' | 'banner' | 'article' | 'category' | 'logo' | 'general'
          mime_type?: string | null
          file_size?: number | null
          width?: number | null
          height?: number | null
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          alt_text?: string | null
          file_url?: string
          storage_path?: string | null
          file_type?: 'leadership' | 'banner' | 'article' | 'category' | 'logo' | 'general'
          mime_type?: string | null
          file_size?: number | null
          width?: number | null
          height?: number | null
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
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
        Update: {
          id?: string
          title?: string
          description?: string | null
          publication_date?: string
          file_url?: string
          storage_path?: string | null
          file_name?: string
          file_size?: number | null
          visible?: boolean
          downloads?: number
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
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
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string | null
          article_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          article_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          article_id?: string | null
          created_at?: string
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
