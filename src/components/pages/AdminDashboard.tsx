import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Link, useRouter } from '../Router';
import {
  LayoutDashboard, FileText, Users, Settings, LogOut, Menu, X,
  FileType, Video, Tag, Bell, Search, Image
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { api } from '../../lib/api';

// Import CMS Components
import { DashboardHome } from '../cms/DashboardHome';
import { ArticlesPanel } from '../cms/ArticlesPanel';
import { CategoryManager } from '../cms/CategoryManager';
import { EPaperManager } from '../cms/EPaperManager';
import { YouTubeManager } from '../cms/YouTubeManager';
import { UserManager } from '../cms/UserManager';
import { SettingsPanel } from '../cms/SettingsPanel';
import { ImageManager } from '../cms/ImageManager';

interface AdminUser {
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  name: string;
}

export function AdminDashboard() {
  const { navigate } = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const user = await api.auth.getUser();
        const storedUser = localStorage.getItem('adminUser');
        if (user && storedUser) {
          const parsed = JSON.parse(storedUser);
          const profile = await api.profiles.getById(user.id);
          if (profile?.role && parsed.role !== profile.role) {
            parsed.role = profile.role as any;
            localStorage.setItem('adminUser', JSON.stringify(parsed));
          }
          setCurrentUser(parsed);
        } else {
          navigate('/admin-login');
        }
      } catch (e) {
        console.error(e);
        navigate('/admin-login');
      }
    })();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    navigate('/admin-login');
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-article':
        setActiveTab('articles');
        // Trigger new article creation
        break;
      case 'new-epaper':
        setActiveTab('epaper');
        break;
      case 'new-video':
        setActiveTab('youtube');
        break;
      case 'articles':
        setActiveTab('articles');
        break;
      case 'epaper':
        setActiveTab('epaper');
        break;
      case 'youtube':
        setActiveTab('youtube');
        break;
      case 'users':
        setActiveTab('users');
        break;
      default:
        break;
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'images', label: 'Images', icon: Image },
    { id: 'epaper', label: 'E-Paper', icon: FileType },
    { id: 'youtube', label: 'YouTube Links', icon: Video },
    { id: 'categories', label: 'Categories', icon: Tag },
    ...(currentUser?.role === 'admin' ? [{ id: 'users', label: 'Users', icon: Users }] : []),
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex flex-col fixed h-screen z-50`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <Link to="/">
                <h1 className="font-bold cursor-pointer text-xl">
                  <span className="text-red-600">NEWS</span>
                  <span className="text-gray-900 dark:text-white">4US</span>
                </h1>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'default' : 'ghost'}
                className={`w-full justify-start ${
                  activeTab === item.id 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="w-4 h-4" />
                {sidebarOpen && <span className="ml-3">{item.label}</span>}
              </Button>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} mb-2`}>
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 dark:text-red-400 font-medium">
                {currentUser.name.charAt(0)}
              </span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {currentUser.role}
                </p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className={`${sidebarOpen ? 'w-full justify-start' : 'w-full justify-center'} text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20`}
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Header Bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search articles, users, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full"
                  />
                </div>
              </div>

              {/* Right Side Controls */}
              <div className="flex items-center space-x-4 ml-4">
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
                </Button>

                {/* Admin Profile Dropdown */}
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <span className="text-red-600 dark:text-red-400 text-sm font-medium">
                      {currentUser.name.charAt(0)}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {currentUser.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <DashboardHome onQuickAction={handleQuickAction} />
          )}

          {activeTab === 'articles' && (
            <ArticlesPanel currentUser={currentUser} />
          )}

          {activeTab === 'images' && (
            <ImageManager />
          )}

          {activeTab === 'categories' && (
            <CategoryManager />
          )}

          {activeTab === 'epaper' && (
            <EPaperManager />
          )}

          {activeTab === 'youtube' && (
            <YouTubeManager />
          )}

          {activeTab === 'users' && currentUser.role === 'admin' && (
            <UserManager />
          )}

          {activeTab === 'settings' && (
            <SettingsPanel />
          )}
        </div>
      </div>
    </div>
  );
}


