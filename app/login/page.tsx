"use client"

import { useState } from "react"
import { signInWithOAuth, signInWithOTP } from "@/lib/actions/auth"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Mail,
  ArrowRight,
  Loader2,
  ChefHat,
  Sparkles,
} from "lucide-react"

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [otpSent, setOtpSent] = useState(false)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")

  const handleOAuth = async (provider: "google") => {
    setLoading(provider)
    setError(null)
    try {
      const result = await signInWithOAuth(provider)
      if (result?.error) {
        setError(result.error)
        setLoading(null)
      }
    } catch {
      // redirect happens on success
    }
  }

  const handleOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading("otp")
    setError(null)
    try {
      const result = await signInWithOTP(email)
      if (result?.error) {
        setError(result.error)
        setLoading(null)
      } else {
        setOtpSent(true)
        setLoading(null)
      }
    } catch {
      // redirect happens on success
    }
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.")
      return
    }
    setLoading("verify")
    setError(null)
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    })
    if (error) {
      setError(error.message)
      setLoading(null)
      return
    }
    setTimeout(() => {
      window.location.href = "/"
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/10 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[-8%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-rose-500/20 to-orange-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PC9nPjwvc3ZnPg==')] opacity-30" />
      </div>

      <div className="w-full max-w-[420px] mx-4 animate-fade-up">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/25 mb-5 animate-float">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            The Hunters Kitchen
          </h1>
          <p className="text-sm text-slate-400 mt-1.5">
            Sign in to order fresh food delivered to your hostel
          </p>
        </div>

        {/* Card */}
        <div className="glass-dark rounded-2xl p-8 shadow-2xl border border-slate-700/50">
          {!otpSent ? (
            <>
              {/* OAuth Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleOAuth("google")}
                  disabled={loading !== null}
                  className="group w-full flex items-center justify-center gap-3 h-12 px-6 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === "google" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  )}
                  <span>Continue with Google</span>
                </button>

              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-800/80 px-2 text-slate-400">
                    Or sign in with OTP
                  </span>
                </div>
              </div>

              {/* OTP Form */}
              <form onSubmit={handleOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@college.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500"
                      required
                      disabled={loading === "otp"}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold"
                  disabled={loading === "otp"}
                >
                  {loading === "otp" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            /* OTP Verification */
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-3">
                  <Mail className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">
                  Check your email
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  We sent a verification code to <span className="text-white font-medium">{email}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp" className="text-slate-300">
                  Enter OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500 text-center text-2xl tracking-widest"
                />
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={loading === "verify" || loading === "otp"}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold"
              >
                {loading === "verify" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-sm text-slate-400 hover:text-white transition-colors"
              >
                Change email or try another method
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-sm text-red-300 animate-fade-in">
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-slate-700">
            <p className="text-xs text-center text-slate-500 leading-relaxed">
              By continuing, you agree to our Terms of Service.
              <br />
              Only college students with valid IDs are eligible.
            </p>
          </div>
        </div>

        {/* Footer tag */}
        <p className="text-center text-xs text-slate-500/60 mt-6">
          © {new Date().getFullYear()} The Hunters Kitchen
        </p>
      </div>
    </div>
  )
}
