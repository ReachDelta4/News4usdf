import { supabase } from './supabase';
import type { Database } from './database.types';

type Tables = Database['public']['Tables'];
type Article = Tables['articles']['Row'];
type ArticleInsert = Tables['articles']['Insert'];
type ArticleUpdate = Tables['articles']['Update'];
type Category = Tables['categories']['Row'];
type CategoryInsert = Tables['categories']['Insert'];
type CategoryUpdate = Tables['categories']['Update'];
type MediaFile = Tables['media_files']['Row'];
type MediaFileInsert = Tables['media_files']['Insert'];
type MediaFileUpdate = Tables['media_files']['Update'];
type EPaper = Tables['e_papers']['Row'];
type EPaperInsert = Tables['e_papers']['Insert'];
type EPaperUpdate = Tables['e_papers']['Update'];
type Profile = Tables['profiles']['Row'];
type ProfileInsert = Tables['profiles']['Insert'];
type ProfileUpdate = Tables['profiles']['Update'];

export const api = {
  articles: {
    async getAll(filters?: {
      status?: 'draft' | 'scheduled' | 'published';
      category_id?: number;
      featured?: boolean;
      limit?: number;
      offset?: number;
    }) {
      let query = supabase
        .from('articles')
        .select(`
          *,
          categories (id, name, slug, color),
          users (id, name, email),
          article_tags ( tags ( name ) )
        `)
        // Latest first by publish_date when available, otherwise fallback naturally
        .order('publish_date', { ascending: false, nullsFirst: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.category_id !== undefined) {
        query = query.eq('category_id', filters.category_id);
      }
      if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },

    async getBySlug(slug: string) {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          categories (id, name, slug, color),
          users (id, name, email),
          article_tags ( tags ( name ) )
        `)
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async getById(id: number) {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          categories (id, name, slug, color),
          users (id, name, email),
          article_tags ( tags ( name ) )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async create(article: ArticleInsert, tags: string[] = []) {
      const { data, error } = await supabase
        .from('articles')
        .insert(article)
        .select()
        .single();

      if (error) throw error;

      if (tags.length > 0 && data) {
        // upsert tags by name
        const { data: tagsRows, error: tagErr } = await supabase
          .from('tags')
          .upsert(tags.map((name) => ({ name })), { onConflict: 'name' })
          .select();
        if (tagErr) throw tagErr;
        const tagIds = (tagsRows || []).filter(Boolean).map((t: any) => ({ article_id: data.id as number, tag_id: t.id as number }));
        if (tagIds.length) {
          const { error: atErr } = await supabase.from('article_tags').insert(tagIds);
          if (atErr) throw atErr;
        }
      }

      return data;
    },

    async update(id: number, updates: ArticleUpdate, tags?: string[]) {
      const { data, error } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (tags !== undefined) {
        // replace tag set
        await supabase.from('article_tags').delete().eq('article_id', id);
        if (tags.length > 0) {
          const { data: tagsRows, error: tagErr } = await supabase
            .from('tags')
            .upsert(tags.map((name) => ({ name })), { onConflict: 'name' })
            .select();
          if (tagErr) throw tagErr;
          const tagIds = (tagsRows || []).filter(Boolean).map((t: any) => ({ article_id: id, tag_id: t.id as number }));
          if (tagIds.length) {
            const { error: atErr } = await supabase.from('article_tags').insert(tagIds);
            if (atErr) throw atErr;
          }
        }
      }

      return data;
    },

    async delete(id: number) {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },

    async incrementViews(id: number) {
      const { error } = await supabase.rpc('increment_article_views', { article_id: id });
      if (error) console.error('Failed to increment views:', error);
    }
  },

  categories: {
    async getAll(featured?: boolean) {
      let query = supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (featured !== undefined) {
        query = query.eq('featured', featured);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },

    async getBySlug(slug: string) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async create(category: CategoryInsert) {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async update(id: number, updates: CategoryUpdate) {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async delete(id: number) {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },

    async updateOrder(categoryOrders: { id: number; display_order: number }[]) {
      const promises = categoryOrders.map(({ id, display_order }) =>
        supabase
          .from('categories')
          .update({ display_order })
          .eq('id', id)
      );

      await Promise.all(promises);
    }
  },

  mediaFiles: {
    async getAll(fileType?: string) {
      let query = supabase
        .from('media_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (fileType) {
        query = query.eq('file_type', fileType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async create(media: MediaFileInsert) {
      const { data, error } = await supabase
        .from('media_files')
        .insert(media)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async update(id: string, updates: MediaFileUpdate) {
      const { data, error } = await supabase
        .from('media_files')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async delete(id: string) {
      const mediaFile = await this.getById(id);

      if (mediaFile?.storage_path) {
        await supabase.storage
          .from('media')
          .remove([mediaFile.storage_path]);
      }

      const { error } = await supabase
        .from('media_files')
        .delete()
        .eq('id', id);

      if (error) throw error;
    }
  },

  ePapers: {
    async getAll(visible?: boolean) {
      let query = supabase
        .from('e_papers')
        .select('*')
        .order('publication_date', { ascending: false });

      if (visible !== undefined) {
        query = query.eq('visible', visible);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('e_papers')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async create(epaper: EPaperInsert) {
      const { data, error } = await supabase
        .from('e_papers')
        .insert(epaper)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async update(id: string, updates: EPaperUpdate) {
      const { data, error } = await supabase
        .from('e_papers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async delete(id: string) {
      const epaper = await this.getById(id);

      if (epaper?.storage_path) {
        await supabase.storage
          .from('e-papers')
          .remove([epaper.storage_path]);
      }

      const { error } = await supabase
        .from('e_papers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },

    async incrementDownloads(id: string) {
      const { error } = await supabase.rpc('increment_epaper_downloads', { epaper_id: id });
      if (error) console.error('Failed to increment downloads:', error);
    }
  },

  profiles: {
    async getAll() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async getCurrent() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      return this.getById(user.id);
    },

    async create(profile: ProfileInsert) {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profile)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async update(id: string, updates: ProfileUpdate) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },

    async updateLastLogin(id: string) {
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', id);
    }
  },

  storage: {
    async uploadFile(bucket: string, path: string, file: File) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return { path: data.path, publicUrl };
    },

    async deleteFile(bucket: string, path: string) {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
    },

    getPublicUrl(bucket: string, path: string) {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return data.publicUrl;
    }
  },

  settings: {
    async get<T = any>(key: string): Promise<T | null> {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', key)
        .maybeSingle();
      if (error) throw error;
      return (data?.value ?? null) as T | null;
    },

    async upsert(key: string, value: any, description?: string) {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert({ key, value, description }, { onConflict: 'key' })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  auth: {
    async signUp(email: string, password: string, name: string) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        await api.profiles.create({
          id: data.user.id,
          name,
          email
        });
      }

      return data;
    },

    async signIn(email: string, password: string) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        await api.profiles.updateLastLogin(data.user.id);
      }

      return data;
    },

    async signOut() {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },

    async resetPassword(email: string) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    },

    async updatePassword(newPassword: string) {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
    },

    async getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },

    async getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },

    onAuthStateChange(callback: (event: string, session: any) => void) {
      return supabase.auth.onAuthStateChange((event, session) => {
        (async () => {
          callback(event, session);
        })();
      });
    }
  }
};

export type { Article, Category, MediaFile, EPaper, Profile };
