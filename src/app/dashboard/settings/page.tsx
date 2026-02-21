"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Twitter,
  Linkedin,
  CheckCircle2,
  AlertCircle,
  Shield,
  Zap,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type Connection = {
  platform: string;
  platform_username: string;
  updated_at: string;
};

export default function SettingsPage() {
  const { session } = useAuth();
  const searchParams = useSearchParams();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);

  const status = searchParams.get("status");
  const platform = searchParams.get("platform");

  useEffect(() => {
    async function fetchConnections() {
      if (!session?.access_token) return;

      try {
        const res = await fetch(`${API_URL}/api/auth/connections`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setConnections(data);
        }
      } catch (err) {
        console.error("Failed to fetch connections:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchConnections();
  }, [session]);

  const handleConnectTwitter = async () => {
    if (!session?.access_token) return;
    setConnecting("twitter");

    // Simplest for now: Open in same window
    window.location.href = `${API_URL}/api/auth/twitter/login?access_token=${session.access_token}`;
  };

  const handleConnectLinkedin = async () => {
    if (!session?.access_token) return;
    setConnecting("linkedin");
    window.location.href = `${API_URL}/api/auth/linkedin/login?access_token=${session.access_token}`;
  };

  const isTwitterConnected = connections.find((c) => c.platform === "twitter");
  const isLinkedinConnected = connections.find(
    (c) => c.platform === "linkedin",
  );

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Settings & Connections
          </h1>
          <p className="text-slate-400">
            Manage your connected social accounts and preferences.
          </p>
        </div>

        {status === "success" && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={18} />
            <span>Successfully connected your {platform} account!</span>
          </div>
        )}

        {status === "error" && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} />
            <span>
              Failed to connect your {platform} account. Please try again.
            </span>
          </div>
        )}

        {/* Connected Accounts Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="h-6 w-1 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            <h2 className="text-xl font-bold text-slate-100">
              Social Accounts
            </h2>
          </div>

          <div className="grid gap-6">
            {/* Twitter / X Card */}
            <Card
              className={`border-none shadow-lg bg-slate-900/50 backdrop-blur-sm ring-1 overflow-hidden group transition-all duration-500 ${isTwitterConnected ? "ring-indigo-500/50" : "ring-white/10 hover:ring-indigo-500/30"}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6 relative z-10">
                <div className="flex items-center gap-5">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner ring-1 ${isTwitterConnected ? "bg-indigo-500/20 text-indigo-400 ring-indigo-500/30" : "bg-black/40 text-white ring-white/10"}`}
                  >
                    <Twitter
                      size={32}
                      fill="currentColor"
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">
                      Twitter / X
                    </h3>
                    {isTwitterConnected ? (
                      <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
                        <CheckCircle2 size={14} />
                        <span>
                          Connected as @{isTwitterConnected.platform_username}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <AlertCircle size={14} className="text-amber-500" />
                        <span>Not connected</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  onClick={handleConnectTwitter}
                  disabled={connecting === "twitter" || !!isTwitterConnected}
                  className={`${isTwitterConnected ? "bg-slate-800 text-slate-400 cursor-not-allowed" : "bg-white text-slate-900 hover:bg-slate-200 shadow-lg shadow-white/5"} min-w-[140px] font-semibold transition-all`}
                >
                  {connecting === "twitter" ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : isTwitterConnected ? (
                    "Connected"
                  ) : (
                    "Connect Account"
                  )}
                </Button>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </Card>

            {/* LinkedIn Card */}
            <Card
              className={`border-none shadow-lg bg-linear-to-r backdrop-blur-sm ring-1 overflow-hidden group transition-all duration-500 ${isLinkedinConnected ? "from-indigo-900/20 to-slate-900/50 ring-indigo-500/30" : "bg-slate-900/50 ring-white/10 hover:ring-indigo-500/30"}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
                <div className="flex items-center gap-5">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ring-1 ${isLinkedinConnected ? "bg-[#0077b5]/20 text-[#0077b5] ring-[#0077b5]/20" : "bg-black/40 text-white ring-white/10"}`}
                  >
                    <Linkedin size={32} fill="currentColor" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">LinkedIn</h3>
                    {isLinkedinConnected ? (
                      <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
                        <CheckCircle2 size={14} />
                        <span>Connected</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <AlertCircle size={14} className="text-amber-500" />
                        <span>Not connected</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isLinkedinConnected ? (
                    <>
                      <Button
                        variant="outline"
                        className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
                      >
                        Reconnect
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleConnectLinkedin}
                      disabled={connecting === "linkedin"}
                      className="bg-white text-slate-900 hover:bg-slate-200 min-w-[140px] shadow-lg shadow-white/5 font-semibold"
                    >
                      {connecting === "linkedin" ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        "Connect Account"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="space-y-6 pt-6 border-t border-white/5">
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="h-6 w-1 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
            <h2 className="text-xl font-bold text-slate-100">Preferences</h2>
          </div>

          <Card className="border-none shadow-lg bg-slate-900/50 backdrop-blur-sm ring-1 ring-white/10">
            <div className="divide-y divide-white/5">
              <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-amber-400" />
                    <h4 className="font-semibold text-slate-200">
                      Smart Scheduling
                    </h4>
                  </div>
                  <p className="text-sm text-slate-400">
                    Automatically pick the best times to post.
                  </p>
                </div>
                <Switch />
              </div>
              <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-200">
                    Auto-shorten Links
                  </h4>
                  <p className="text-sm text-slate-400">
                    Shorten all shared URLs using our custom shortener.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}
