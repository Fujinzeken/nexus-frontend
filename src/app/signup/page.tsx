"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Zap, Loader2, UserPlus, Mail, Lock, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        router.refresh();
        setSuccess(true);
        setLoading(false);
      }
    } catch (err) {
      console.error("Signup unexpected error:", err);
      setError("An unexpected error occurred during sign up.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <Card className="w-full max-w-md border-none bg-slate-900/50 backdrop-blur-xl ring-1 ring-white/10 p-8 text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="text-emerald-500 h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-white mb-2">
            Check your email
          </CardTitle>
          <p className="text-slate-400 mb-8">
            We&apos;ve sent a verification link to{" "}
            <span className="text-white font-medium">{email}</span>. Please
            check your inbox to activate your account.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
          >
            Back to login <ArrowRight size={16} />
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden px-4">
      {/* Decorative Cosmic background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-500/20 ring-1 ring-white/10">
              <Zap className="h-6 w-6 text-white fill-current animate-pulse" />
            </div>
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400 tracking-tight">
              Nexus
            </span>
          </div>
        </div>

        <Card className="border-none shadow-2xl bg-slate-900/50 backdrop-blur-xl ring-1 ring-white/10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-purple-500 to-transparent opacity-50" />

          <CardHeader className="space-y-1 pt-8 pb-6 text-center">
            <CardTitle className="text-2xl font-bold text-white">
              Join the elite
            </CardTitle>
            <CardDescription className="text-slate-400">
              Create your pro account today
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 ml-1">
                  Work Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:ring-purple-500 pl-10 h-11 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  title="password"
                  className="text-slate-300 ml-1"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="Min. 8 characters"
                    className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:ring-purple-500 pl-10 h-11 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus size={18} />
                    <span>Create Account</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900/50 px-2 text-slate-500 px-4">
                  One-click registration
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-11 border-white/10 bg-slate-950/30 text-white hover:bg-white/5 rounded-xl"
              >
                <span>Google</span>
              </Button>
              <Button
                variant="outline"
                className="h-11 border-white/10 bg-slate-950/30 text-white hover:bg-white/5 rounded-xl"
              >
                <span>LinkedIn</span>
              </Button>
            </div>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
