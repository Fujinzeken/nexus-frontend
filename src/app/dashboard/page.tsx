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
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
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
                Good Morning, Micheal
              </h1>
              <p className="text-indigo-200 text-lg max-w-xl">
                You have 4 posts scheduled for today. Your engagement rate is up
                by 12% this week.
              </p>
            </div>
            <Link href="/dashboard/create">
              <Button className="bg-white text-indigo-900 hover:bg-indigo-50 h-14 px-8 rounded-xl shadow-xl shadow-black/20 transition-all hover:scale-105 active:scale-95 font-bold text-base">
                <Plus className="mr-2 h-5 w-5" /> Creates New Post
              </Button>
            </Link>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <PremiumStatCard
            title="Total Reach"
            value="128.4K"
            trend="+12%"
            chartColor="bg-indigo-500"
            icon={<Zap className="text-indigo-400" />}
          />
          <PremiumStatCard
            title="Engagement"
            value="24.5K"
            trend="+5.2%"
            chartColor="bg-purple-500"
            icon={<ArrowUpRight className="text-purple-400" />}
          />
          <PremiumStatCard
            title="Scheduled"
            value="14"
            trend="Upcoming"
            chartColor="bg-emerald-500"
            icon={<Clock className="text-emerald-400" />}
          />
          <PremiumStatCard
            title="Followers"
            value="8,942"
            trend="+134"
            chartColor="bg-amber-500"
            icon={<Zap className="text-amber-400" />}
          />
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
                <div className="divide-y divide-white/5">
                  <QueueItem
                    platform="linkedin"
                    title="Product Launch Announcement"
                    time="Today, 2:00 PM"
                    status="scheduled"
                  />
                  <QueueItem
                    platform="twitter"
                    title="Thread: 5 Tips for Productivity"
                    time="Tomorrow, 10:00 AM"
                    status="scheduled"
                  />
                  <QueueItem
                    platform="linkedin"
                    title="Hiring Update - New Roles"
                    time="Fri, 9:00 AM"
                    status="draft"
                  />
                </div>
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
}: {
  title: string;
  value: string;
  trend: string;
  chartColor: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-none shadow-lg bg-slate-900/50 backdrop-blur-md rounded-2xl overflow-hidden ring-1 ring-white/10 transition-all hover:shadow-indigo-500/10 hover:scale-[1.02] duration-300 group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider text-[10px]">
              {title}
            </p>
            <h3 className="text-3xl font-bold text-white">{value}</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/50 group-hover:bg-slate-800 transition-colors">
            {icon}
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <div
            className={`h-1.5 flex-1 rounded-full bg-slate-800 overflow-hidden`}
          >
            <div
              className={`h-full ${chartColor} w-[65%] rounded-full animate-pulse`}
            />
          </div>
          <span className="text-xs font-bold text-indigo-300">{trend}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function QueueItem({
  platform,
  title,
  time,
  status,
}: {
  platform: "twitter" | "linkedin";
  title: string;
  time: string;
  status: "scheduled" | "draft";
}) {
  return (
    <div className="group flex items-center justify-between p-5 hover:bg-white/5 transition-all cursor-pointer">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
            platform === "twitter"
              ? "bg-[#1DA1F2]/20 text-[#1DA1F2] ring-1 ring-[#1DA1F2]/20"
              : "bg-[#0077b5]/20 text-[#0077b5] ring-1 ring-[#0077b5]/20"
          }`}
        >
          {platform === "twitter" ? (
            <Twitter size={20} fill="currentColor" />
          ) : (
            <Linkedin size={20} fill="currentColor" />
          )}
        </div>
        <div>
          <h4 className="font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors text-base">
            {title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1.5">
            <Clock size={12} />
            {time}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span
          className={`px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider ${
            status === "scheduled"
              ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
              : "bg-slate-800 text-slate-400 ring-1 ring-slate-700"
          }`}
        >
          {status}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-500 hover:text-white hover:bg-white/10 rounded-full h-8 w-8"
        >
          <MoreHorizontal size={16} />
        </Button>
      </div>
    </div>
  );
}
