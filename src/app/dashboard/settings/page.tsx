"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Check, Key, Lock, Mail, User, Bell, Shield, LogOut } from "lucide-react";

// Define validation schemas
const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  emailVerified: boolean;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { toast } = useToast();
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [serviceAlerts, setServiceAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Security preferences
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  
  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  });
  
  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) throw new Error("Failed to fetch user profile");
        
        const data = await response.json();
        if (data.user) {
          setUser({
            id: data.user.id,
            fullName: data.user.fullName || data.user.name,
            email: data.user.email,
            phone: data.user.phone || "",
            emailVerified: data.user.emailVerified || false,
          });
          
          // Update form with user data
          resetProfile({
            fullName: data.user.fullName || data.user.name,
            email: data.user.email,
            phone: data.user.phone || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [toast, resetProfile]);
  
  // Handle profile update
  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }
      
      const updatedUser = await response.json();
      setUser(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle password change
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsChangingPassword(true);
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to change password");
      }
      
      resetPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      toast({
        title: "Password Changed",
        description: "Your password has been changed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Password Change Failed",
        description: error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  // Handle notification preference changes
  const saveNotificationPreferences = async () => {
    setIsSaving(true);
    try {
      // Simulate API call to save notification preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Preferences Saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save notification preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle security preference changes
  const saveSecurityPreferences = async () => {
    setIsSaving(true);
    try {
      // Simulate API call to save security preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Security Settings Saved",
        description: "Your security settings have been updated.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save security settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    
    try {
      const response = await fetch("/api/auth/me", {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete account");
      }
      
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully.",
      });
      
      // Redirect to home page after account deletion
      window.location.href = "/";
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      
      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const renderSkeletons = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  );

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-4 mb-6"
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Settings</h2>
          <p className="text-muted-foreground mt-1 text-sm">Manage your account settings and preferences.</p>
        </div>
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                renderSkeletons()
              ) : (
                <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Full Name</span>
                      </div>
                    </Label>
                    <Input
                      id="fullName"
                      {...registerProfile("fullName")}
                      className={profileErrors.fullName ? "border-red-500" : ""}
                    />
                    {profileErrors.fullName && (
                      <p className="text-sm text-red-500">{profileErrors.fullName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>Email Address</span>
                        {user?.emailVerified && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            <Check className="mr-1 h-3 w-3" />
                            Verified
                          </span>
                        )}
                      </div>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...registerProfile("email")}
                      className={profileErrors.email ? "border-red-500" : ""}
                    />
                    {profileErrors.email && (
                      <p className="text-sm text-red-500">{profileErrors.email.message}</p>
                    )}
                    {!user?.emailVerified && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          toast({
                            title: "Verification Email Sent",
                            description: "Please check your inbox for the verification link.",
                          });
                        }}
                      >
                        Resend Verification Email
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      <div className="flex items-center gap-2">
                        <span>Phone Number (Optional)</span>
                      </div>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      {...registerProfile("phone")}
                    />
                  </div>
                  
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-red-200 dark:border-red-900/50">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border border-red-200 p-4 dark:border-red-900/50">
                  <h3 className="text-lg font-medium">Delete Account</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Once you delete your account, there is no going back. All your data will be permanently removed.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Password Tab */}
        <TabsContent value="password" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      <span>Current Password</span>
                    </div>
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...registerPassword("currentPassword")}
                    className={passwordErrors.currentPassword ? "border-red-500" : ""}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-red-500">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>New Password</span>
                    </div>
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...registerPassword("newPassword")}
                    className={passwordErrors.newPassword ? "border-red-500" : ""}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-500">{passwordErrors.newPassword.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...registerPassword("confirmPassword")}
                    className={passwordErrors.confirmPassword ? "border-red-500" : ""}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-red-500">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>
                
                <div className="bg-muted/30 p-3 rounded-md text-sm space-y-1">
                  <p>Password requirements:</p>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground">
                    <li>At least 8 characters long</li>
                    <li>Must contain at least one uppercase letter</li>
                    <li>Must contain at least one lowercase letter</li>
                    <li>Must contain at least one number</li>
                    <li>Must contain at least one special character</li>
                  </ul>
                </div>
                
                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? "Changing Password..." : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Manage your email notification preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email notifications for account activity.</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="order-updates" className="text-base">Order Updates</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications about your order status changes.</p>
                  </div>
                  <Switch
                    id="order-updates"
                    checked={orderUpdates}
                    onCheckedChange={setOrderUpdates}
                    disabled={!emailNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="service-alerts" className="text-base">Service Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified about service expirations and renewals.</p>
                  </div>
                  <Switch
                    id="service-alerts"
                    checked={serviceAlerts}
                    onCheckedChange={setServiceAlerts}
                    disabled={!emailNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails" className="text-base">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive promotional offers and updates about new services.</p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                    disabled={!emailNotifications}
                  />
                </div>
                
                <Button onClick={saveNotificationPreferences} disabled={isSaving} className="mt-2">
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor" className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>
                
                {twoFactorEnabled && (
                  <div className="bg-muted/30 p-4 rounded-md mt-2">
                    <h4 className="text-sm font-medium mb-2">Setup Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Two-factor authentication adds an extra layer of security to your account by requiring a code from your phone in addition to your password.
                    </p>
                    <Button variant="outline" size="sm">
                      <Shield className="h-4 w-4 mr-2" />
                      Setup 2FA
                    </Button>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="login-alerts" className="text-base">Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive email notifications for new login attempts.</p>
                  </div>
                  <Switch
                    id="login-alerts"
                    checked={loginAlerts}
                    onCheckedChange={setLoginAlerts}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-base font-medium">Active Sessions</h3>
                  <div className="bg-muted/30 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Current Session</p>
                        <p className="text-xs text-muted-foreground">Windows • Chrome • {new Date().toLocaleDateString()}</p>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button onClick={saveSecurityPreferences} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Settings"}
                  </Button>
                  
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}