import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  FileText, Users, Video, FileType, TrendingUp, Activity,
  Plus, Eye, Edit
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface DashboardHomeProps {
  onQuickAction: (action: string) => void;
}

export function DashboardHome({ onQuickAction }: DashboardHomeProps) {
  // Mock data
  const stats = {
    totalArticles: 142,
    totalEPapers: 28,
    totalVideos: 45,
    totalUsers: 12,
  };

  const viewsData = [
    { name: 'Mon', views: 4200, engagement: 3100 },
    { name: 'Tue', views: 3800, engagement: 2900 },
    { name: 'Wed', views: 5200, engagement: 4100 },
    { name: 'Thu', views: 4800, engagement: 3600 },
    { name: 'Fri', views: 6400, engagement: 5200 },
    { name: 'Sat', views: 5800, engagement: 4800 },
    { name: 'Sun', views: 7200, engagement: 6100 },
  ];

  const categoryData = [
    { name: 'Politics', value: 30, color: '#ef4444' },
    { name: 'Health', value: 25, color: '#06b6d4' },
    { name: 'Sports', value: 20, color: '#10b981' },
    { name: 'Entertainment', value: 25, color: '#8b5cf6' },
  ];

  const articleStatsData = [
    { status: 'Published', count: 98 },
    { status: 'Scheduled', count: 23 },
    { status: 'Draft', count: 21 },
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Article published',
      item: 'Senate Passes Infrastructure Bill',
      user: 'Sarah Martinez',
      time: '2 hours ago',
      type: 'publish'
    },
    {
      id: 2,
      action: 'E-Paper uploaded',
      item: 'NEWS4US Daily - Jan 20',
      user: 'Admin',
      time: '4 hours ago',
      type: 'upload'
    },
    {
      id: 3,
      action: 'Article edited',
      item: 'Health Tips for Winter',
      user: 'Dr. Emily Rodriguez',
      time: '6 hours ago',
      type: 'edit'
    },
    {
      id: 4,
      action: 'User added',
      item: 'New editor account created',
      user: 'Admin',
      time: '1 day ago',
      type: 'user'
    },
    {
      id: 5,
      action: 'Video link added',
      item: 'Breaking News Coverage',
      user: 'James Thompson',
      time: '1 day ago',
      type: 'video'
    },
  ];

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
              <Plus className="w-5 h-5 mr-2" />
              <span>New Article</span>
            </Button>
            <Button 
              onClick={() => onQuickAction('new-epaper')}
              variant="outline"
              className="h-auto py-4"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span>Upload E-Paper</span>
            </Button>
            <Button 
              onClick={() => onQuickAction('new-video')}
              variant="outline"
              className="h-auto py-4"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span>Add Video Link</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Views & Engagement</CardTitle>
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
                  name="Views"
                />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  name="Engagement"
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
                  label={({ name, value }) => `${name}: ${value}%`}
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
                      {activity.user} · {activity.time}
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
