import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Slider } from '../ui/slider';
import { User, Bell, Globe, Layout, Shield, Save, Youtube, Twitter, Facebook, Mail, Phone, Image as ImageIcon, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function SettingsPanel() {
  const [settings, setSettings] = useState({
    // Account Settings
    siteName: 'NEWS4US',
    siteTagline: 'TRUTH IS OUR NATURE',
    adminEmail: 'newsforus.in@gmail.com',
    supportEmail: 'support@news4us.com',
    contactPhone: '9059788886',
    websiteUrl: 'http://www.news4us.in/',
    
    // Branding
    logoUrl: '',
    faviconUrl: '',
    
    // Social Media Links
    youtubeUrl: 'https://www.youtube.com/@News4Us',
    twitterUrl: 'https://twitter.com/news_4us',
    facebookUrl: 'https://www.fb.com/news4us',
    
    // Feature Flags
    enableBanners: true,
    enableNotifications: true,
    enableNewsletter: true,
    enableComments: false,
    enableDarkMode: true,
    enableQuickRead: true,
    
    // Layout Settings
    showBreakingNews: true,
    showLiveTicker: true,
    showSocialShare: true,
    showBackToTop: true,
    homepageFeaturedCount: 5,
    
    // Homepage Scroll Behavior
    enableAutoScroll: true,
    scrollSpeed: 50, // pixels per second
    scrollInterval: 3000, // milliseconds
    
    // Homepage Section Order
    sectionOrder: {
      hero: 1,
      politics: 2,
      health: 3,
      sports: 4,
      entertainment: 5,
    },
  });

  // Homepage settings stored in site_settings
  const [breakingNewsText, setBreakingNewsText] = useState('');
  const [videoNewsJson, setVideoNewsJson] = useState('');
  const [bannerCount, setBannerCount] = useState<number>(3);

  React.useEffect(() => {
    (async () => {
      try {
        const [breaking, videos, banners] = await Promise.all([
          api.settings.get<string[]>('breaking_news'),
          api.settings.get<any[]>('video_news'),
          api.settings.get<number>('homepage_banner_count')
        ]);
        if (Array.isArray(breaking)) setBreakingNewsText(breaking.join('\n'));
        if (videos) {
          try { setVideoNewsJson(JSON.stringify(videos, null, 2)); } catch {}
        }
        if (typeof banners === 'number') setBannerCount(banners);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleSave = async () => {
    try {
      const breaking = breakingNewsText.split('\n').map(s => s.trim()).filter(Boolean);
      await api.settings.upsert('breaking_news', breaking);
      if (videoNewsJson.trim()) {
        const parsed = JSON.parse(videoNewsJson);
        await api.settings.upsert('video_news', parsed);
      } else {
        await api.settings.upsert('video_news', []);
      }
      await api.settings.upsert('homepage_banner_count', bannerCount);
      toast.success('Settings saved successfully');
    } catch (e) {
      console.error(e);
      toast.error('Failed to save settings');
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      // Reset logic here
      toast.success('Settings reset to default');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage CMS configuration and preferences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Features</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="w-4 h-4" />
            <span className="hidden sm:inline">Layout</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="homepage" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Homepage</span>
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>
                Update your website's basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="siteTagline">Tagline</Label>
                <Input
                  id="siteTagline"
                  value={settings.siteTagline}
                  onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                  placeholder="Your trusted news source"
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  placeholder="9059788886"
                />
              </div>

              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={settings.websiteUrl}
                  onChange={(e) => setSettings({ ...settings, websiteUrl: e.target.value })}
                  placeholder="http://www.news4us.in/"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Update your social media profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="youtubeUrl" className="flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-red-600" />
                  YouTube Channel
                </Label>
                <Input
                  id="youtubeUrl"
                  type="url"
                  value={settings.youtubeUrl}
                  onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/@News4Us"
                />
              </div>

              <div>
                <Label htmlFor="twitterUrl" className="flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-blue-400" />
                  Twitter Profile
                </Label>
                <Input
                  id="twitterUrl"
                  type="url"
                  value={settings.twitterUrl}
                  onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                  placeholder="https://twitter.com/news_4us"
                />
              </div>

              <div>
                <Label htmlFor="facebookUrl" className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-600" />
                  Facebook Page
                </Label>
                <Input
                  id="facebookUrl"
                  type="url"
                  value={settings.facebookUrl}
                  onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                  placeholder="https://www.fb.com/news4us"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brand Logo Management</CardTitle>
              <CardDescription>
                Upload and manage your site logo and favicon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="logoUrl">Site Logo URL</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Upload logo in Image Manager, then paste URL here
                </p>
                <div className="flex gap-2">
                  <Input
                    id="logoUrl"
                    type="url"
                    value={settings.logoUrl}
                    onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                    placeholder="https://..."
                  />
                  <Button 
                    variant="outline"
                    className="flex-shrink-0"
                    onClick={() => toast.info('Navigate to Images tab to upload logo')}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Browse
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="faviconUrl">Favicon URL</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Small icon displayed in browser tab (16x16 or 32x32 px)
                </p>
                <div className="flex gap-2">
                  <Input
                    id="faviconUrl"
                    type="url"
                    value={settings.faviconUrl}
                    onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                    placeholder="https://..."
                  />
                  <Button 
                    variant="outline"
                    className="flex-shrink-0"
                    onClick={() => toast.info('Navigate to Images tab to upload favicon')}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Browse
                  </Button>
                </div>
              </div>

              {(settings.logoUrl || settings.faviconUrl) && (
                <div className="pt-2">
                  <Label>Preview</Label>
                  <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center gap-4">
                    {settings.logoUrl && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Logo</p>
                        <img src={settings.logoUrl} alt="Logo preview" className="h-12 object-contain" />
                      </div>
                    )}
                    {settings.faviconUrl && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Favicon</p>
                        <img src={settings.faviconUrl} alt="Favicon preview" className="h-8 object-contain" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your account preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                />
              </div>

              <Button className="bg-red-600 hover:bg-red-700">
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Homepage */}
        <TabsContent value="homepage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Breaking News</CardTitle>
              <CardDescription>One headline per line. If empty, latest published articles will be used.</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="breaking-lines">Headlines</Label>
              <textarea
                id="breaking-lines"
                value={breakingNewsText}
                onChange={(e) => setBreakingNewsText(e.target.value)}
                className="w-full mt-2 h-32 p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Video News (YouTube)</CardTitle>
              <CardDescription>Provide a JSON array of objects: [{`{ title, videoId, duration, source, views, timeAgo, isLive }`}].</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="video-json">Videos JSON</Label>
              <textarea
                id="video-json"
                value={videoNewsJson}
                onChange={(e) => setVideoNewsJson(e.target.value)}
                className="w-full mt-2 h-40 p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-mono text-xs"
                placeholder='[\n  { "title": "...", "videoId": "...", "source": "NEWS4US" }\n]'
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hero Banners</CardTitle>
              <CardDescription>Number of banner images (file_type = "banner") to rotate in hero background.</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="banner-count">Count</Label>
              <Input
                id="banner-count"
                type="number"
                min={0}
                max={10}
                value={bannerCount}
                onChange={(e) => setBannerCount(parseInt(e.target.value || '0', 10))}
                className="max-w-[200px] mt-1"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feature Flags */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Features</CardTitle>
              <CardDescription>
                Enable or disable website features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableBanners">Announcement Banners</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Show important announcements at the top
                  </p>
                </div>
                <Switch
                  id="enableBanners"
                  checked={settings.enableBanners}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, enableBanners: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableNotifications">Notifications</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enable push notifications for users
                  </p>
                </div>
                <Switch
                  id="enableNotifications"
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, enableNotifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableNewsletter">Newsletter Subscription</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Allow users to subscribe to newsletter
                  </p>
                </div>
                <Switch
                  id="enableNewsletter"
                  checked={settings.enableNewsletter}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, enableNewsletter: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableComments">Article Comments</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Allow users to comment on articles
                  </p>
                </div>
                <Switch
                  id="enableComments"
                  checked={settings.enableComments}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, enableComments: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableDarkMode">Dark Mode</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enable dark mode toggle for users
                  </p>
                </div>
                <Switch
                  id="enableDarkMode"
                  checked={settings.enableDarkMode}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, enableDarkMode: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableQuickRead">Quick Read Mode</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enable condensed article view mode
                  </p>
                </div>
                <Switch
                  id="enableQuickRead"
                  checked={settings.enableQuickRead}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, enableQuickRead: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Settings */}
        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Homepage Layout</CardTitle>
              <CardDescription>
                Customize homepage sections and visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showBreakingNews">Breaking News Ticker</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Show scrolling breaking news at top
                  </p>
                </div>
                <Switch
                  id="showBreakingNews"
                  checked={settings.showBreakingNews}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, showBreakingNews: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showLiveTicker">Live Market Ticker</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Display live stock market updates
                  </p>
                </div>
                <Switch
                  id="showLiveTicker"
                  checked={settings.showLiveTicker}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, showLiveTicker: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showSocialShare">Social Share Buttons</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enable social media sharing
                  </p>
                </div>
                <Switch
                  id="showSocialShare"
                  checked={settings.showSocialShare}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, showSocialShare: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showBackToTop">Back to Top Button</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Show scroll-to-top button
                  </p>
                </div>
                <Switch
                  id="showBackToTop"
                  checked={settings.showBackToTop}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, showBackToTop: checked })
                  }
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="featuredCount">Featured Articles Count</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Number of articles in hero section
                </p>
                <Input
                  id="featuredCount"
                  type="number"
                  min="3"
                  max="10"
                  value={settings.homepageFeaturedCount}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    homepageFeaturedCount: parseInt(e.target.value) 
                  })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Homepage Scroll Behavior</CardTitle>
              <CardDescription>
                Configure automatic scrolling for news sections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableAutoScroll">Enable Auto Scroll</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Automatically scroll through featured news
                  </p>
                </div>
                <Switch
                  id="enableAutoScroll"
                  checked={settings.enableAutoScroll}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, enableAutoScroll: checked })
                  }
                />
              </div>

              {settings.enableAutoScroll && (
                <>
                  <Separator />

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="scrollSpeed">Scroll Speed</Label>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {settings.scrollSpeed}px/s
                      </span>
                    </div>
                    <Slider
                      id="scrollSpeed"
                      value={[settings.scrollSpeed]}
                      onValueChange={(value) => setSettings({ 
                        ...settings, 
                        scrollSpeed: value[0] 
                      })}
                      min={20}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="scrollInterval">Scroll Interval</Label>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {settings.scrollInterval / 1000}s
                      </span>
                    </div>
                    <Slider
                      id="scrollInterval"
                      value={[settings.scrollInterval]}
                      onValueChange={(value) => setSettings({ 
                        ...settings, 
                        scrollInterval: value[0] 
                      })}
                      min={1000}
                      max={10000}
                      step={500}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Section Order</CardTitle>
              <CardDescription>
                Adjust the order of homepage sections (drag to reorder)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(settings.sectionOrder)
                  .sort(([, a], [, b]) => a - b)
                  .map(([section, order]) => (
                    <div
                      key={section}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="capitalize font-medium text-gray-900 dark:text-white">
                        {section}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Position: {order}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage security and authentication options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Require 2FA for admin login
                  </p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Session Timeout</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Auto logout after inactivity
                  </p>
                </div>
                <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                  <option>Never</option>
                </select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Login Attempts</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Max failed attempts before lockout
                  </p>
                </div>
                <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
                  <option>3 attempts</option>
                  <option>5 attempts</option>
                  <option>10 attempts</option>
                </select>
              </div>

              <Separator />

              <div>
                <Label>API Keys</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Manage API access keys
                </p>
                <Button variant="outline">Manage Keys</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                Recent security events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-900 dark:text-white">Login successful</span>
                  <span className="text-gray-500 dark:text-gray-400"> - 2 hours ago</span>
                </div>
                <div className="text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-900 dark:text-white">Password changed</span>
                  <span className="text-gray-500 dark:text-gray-400"> - 3 days ago</span>
                </div>
                <div className="text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-900 dark:text-white">2FA enabled</span>
                  <span className="text-gray-500 dark:text-gray-400"> - 1 week ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
