import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { 
  Plus, Edit, Trash2, User, Mail, Phone, Shield, 
  CheckCircle, XCircle, Key
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { api } from '../../lib/api';

interface CMSUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin: string;
  articlesCount?: number;
}

export function UserManager() {
  const [users, setUsers] = useState<CMSUser[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const rows = await api.profiles.getAll();
        const mapped: CMSUser[] = (rows || []).map((r: any) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone || '',
          role: (r.role as any) || 'viewer',
          status: (r.status as any) || 'active',
          emailVerified: !!r.email_verified,
          phoneVerified: !!r.phone_verified,
          twoFactorEnabled: !!r.two_factor_enabled,
          lastLogin: r.last_login ? new Date(r.last_login).toLocaleString() : 'Never',
          articlesCount: 0,
        }));
        setUsers(mapped);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const [editingUser, setEditingUser] = useState<CMSUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = async () => {
    if (!editingUser) return;

    if (!editingUser.name || !editingUser.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingUser.id) {
      try {
        await api.profiles.update(editingUser.id, {
          name: editingUser.name,
          email: editingUser.email,
          phone: editingUser.phone || null,
          role: editingUser.role as any,
          status: editingUser.status as any,
          email_verified: editingUser.emailVerified,
          phone_verified: editingUser.phoneVerified,
          two_factor_enabled: editingUser.twoFactorEnabled,
        } as any);
        setUsers(prev => prev.map(user => user.id === editingUser.id ? editingUser : user));
        toast.success('User updated successfully');
      } catch (e) { console.error(e); toast.error('Failed to update user'); }
    } else {
      toast.error('Creating users requires an invitation via Supabase Auth');
    }

    setIsDialogOpen(false);
    setEditingUser(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await api.profiles.delete(id);
      } catch (e) { console.error(e); }
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success('User removed');
    }
  };

  const handleToggleStatus = async (id: string) => {
    const target = users.find(u => u.id === id);
    if (!target) return;
    const nextStatus = target.status === 'active' ? 'inactive' : 'active';
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: nextStatus } : u));
    try { await api.profiles.update(id, { status: nextStatus } as any); } catch (e) { console.error(e); }
  };

  const handleResetPassword = async (user: CMSUser) => {
    try { await api.auth.resetPassword(user.email); toast.success(`Reset link sent to ${user.email}`); }
    catch (e) { console.error(e); toast.error('Failed to send reset link'); }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'editor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'viewer':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage CMS users and permissions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingUser({
                  id: '',
                  name: '',
                  email: '',
                  phone: '',
                  role: 'viewer',
                  status: 'active',
                  emailVerified: false,
                  phoneVerified: false,
                  twoFactorEnabled: false,
                  lastLogin: 'Never',
                });
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingUser?.id ? 'Edit User' : 'Add New User'}
              </DialogTitle>
            </DialogHeader>
            {editingUser && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({
                      ...editingUser,
                      name: e.target.value,
                    })}
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({
                      ...editingUser,
                      email: e.target.value,
                    })}
                    placeholder="john@news4us.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({
                      ...editingUser,
                      phone: e.target.value,
                    })}
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <Label htmlFor="role">User Role</Label>
                  <Select
                    value={editingUser.role}
                    onValueChange={(value: any) => setEditingUser({
                      ...editingUser,
                      role: value,
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {editingUser.role === 'admin' && 'Full access to all features'}
                    {editingUser.role === 'editor' && 'Can create and edit articles'}
                    {editingUser.role === 'viewer' && 'Read-only access'}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailVerified">Email Verified</Label>
                    <Switch
                      id="emailVerified"
                      checked={editingUser.emailVerified}
                      onCheckedChange={(checked) => setEditingUser({
                        ...editingUser,
                        emailVerified: checked,
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="phoneVerified">Phone Verified</Label>
                    <Switch
                      id="phoneVerified"
                      checked={editingUser.phoneVerified}
                      onCheckedChange={(checked) => setEditingUser({
                        ...editingUser,
                        phoneVerified: checked,
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="twoFactor">Two-Factor Auth</Label>
                    <Switch
                      id="twoFactor"
                      checked={editingUser.twoFactorEnabled}
                      onCheckedChange={(checked) => setEditingUser({
                        ...editingUser,
                        twoFactorEnabled: checked,
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="status">Account Active</Label>
                    <Switch
                      id="status"
                      checked={editingUser.status === 'active'}
                      onCheckedChange={(checked) => setEditingUser({
                        ...editingUser,
                        status: checked ? 'active' : 'inactive',
                      })}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingUser(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {editingUser.id ? 'Update' : 'Create'} User
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.emailVerified ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Email
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {user.phoneVerified ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Phone
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingUser(user);
                            setIsDialogOpen(true);
                          }}
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleResetPassword(user)}
                          title="Reset Password"
                        >
                          <Key className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleStatus(user.id)}
                          title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {user.status === 'active' ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
