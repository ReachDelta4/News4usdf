import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Link, useRouter } from '../Router';
import { Shield, Eye, EyeOff, UserCheck } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { api } from '../../lib/api';

type UserRole = 'admin' | 'editor' | 'viewer';

export function AdminLoginPage() {
  const { navigate } = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { user } = await api.auth.signIn(formData.email, formData.password);
      if (!user) {
        toast.error('Invalid email or password');
      } else {
        const profile = await api.profiles.getById(user.id);
        const currentUser = {
          email: user.email || formData.email,
          name: (profile?.name || (user as any)?.user_metadata?.name || user.email || 'Admin') as string,
          role: ((profile?.role as any) || 'viewer') as UserRole,
        };
        localStorage.setItem('adminUser', JSON.stringify(currentUser));
        toast.success(`Welcome back, ${currentUser.name}!`);
        navigate('/admin');
      }
    } catch (err) {
      console.error(err);
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <Link to="/">
            <h1 className="text-2xl font-bold cursor-pointer">
              <span className="text-red-600">NEWS</span>
              <span className="text-gray-900 dark:text-white">4US</span>
            </h1>
          </Link>
          <CardTitle>Admin Portal</CardTitle>
          <CardDescription>Secure access for authorized personnel only</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your admin email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Authenticating...
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 mr-2" />
                  Access Admin Portal
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/auth" 
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Regular User Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

