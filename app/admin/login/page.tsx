"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChefHat, Mail, ArrowRight, Loader2, ShieldCheck } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }
  }, [searchParams])

  // ── Google OAuth ──────────────────────────────────────────
  async function handleGoogle() {
    setError(null)
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    })
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
    // if no error, browser redirects automatically — no setLoading(false) needed
  }

  // ── Send Email OTP (6-digit numeric code) ───────────────────
  async function handleSendOTP() {
    setError(null)
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.")
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setOtpSent(true)
      setSuccess(`OTP sent to ${email}. Check your inbox (or spam).`)
    }
  }

  // ── Verify OTP ────────────────────────────────────────────
  async function handleVerifyOTP() {
    setError(null)
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.")
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    // Give time for session to be saved in cookies
    setTimeout(() => {
      window.location.href = "/admin"
    }, 500)
  }

  // ── Resend OTP ────────────────────────────────────────────
  async function handleResend() {
    setError(null)
    setSuccess(null)
    setOtp("")
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    })
    if (error) {
      setError(error.message)
    } else {
      setSuccess("New OTP sent. Check your inbox.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] px-4 py-12 relative overflow-hidden">

      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">

        {/* Logo + heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 mb-5">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            The Hunters Kitchen
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Sign in to order fresh food delivered to your hostel
          </p>
        </div>

        {/* Card */}
        <Card className="bg-[#161b22] border border-white/10 shadow-2xl rounded-2xl">
          <CardContent className="p-7 space-y-5">

            {/* Google button */}
            <Button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading || loading}
              className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium h-12 rounded-xl border border-white/20 transition-all duration-200 flex items-center gap-3"
            >
              {googleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              ) : (
                <GoogleIcon />
              )}
              <span>Continue with Google</span>
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-slate-500 tracking-widest uppercase">
                or sign in with OTP
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Email input */}
            <div className="space-y-2">
              <Label className="text-sm text-slate-300 font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="email"
                  placeholder="your.email@college.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError(null)
                    setOtpSent(false)
                    setSuccess(null)
                    setOtp("")
                  }}
                  disabled={loading || otpSent}
                  className="pl-10 h-12 bg-[#0d1117] border-white/10 text-white placeholder:text-slate-600 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                />
              </div>
            </div>

            {/* OTP input — shown after OTP sent */}
            {otpSent && (
              <div className="space-y-2">
                <Label className="text-sm text-slate-300 font-medium">
                  6-Digit OTP
                </Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, "")) // numbers only
                    setError(null)
                  }}
                  disabled={loading}
                  className="h-12 tracking-[0.5em] text-center text-lg font-mono bg-[#0d1117] border-white/10 text-white placeholder:text-slate-700 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                />
                <p className="text-xs text-slate-500 text-right">
                  Didn&apos;t receive it?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-orange-400 hover:text-orange-300 underline underline-offset-2"
                  >
                    Resend OTP
                  </button>
                </p>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 px-4 py-3 rounded-xl flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                {success}
              </div>
            )}

            {/* Primary CTA button */}
            {!otpSent ? (
              <Button
                type="button"
                onClick={handleSendOTP}
                disabled={loading || !email}
                className="w-full h-12 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full h-12 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Verify & Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}

            {/* Footer note */}
            <p className="text-center text-xs text-slate-600 leading-relaxed pt-1">
              By continuing, you agree to our Terms of Service.
              <br />
              Only college students with valid IDs are eligible.
            </p>

          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-700 mt-6">
          © 2025 The Hunters Kitchen
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0d1117]">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}

// ── Google SVG icon (inline, no external dep) ─────────────
function GoogleIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}