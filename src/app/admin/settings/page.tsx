"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { Loader2, Save, XCircle, Key, Shield, Bell, Settings, Lock, Mail, Smartphone, Server } from "lucide-react";

const initialSettings = {
  siteName: "NextGenRDP",
  logoUrl: "",
  password: "",
  enable2FA: false,
  emailNotifications: true,
  smsNotifications: false,
  maintenanceMode: false,
  apiKey: "sk-xxxx-xxxx-xxxx",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState<string | null>(null);

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (section: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setEdit(null);
      toast.success("Settings saved!");
    }, 1200);
  };

  const handleCancel = () => {
    setSettings(initialSettings);
    setEdit(null);
  };

  return (
    <div className="flex-1 p-0 bg-gradient-to-br from-white via-sky-50 to-indigo-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Admin Settings</h2>
        <div className="space-y-8">
          {/* General Settings */}
          <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100">
            <CardHeader className="flex flex-row items-center gap-3">
              <Settings className="h-6 w-6 text-sky-600" />
              <CardTitle>General</CardTitle>
              <Badge className="ml-auto bg-sky-100 text-sky-700">Site</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Site Name</label>
                <Input
                  value={settings.siteName}
                  disabled={edit !== "general"}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Logo URL</label>
                <Input
                  value={settings.logoUrl}
                  disabled={edit !== "general"}
                  onChange={(e) => handleChange("logoUrl", e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div className="flex gap-2 mt-4">
                {edit === "general" ? (
                  <>
                    <Button onClick={() => handleSave("general")} disabled={loading} className="bg-sky-600 text-white">
                      {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancel} disabled={loading} className="border-gray-200">
                      <XCircle className="h-4 w-4 mr-2" />Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setEdit("general")}>Edit</Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100">
            <CardHeader className="flex flex-row items-center gap-3">
              <Shield className="h-6 w-6 text-indigo-600" />
              <CardTitle>Security</CardTitle>
              <Badge className="ml-auto bg-indigo-100 text-indigo-700">Account</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Input
                  type="password"
                  value={settings.password}
                  disabled={edit !== "security"}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.enable2FA}
                  disabled={edit !== "security"}
                  onCheckedChange={(v) => handleChange("enable2FA", v)}
                />
                <span className="text-sm text-gray-700">Enable 2FA</span>
              </div>
              <div className="flex gap-2 mt-4">
                {edit === "security" ? (
                  <>
                    <Button onClick={() => handleSave("security")} disabled={loading} className="bg-indigo-600 text-white">
                      {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancel} disabled={loading} className="border-gray-200">
                      <XCircle className="h-4 w-4 mr-2" />Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setEdit("security")}>Edit</Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100">
            <CardHeader className="flex flex-row items-center gap-3">
              <Bell className="h-6 w-6 text-amber-500" />
              <CardTitle>Notifications</CardTitle>
              <Badge className="ml-auto bg-amber-100 text-amber-700">Alerts</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.emailNotifications}
                  disabled={edit !== "notifications"}
                  onCheckedChange={(v) => handleChange("emailNotifications", v)}
                />
                <Mail className="h-4 w-4 text-gray-400 ml-1" />
                <span className="text-sm text-gray-700">Email Notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.smsNotifications}
                  disabled={edit !== "notifications"}
                  onCheckedChange={(v) => handleChange("smsNotifications", v)}
                />
                <Smartphone className="h-4 w-4 text-gray-400 ml-1" />
                <span className="text-sm text-gray-700">SMS Notifications</span>
              </div>
              <div className="flex gap-2 mt-4">
                {edit === "notifications" ? (
                  <>
                    <Button onClick={() => handleSave("notifications")} disabled={loading} className="bg-amber-500 text-white">
                      {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancel} disabled={loading} className="border-gray-200">
                      <XCircle className="h-4 w-4 mr-2" />Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setEdit("notifications")}>Edit</Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100">
            <CardHeader className="flex flex-row items-center gap-3">
              <Server className="h-6 w-6 text-gray-700" />
              <CardTitle>System</CardTitle>
              <Badge className="ml-auto bg-gray-100 text-gray-700">System</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.maintenanceMode}
                  disabled={edit !== "system"}
                  onCheckedChange={(v) => handleChange("maintenanceMode", v)}
                />
                <span className="text-sm text-gray-700">Maintenance Mode</span>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">API Key</label>
                <Input
                  value={settings.apiKey}
                  disabled={edit !== "system"}
                  onChange={(e) => handleChange("apiKey", e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div className="flex gap-2 mt-4">
                {edit === "system" ? (
                  <>
                    <Button onClick={() => handleSave("system")} disabled={loading} className="bg-gray-700 text-white">
                      {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancel} disabled={loading} className="border-gray-200">
                      <XCircle className="h-4 w-4 mr-2" />Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setEdit("system")}>Edit</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 