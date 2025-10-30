import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  FileText, Users, Video, FileType, TrendingUp, Edit
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { supabase } from '../../lib/supabase';
import { api } from '../../lib/api';

interface DashboardHomeProps {
  onQuickAction: (action: string) => void;
}

export function DashboardHome({ onQuickAction }: DashboardHomeProps) {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalEPapers: 0,
    totalVideos: 0,
    totalUsers: 0,
  });

  const [viewsData, setViewsData] = useState<{ name: string; views: number; engagement: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [articleStatsData, setArticleStatsData] = useState<{ status: string; count: number }[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const dayLabels = useMemo(() => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], []);

  function timeAgo(date: Date) {
    const now = new Date().getTime();
    const diff = Math.max(0, now - date.getTime());
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }

  useEffect(() => {
    (async () => {
      try {
        // Stats
        const [articlesCount, epapersCount, profilesCount] = await Promise.all([
          supabase.from('articles').select('*', { count: 'exact', head: true }),
          supabase.from('e_papers').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
        ]);
        const videosSetting = await api.settings.get<any[]>('video_news');
        const totalVideos = Array.isArray(videosSetting) ? videosSetting.filter(v => v?.visible !== false).length : 0;

        setStats({
          totalArticles: articlesCount.count || 0,
          totalEPapers: epapersCount.count || 0,
          totalVideos,
          totalUsers: profilesCount.count || 0,
        });

        // Weekly data (past 7 days)
        const since = new Date();
        since.setDate(since.getDate() - 6);
        since.setHours(0,0,0,0);

        const [{ data: articleDates }, { data: epaperDates }] = await Promise.all([
          supabase
            .from('articles')
            .select('id,publish_date,created_at')
            .gte('publish_date', since.toISOString()),
          supabase
            .from('e_papers')
            .select('id,publication_date,created_at')
            .gte('publication_date', since.toISOString()),
        ]);

        const viewsPerDay: Record<string, number> = {};
        const engagementPerDay: Record<string, number> = {};
        const days: Date[] = [];
        for (let i = 0; i < 7; i++) {
          const d = new Date(since);
          d.setDate(since.getDate() + i);
          days.push(d);
          const key = d.toDateString();
          viewsPerDay[key] = 0;
          engagementPerDay[key] = 0;
        }

        (articleDates || []).forEach((row: any) => {
          const d = row.publish_date ? new Date(row.publish_date) : (row.created_at ? new Date(row.created_at) : null);
          if (!d) return;
          const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toDateString();
          if (key in viewsPerDay) viewsPerDay[key]++;
        });

        (epaperDates || []).forEach((row: any) => {
          const d = row.publication_date ? new Date(row.publication_date) : (row.created_at ? new Date(row.created_at) : null);
          if (!d) return;
          const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toDateString();
          if (key in engagementPerDay) engagementPerDay[key]++;
        });

        setViewsData(days.map(d => ({
          name: dayLabels[d.getDay()],
          views: viewsPerDay[d.toDateString()],
          engagement: engagementPerDay[d.toDateString()],
        })));

        // Category distribution
        const [{ data: categories }, { data: articleCats }] = await Promise.all([
          supabase.from('categories').select('id,name'),
          supabase.from('articles').select('category_id'),
        ]);
        const counts: Record<number, number> = {};
        (articleCats || []).forEach((r: any) => {
          if (r.category_id == null) return;
          counts[r.category_id] = (counts[r.category_id] || 0) + 1;
        });
        const palette = ['#ef4444', '#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#3b82f6'];
        const dist = (categories || []).map((c: any, i: number) => ({
          name: c.name || `Category ${c.id}`,
          value: counts[c.id] || 0,
          color: palette[i % palette.length],
        }))
        .filter(d => d.value > 0)
        .sort((a,b) => b.value - a.value)
        .slice(0, 6);
        setCategoryData(dist.length ? dist : [{ name: 'No Data', value: 1, color: '#9ca3af' }]);

        // Article status distribution
        const [pub, sched, draft] = await Promise.all([
          supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
          supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'scheduled'),
          supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
        ]);
        setArticleStatsData([
          { status: 'Published', count: pub.count || 0 },
          { status: 'Scheduled', count: sched.count || 0 },
          { status: 'Draft', count: draft.count || 0 },
        ]);

        // Recent activity
        const [articlesRecent, epapersRecent, profilesRecent] = await Promise.all([
          supabase.from('articles').select('id,title,status,created_at,updated_at,publish_date').order('updated_at', { ascending: false }).limit(10),
          supabase.from('e_papers').select('id,title,publication_date,created_at').order('created_at', { ascending: false }).limit(10),
          supabase.from('profiles').select('id,name,created_at').order('created_at', { ascending: false }).limit(10),
        ]);
        const videos = Array.isArray(videosSetting) ? videosSetting : [];

        const activity: any[] = [];
        (articlesRecent.data || []).forEach((a: any) => {
          const isPublished = a.status === 'published' || !!a.publish_date;
          const whenStr = a.updated_at || a.publish_date || a.created_at;
          const when = whenStr ? new Date(whenStr) : new Date();
          activity.push({
            id: `art-${a.id}-${when.getTime()}`,
            action: isPublished ? 'Article published' : 'Article updated',
            item: a.title,
            user: 'Editor',
            time: timeAgo(when),
            when: when.getTime(),
            type: isPublished ? 'publish' : 'edit',
          });
        });
        (epapersRecent.data || []).forEach((e: any) => {
          const whenStr = e.publication_date || e.created_at;
          const when = whenStr ? new Date(whenStr) : new Date();
          activity.push({
            id: `ep-${e.id}-${when.getTime()}`,
            action: 'E-Paper uploaded',
            item: e.title,
            user: 'Admin',
            time: timeAgo(when),
            when: when.getTime(),
            type: 'upload',
          });
        });
        (profilesRecent.data || []).forEach((p: any) => {
          const when = p.created_at ? new Date(p.created_at) : new Date();
          activity.push({
            id: `user-${p.id}-${when.getTime()}`,
            action: 'User added',
            item: p.name,
            user: 'Admin',
            time: timeAgo(when),
            when: when.getTime(),
            type: 'user',
          });
        });
        videos.forEach((v: any, idx: number) => {
          if (!v?.addedAt) return;
          const when = new Date(v.addedAt);
          activity.push({
            id: `vid-${idx}-${when.getTime()}`,
            action: 'Video link added',
            item: v.title || v.videoId || 'YouTube Video',
            user: 'Editor',
            time: timeAgo(when),
            when: when.getTime(),
            type: 'video',
          });
        });

        activity.sort((a, b) => b.when - a.when);
        setRecentActivity(activity.slice(0, 10));
      } catch (e) {
        console.error(e);
      }
    })();
  }, [dayLabels]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Welcome back! Here's your content overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onQuickAction('articles')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalArticles}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Articles</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onQuickAction('epaper')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <FileType className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalEPapers}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">E-Papers</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onQuickAction('youtube')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <Video className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalVideos}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">YouTube Links</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onQuickAction('users')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalUsers}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Registered Users</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => onQuickAction('new-article')}
              className="bg-red-600 hover:bg-red-700 h-auto py-4"
            >
              <span className="flex items-center"><span className="mr-2">+</span>New Article</span>
            </Button>
            <Button 
              onClick={() => onQuickAction('new-epaper')}
              variant="outline"
              className="h-auto py-4"
            >
              <span className="flex items-center"><span className="mr-2">+</span>Upload E-Paper</span>
            </Button>
            <Button 
              onClick={() => onQuickAction('new-video')}
              variant="outline"
              className="h-auto py-4"
            >
              <span className="flex items-center"><span className="mr-2">+</span>Add Video Link</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Articles & E-Papers</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Articles"
                />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  name="E-Papers"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Article Stats and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Article Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={articleStatsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="status" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="count" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'publish' ? 'bg-green-100 dark:bg-green-900/20' :
                    activity.type === 'upload' ? 'bg-purple-100 dark:bg-purple-900/20' :
                    activity.type === 'edit' ? 'bg-blue-100 dark:bg-blue-900/20' :
                    activity.type === 'video' ? 'bg-red-100 dark:bg-red-900/20' :
                    'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    {activity.type === 'publish' && <TrendingUp className="w-4 h-4 text-green-600" />}
                    {activity.type === 'upload' && <FileType className="w-4 h-4 text-purple-600" />}
                    {activity.type === 'edit' && <Edit className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'video' && <Video className="w-4 h-4 text-red-600" />}
                    {activity.type === 'user' && <Users className="w-4 h-4 text-gray-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {activity.item}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

