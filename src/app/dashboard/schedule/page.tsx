"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import {
  ChevronLeft,
  ChevronRight,
  Twitter,
  Linkedin,
  Plus,
  Calendar as CalendarIcon,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export default function SchedulePage() {
  const { session } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

  // Calendar Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  // Fill leading empty days
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  // Fill actual days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }
  // Fill trailing days for for a clean grid (to the end of the last week)
  const totalCells = Math.ceil(calendarDays.length / 7) * 7;
  while (calendarDays.length < totalCells) {
    calendarDays.push(null);
  }

  const changeMonth = (offset: number) => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + offset);
    setCurrentDate(next);
  };

  const getPostsForDay = (day: number) => {
    return posts.filter((post) => {
      const date = post.scheduled_at
        ? new Date(post.scheduled_at)
        : new Date(post.created_at);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
      );
    });
  };

  return (
    <DashboardLayout>
      <div className="p-8 flex flex-col max-w-[1600px] mx-auto min-h-screen">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              Content Calendar
            </h1>
            <p className="text-slate-400">
              Visualize and manage your social presence.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/50 p-1.5 rounded-xl border border-white/5 backdrop-blur-sm">
            <div className="flex items-center bg-slate-800 rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-white"
                onClick={() => changeMonth(-1)}
              >
                <ChevronLeft size={16} />
              </Button>
              <span className="px-4 font-bold text-sm text-white w-40 text-center">
                {currentDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-white"
                onClick={() => changeMonth(1)}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
            <Button
              onClick={() => router.push("/dashboard/create")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
            >
              <Plus className="mr-2 h-4 w-4" /> New Event
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-none bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col relative mb-12">
          {loading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          )}
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-white/5 bg-slate-900/50">
            {days.map((day) => (
              <div
                key={day}
                className="py-4 px-4 text-xs font-bold text-slate-500 text-center uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Body */}
          <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-slate-950/50 gap-px border-white/5">
            {calendarDays.map((date, idx) => (
              <div
                key={idx}
                className="bg-slate-900/40 p-3 min-h-[120px] relative group hover:bg-slate-800/60 transition-colors"
              >
                {date && (
                  <>
                    <span
                      className={`text-sm font-bold flex items-center justify-center w-8 h-8 rounded-full ${
                        date === new Date().getDate() &&
                        month === new Date().getMonth() &&
                        year === new Date().getFullYear()
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/40"
                          : "text-slate-500"
                      }`}
                    >
                      {date}
                    </span>

                    {/* Example Events */}
                    <div className="mt-2 space-y-1.5 max-h-[110px] overflow-y-auto overflow-x-hidden custom-scrollbar pr-1">
                      {getPostsForDay(date).map((post) => (
                        <div
                          key={post.id}
                          className={`p-2 rounded-lg border text-xs font-medium text-white flex items-center gap-2 cursor-pointer transition-all hover:bg-white/5 shadow-sm min-w-0 ${
                            post.platform === "linkedin"
                              ? "bg-[#0077b5]/20 border-[#0077b5]/30"
                              : "bg-[#1DA1F2]/20 border-[#1DA1F2]/30"
                          } ${post.status === "failed" ? "border-red-500/50 bg-red-500/10" : ""}
                            ${post.status === "draft" ? "opacity-70 border-dashed" : ""}
                          `}
                          title={post.content}
                        >
                          {post.platform === "linkedin" ? (
                            <Linkedin
                              size={12}
                              className="fill-current text-[#0077b5] shrink-0"
                            />
                          ) : (
                            <Twitter
                              size={12}
                              className="fill-current text-[#1DA1F2] shrink-0"
                            />
                          )}
                          <span className="truncate opacity-90">
                            {post.content || "No content"}
                          </span>
                          {post.status === "failed" && (
                            <AlertCircle
                              size={10}
                              className="text-red-400 ml-auto"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add Button on Hover */}
                    {(() => {
                      const dayDate = new Date(year, month, date);
                      const isPast =
                        dayDate < new Date(new Date().setHours(0, 0, 0, 0));
                      const hasPosts = getPostsForDay(date).length > 0;

                      if (isPast && !hasPosts) return null;

                      return (
                        <button
                          onClick={() => {
                            const now = new Date();
                            let d = new Date(year, month, date, 12, 0);

                            // If target date is today and 12pm has passed, use current time + 1 hour
                            if (d < now) {
                              d = new Date(now.getTime() + 60 * 60 * 1000);
                              // Overwrite date to clicked date in case +1 hour pushes it to next day
                              // but only if the clicked date is today. If it's in the past,
                              // we keep the future-shifted time to satisfy validation.
                              d.setFullYear(year);
                              d.setMonth(month);
                              d.setDate(date);

                              // Check again: if it's still in the past (clicked date actually in the past),
                              // we let the Create page handle the warning, but try to give a "now" starting point.
                              if (d < now) {
                                d = new Date(now.getTime() + 60 * 60 * 1000);
                              }
                            }

                            const offset = d.getTimezoneOffset();
                            const localDate = new Date(
                              d.getTime() - offset * 60 * 1000,
                            );
                            const formattedDate = localDate
                              .toISOString()
                              .slice(0, 16);
                            router.push(
                              `/dashboard/create?date=${formattedDate}`,
                            );
                          }}
                          className="absolute bottom-2 right-2 p-2 rounded-full bg-indigo-600 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-500 shadow-lg shadow-black/50 scale-90 hover:scale-100"
                        >
                          <Plus size={14} />
                        </button>
                      );
                    })()}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
