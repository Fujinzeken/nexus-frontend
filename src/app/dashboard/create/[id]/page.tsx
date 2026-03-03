"use client";

import { useEffect, useState, Suspense } from "react";
import EmojiPicker, { Theme, EmojiStyle } from "emoji-picker-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Twitter,
  Linkedin,
  Image as ImageIcon,
  Loader2,
  Calendar as CalendarIcon,
  Shield,
  Smile,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useRouter, useParams } from "next/navigation";
import { supabase as supabaseClient } from "@/lib/supabase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

function EditPostContent() {
  const { session } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [platform, setPlatform] = useState<"twitter" | "linkedin">("linkedin");
  const [content, setContent] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [connections, setConnections] = useState<any[]>([]);

  // 1. Fetch Connection Info
  useEffect(() => {
    async function fetchConnections() {
      if (!session?.access_token) return;
      try {
        const res = await fetch(`${API_URL}/api/auth/connections`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) setConnections(data);
      } catch (err) {
        console.error("Failed to fetch connections:", err);
      }
    }
    fetchConnections();
  }, [session]);

  // 2. Fetch Existing Post Data
  useEffect(() => {
    async function fetchPost() {
      if (!session?.access_token || !id) return;
      try {
        const res = await fetch(`${API_URL}/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) throw new Error("Failed to load post");
        const data = await res.json();

        setPlatform(data.platform);
        setContent(data.content);
        setMediaUrls(data.media_urls || []);

        if (data.scheduled_at) {
          const d = new Date(data.scheduled_at);
          const offset = d.getTimezoneOffset();
          const localDate = new Date(d.getTime() - offset * 60 * 1000);
          setScheduledAt(localDate.toISOString().slice(0, 16));
        }
      } catch (err: any) {
        console.error(err);
        setStatus({ type: "error", message: err.message });
      } finally {
        setFetching(false);
      }
    }
    fetchPost();
  }, [session, id]);

  const activeConnection = connections.find((c) => c.platform === platform);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${session?.user?.id}/${fileName}`;

      const { data, error } = await supabaseClient.storage
        .from("post-media")
        .upload(filePath, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabaseClient.storage.from("post-media").getPublicUrl(filePath);

      setMediaUrls((prev) => [...prev, publicUrl]);
    } catch (err: any) {
      console.error("Upload failed", err);
      setStatus({ type: "error", message: `Upload failed: ${err.message}` });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdatePost = async (isDraft: boolean) => {
    if (!content && mediaUrls.length === 0) return;
    if (!isDraft && !scheduledAt) {
      setStatus({ type: "error", message: "Please select a scheduled time." });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch(`${API_URL}/api/posts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          content,
          platform,
          scheduledAt: isDraft ? null : new Date(scheduledAt).toISOString(),
          mediaUrls,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update post");
      }

      setStatus({
        type: "success",
        message: isDraft
          ? "Changes saved as draft!"
          : "Post updated and scheduled!",
      });

      // Redirect to dashboard after a short delay
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/dashboard");
    } catch (err: any) {
      setStatus({ type: "error", message: err.message });
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <DashboardLayout>
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 h-full flex flex-col max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              Edit Post
            </h1>
            <p className="text-slate-400">Update your content or timing.</p>
          </div>
          <Button
            variant="ghost"
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10 mb-2"
            onClick={handleDeletePost}
            disabled={loading}
          >
            <Trash2 size={18} className="mr-2" /> Delete Post
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:h-[calc(100vh-12rem)]">
          {/* Creation Form */}
          <div className="space-y-6 flex flex-col h-full">
            <Card className="border-none shadow-lg bg-slate-900/50 backdrop-blur-sm ring-1 ring-white/10 flex-1 flex flex-col">
              <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
                {/* Status UI ... kept same as create page ... */}
                {status && (
                  <div
                    className={`fixed bottom-8 right-8 z-50 p-4 rounded-xl text-sm font-medium shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300 flex items-center gap-3 backdrop-blur-md ring-1 ${
                      status.type === "success"
                        ? "bg-green-500/90 text-white ring-green-400/20"
                        : "bg-red-500/90 text-white ring-red-400/20"
                    }`}
                  >
                    {status.type === "success" ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <AlertCircle size={18} />
                    )}
                    {status.message}
                    <button
                      onClick={() => setStatus(null)}
                      className="ml-2 hover:opacity-70 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Platform Selection */}
                <div className="space-y-3">
                  <Label className="text-slate-200 uppercase tracking-widest text-xs font-bold">
                    Platform
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      disabled
                      className={`h-24 flex flex-col gap-3 rounded-xl border-2 opacity-30 cursor-not-allowed bg-slate-900/50 border-white/5 text-slate-500`}
                    >
                      <Twitter size={28} className="text-slate-600" />
                      <span className="font-bold">Twitter</span>
                    </Button>
                    <Button
                      variant="outline"
                      className={`h-24 flex flex-col gap-3 rounded-xl border-2 transition-all duration-200 ${
                        platform === "linkedin"
                          ? "bg-[#0077b5]/10 border-[#0077b5] text-white"
                          : "bg-slate-900/50 border-white/5 text-slate-400 hover:bg-slate-800"
                      }`}
                      onClick={() => setPlatform("linkedin")}
                    >
                      <Linkedin
                        size={28}
                        className={
                          platform === "linkedin"
                            ? "text-[#0077b5]"
                            : "text-slate-400"
                        }
                        fill={platform === "linkedin" ? "currentColor" : "none"}
                      />
                      <span className="font-bold">LinkedIn</span>
                    </Button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="space-y-3 flex-1 flex flex-col relative">
                  <div className="flex justify-between items-center">
                    <Label className="text-slate-200 uppercase tracking-widest text-xs font-bold">
                      Content
                    </Label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                          <Smile size={18} />
                        </Button>
                        {showEmojiPicker && (
                          <div className="absolute bottom-full right-0 mb-2 z-50 shadow-2xl ring-1 ring-white/10 rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <EmojiPicker
                              onEmojiClick={(emojiData) => {
                                setContent((prev) => prev + emojiData.emoji);
                                setShowEmojiPicker(false);
                              }}
                              theme={Theme.DARK}
                              emojiStyle={EmojiStyle.NATIVE}
                              width={320}
                              height={400}
                              lazyLoadEmojis={true}
                              skinTonesDisabled
                            />
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-xs font-mono font-medium ${content.length > (platform === "twitter" ? 280 : 3000) ? "text-red-500" : "text-slate-500"}`}
                      >
                        {content.length} / {platform === "twitter" ? 280 : 3000}
                      </span>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Update your post content..."
                    className="flex-1 min-h-[200px] resize-none bg-slate-950/50 border-white/10 text-slate-200 placeholder:text-slate-600 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl p-4 text-base leading-relaxed"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                {/* Media Upload */}
                <div className="space-y-3">
                  <Label className="text-slate-200 uppercase tracking-widest text-xs font-bold flex items-center gap-2">
                    <ImageIcon size={14} />
                    Media
                  </Label>
                  <div className="grid grid-cols-4 gap-4">
                    {mediaUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-xl overflow-hidden border border-white/10"
                      >
                        <img
                          src={url}
                          className="w-full h-full object-cover"
                          alt="preview"
                        />
                        <button
                          onClick={() =>
                            setMediaUrls(mediaUrls.filter((_, i) => i !== idx))
                          }
                          className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {mediaUrls.length < 4 && (
                      <label className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-indigo-500 hover:text-indigo-400 cursor-pointer transition-all">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*,video/*"
                          onChange={handleFileUpload}
                          disabled={uploading}
                        />
                        {uploading ? (
                          <Loader2 size={24} className="animate-spin" />
                        ) : (
                          <>
                            <ImageIcon size={24} />
                            <span className="text-[10px] font-bold uppercase tracking-tighter">
                              Add Media
                            </span>
                          </>
                        )}
                      </label>
                    )}
                  </div>
                </div>

                {/* Scheduling */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-slate-300">
                      Schedule Date & Time
                    </Label>
                    <Shield size={14} className="text-indigo-400" />
                  </div>
                  <input
                    type="datetime-local"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all scheme-dark"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    min={(() => {
                      const now = new Date();
                      const offset = now.getTimezoneOffset();
                      return new Date(now.getTime() - offset * 60 * 1000)
                        .toISOString()
                        .slice(0, 16);
                    })()}
                  />

                  {scheduledAt && new Date(scheduledAt) < new Date() && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs animate-in fade-in slide-in-from-top-1">
                      <AlertCircle size={14} />
                      <span>Scheduling time must be in the future.</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-2">
                  <Button
                    onClick={() => handleUpdatePost(true)}
                    disabled={loading || !content}
                    variant="outline"
                    className="flex-1 h-12 border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
                  >
                    Save as Draft
                  </Button>
                  <Button
                    className="flex-1 h-12 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleUpdatePost(false)}
                    disabled={
                      loading ||
                      uploading ||
                      !content ||
                      !scheduledAt ||
                      new Date(scheduledAt) < new Date() ||
                      !connections.some((c) => c.platform === platform)
                    }
                  >
                    {loading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      "Save & Schedule"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel (Same as create page) */}
          <div className="hidden lg:block space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Preview
              </h3>
            </div>
            <Card className="border-none shadow-2xl bg-slate-900 border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5 bg-slate-950/30 flex items-center gap-3">
                {activeConnection?.profile_picture_url ? (
                  <img
                    src={activeConnection.profile_picture_url}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border border-white/10 ring-2 ring-transparent object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-slate-700 to-slate-900 border border-white/10 ring-2 ring-transparent" />
                )}
                <div>
                  <div className="font-bold text-white text-sm leading-tight">
                    {activeConnection?.platform_username || "User Name"}
                  </div>
                  <div className="text-[11px] text-slate-500">Preview Mode</div>
                </div>
              </div>
              <div className="p-6 space-y-4 min-h-[300px] flex flex-col">
                {content ? (
                  <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-200">
                    {content}
                  </p>
                ) : (
                  <p className="text-slate-600 italic">No content yet...</p>
                )}

                {mediaUrls.length > 0 && (
                  <div className="mt-auto grid grid-cols-1 gap-2">
                    {mediaUrls.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        className="rounded-xl w-full aspect-video object-cover border border-white/5"
                        alt="Preview"
                      />
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function EditPostPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="p-8 flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        </DashboardLayout>
      }
    >
      <EditPostContent />
    </Suspense>
  );
}
