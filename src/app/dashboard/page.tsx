"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ArrowUpRight,
  Clock,
  MoreHorizontal,
  Twitter,
  Linkedin,
  Zap,
  Loader2,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Filter,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { Trash2, Edit } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export default function DashboardPage() {
  const { session, user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("all"); // '7d' | '28d' | '90d' | 'all'
  const router = useRouter();

  useEffect(() => {
    async function fetchPosts() {
      if (!session?.access_token) return;
      try {
        const res = await fetch(`${API_URL}/api/posts`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [session]);

  const handlePostDelete = async (postId: string) => {
    if (!session?.access_token) return;
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`${API_URL}/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      } else {
        const data = await res.json();
        console.error("Failed to delete post:", data.error);
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  // Filter posts based on time window
  const filteredByTime = posts.filter((post) => {
    if (timeFilter === "all") return true;
    const date = new Date(post.created_at);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = diff / (1000 * 60 * 60 * 24);

    if (timeFilter === "7d") return days <= 7;
    if (timeFilter === "28d") return days <= 28;
    if (timeFilter === "90d") return days <= 90;
    return true;
  });

  const scheduledCount = posts.filter((p) => p.status === "scheduled").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const failedCount = posts.filter((p) => p.status === "failed").length;

  const twitterCount = filteredByTime.filter(
    (p) => p.platform === "twitter",
  ).length;
  const linkedinCount = filteredByTime.filter(
    (p) => p.platform === "linkedin",
  ).length;

  const chartData = [
    { name: "Twitter", value: twitterCount, color: "#000000" }, // Official X Black
    { name: "LinkedIn", value: linkedinCount, color: "#0A66C2" }, // Official LinkedIn Blue
  ].filter((d) => d.value > 0);

  const upcomingPosts = posts
    .filter(
      (p) =>
        p.status === "scheduled" ||
        p.status === "draft" ||
        p.status === "failed",
    )
    .sort((a, b) => {
      if (a.status === "failed" && b.status !== "failed") return -1;
      if (a.status !== "failed" && b.status === "failed") return 1;
      return (
        new Date(a.scheduled_at || a.created_at).getTime() -
        new Date(b.scheduled_at || b.created_at).getTime()
      );
    });

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Hero / Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-900 to-slate-900 p-8 md:p-12 shadow-2xl ring-1 ring-indigo-500/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                <Zap size={12} className="fill-current" />
                <span>Pro Account</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
                Good Morning, {user?.email?.split("@")[0] || "User"}
              </h1>
              <p className="text-indigo-200 text-lg max-w-xl">
                You have {scheduledCount} posts scheduled. Your engagement rate
                is looking solid this week.
              </p>
            </div>
            <Link href="/dashboard/create">
              <Button className="bg-white text-indigo-900 hover:bg-indigo-50 h-14 px-8 rounded-xl shadow-xl shadow-black/20 transition-all hover:scale-105 active:scale-95 font-bold text-base">
                <Plus className="mr-2 h-5 w-5" /> Create New Post
              </Button>
            </Link>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <PremiumStatCard
              title="Total Posts"
              value={filteredByTime.length.toString()}
              trend={timeFilter === "all" ? "Lifetime" : `Last ${timeFilter}`}
              chartColor="bg-indigo-500"
              icon={<BarChart3 className="text-indigo-400" />}
              filter={
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="bg-slate-800/50 border-none text-[10px] uppercase font-bold text-indigo-300 rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500/50"
                >
                  <option value="7d">7 Days</option>
                  <option value="28d">28 Days</option>
                  <option value="90d">90 Days</option>
                  <option value="all">All Time</option>
                </select>
              }
            />
            <PremiumStatCard
              title="Avg. Engagement"
              value="4.2%"
              trend="+0.8%"
              chartColor="bg-purple-500"
              icon={<TrendingUp className="text-purple-400" />}
            />
          </div>

          <Card className="border-none shadow-lg bg-slate-900/50 backdrop-blur-md rounded-2xl overflow-hidden ring-1 ring-white/10 p-6 flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider text-[10px]">
                Queue Health
              </p>
              <Zap size={14} className="text-emerald-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">
                  Scheduled
                </span>
                <span className="text-sm font-bold text-emerald-400">
                  {scheduledCount}
                </span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{
                    width: `${(scheduledCount / Math.max(posts.length, 1)) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">
                  Drafts
                </span>
                <span className="text-sm font-bold text-amber-400">
                  {draftCount}
                </span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{
                    width: `${(draftCount / Math.max(posts.length, 1)) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">
                  Failed
                </span>
                <span className="text-sm font-bold text-red-400">
                  {failedCount}
                </span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500"
                  style={{
                    width: `${(failedCount / Math.max(posts.length, 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-lg bg-slate-900/50 backdrop-blur-md rounded-2xl overflow-hidden ring-1 ring-white/10 p-6 flex flex-col group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider text-[10px]">
                Platform Split
              </p>
              <PieChartIcon size={14} className="text-indigo-400" />
            </div>
            <div className="flex-1 h-[120px] min-h-[120px] relative">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={35}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        fontSize: "10px",
                      }}
                      itemStyle={{ color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-600 italic">
                  No data
                </div>
              )}
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#000000] border border-white/20" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  X
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#0A66C2]" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  LinkedIn
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Split */}
        <div className="grid gap-8 md:grid-cols-12">
          {/* Recent Activity Feed */}
          <div className="md:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Upcoming Queue</h2>
              <Link
                href="/dashboard/schedule"
                className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                View Calendar
              </Link>
            </div>

            <Card className="border-none shadow-lg bg-slate-900/50 backdrop-blur-md rounded-2xl overflow-hidden ring-1 ring-white/10">
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-12 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                  </div>
                ) : upcomingPosts.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {upcomingPosts.map((post) => (
                      <QueueItem
                        key={post.id}
                        id={post.id}
                        platform={post.platform}
                        title={post.content}
                        time={
                          post.scheduled_at
                            ? new Date(post.scheduled_at).toLocaleString()
                            : "Draft"
                        }
                        status={post.status}
                        onDelete={() => handlePostDelete(post.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center space-y-4">
                    <p className="text-slate-400 font-medium">
                      No posts in the queue.
                    </p>
                    <Link href="/dashboard/create">
                      <Button variant="ghost" className="text-indigo-400">
                        Create your first post
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions / Connected Accounts */}
          <div className="md:col-span-4 space-y-6">
            <Card className="border-none shadow-lg bg-linear-to-br from-indigo-600 to-purple-700 text-white rounded-2xl p-6 relative overflow-hidden group">
              <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-1">
                <h3 className="text-xl font-bold mb-2">Upgrade to Pro</h3>
                <p className="text-indigo-100 mb-6 text-sm leading-relaxed">
                  Unlock AI scheduling, team collaboration, and unlimited
                  history access.
                </p>
                <Button
                  variant="secondary"
                  className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-none font-bold h-11"
                >
                  Upgrade Now
                </Button>
              </div>
              {/* Decorative Circle */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />
            </Card>

            <Card className="border-none shadow-lg bg-slate-900/50 backdrop-blur-md rounded-2xl ring-1 ring-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">
                  Quick Connect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#1DA1F2]/20 rounded-lg">
                      <Twitter className="w-5 h-5 text-[#1DA1F2] fill-current" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-200">
                        Twitter
                      </p>
                      <p className="text-xs text-slate-500">Not Connected</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-indigo-400 font-semibold hover:bg-indigo-500/10 hover:text-indigo-300"
                  >
                    Connect
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#0077b5]/20 rounded-lg">
                      <Linkedin className="w-5 h-5 text-[#0077b5] fill-current" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-200">
                        LinkedIn
                      </p>
                      <p className="text-xs text-emerald-500 font-medium">
                        Active
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-indigo-400 font-semibold hover:bg-indigo-500/10 hover:text-indigo-300"
                  >
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function PremiumStatCard({
  title,
  value,
  trend,
  chartColor,
  icon,
  filter,
}: {
  title: string;
  value: string;
  trend: string;
  chartColor: string;
  icon: React.ReactNode;
  filter?: React.ReactNode;
}) {
  return (
    <Card className="border-none shadow-lg bg-slate-900/50 backdrop-blur-md rounded-2xl overflow-hidden ring-1 ring-white/10 transition-all hover:shadow-indigo-500/10 hover:scale-[1.02] duration-300 group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider text-[10px]">
                {title}
              </p>
              {filter}
            </div>
            <h3 className="text-3xl font-bold text-white tracking-tight">
              {value}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/50 group-hover:bg-slate-800 transition-colors shadow-inner">
            {icon}
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <div className="h-1 flex-1 rounded-full bg-slate-800/50 overflow-hidden ring-1 ring-white/5">
            <div
              className={`h-full ${chartColor} w-[65%] rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.5)]`}
            />
          </div>
          <span className="text-xs font-bold text-indigo-300">{trend}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function QueueItem({
  id,
  platform,
  title,
  time,
  status,
  onDelete,
}: {
  id: string;
  platform: "twitter" | "linkedin";
  title: string;
  time: string;
  status: "scheduled" | "draft" | "failed";
  onDelete: () => void;
}) {
  const router = useRouter();

  return (
    <div className="group flex items-center justify-between p-4 hover:bg-white/5 transition-all cursor-pointer">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
            platform === "twitter"
              ? "bg-black text-white ring-1 ring-white/10"
              : "bg-[#0A66C2]/20 text-[#0A66C2] ring-1 ring-[#0A66C2]/20"
          }`}
        >
          {platform === "twitter" ? (
            <Twitter size={18} fill="currentColor" />
          ) : (
            <Linkedin size={18} fill="currentColor" />
          )}
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors text-sm line-clamp-1">
            {title}
          </h4>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-1">
            <Clock size={10} />
            <span>{time}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-4">
        <span
          className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
            status === "scheduled"
              ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
              : status === "failed"
                ? "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
                : "bg-slate-800 text-slate-400 ring-1 ring-slate-700"
          }`}
        >
          {status}
        </span>
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-500 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 relative z-10"
              >
                <MoreHorizontal size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 bg-slate-950 border-slate-800"
            >
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => router.push(`/dashboard/create/${id}`)}
              >
                <Edit size={14} />
                <span>Edit Post</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem
                className="gap-2 cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-400/10"
                onClick={onDelete}
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
