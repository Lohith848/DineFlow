"use client"

import { useState } from "react"
import { signInWithOTP } from "@/lib/actions/auth"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Mail,
  ArrowRight,
  Loader2,
  ChefHat,
} from "lucide-react"

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [otpSent, setOtpSent] = useState(false)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")

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
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/10 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[-8%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-rose-500/20 to-orange-500/10 blur-3xl" />
      </div>

      <div className="w-full max-w-[420px] mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/25 mb-5">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            The Hunters Kitchen
          </h1>
          <p className="text-sm text-slate-400 mt-1.5">
            Sign in to order fresh food delivered to your hostel
          </p>
        </div>

        <div className="glass-dark rounded-2xl p-8 shadow-2xl border border-slate-700/50">
          {!otpSent ? (
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
          ) : (
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
                Change email
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-slate-700">
            <p className="text-xs text-center text-slate-500 leading-relaxed">
              By continuing, you agree to our Terms of Service.
              <br />
              Only college students with valid IDs are eligible.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500/60 mt-6">
          © {new Date().getFullYear()} The Hunters Kitchen
        </p>
      </div>
    </div>
  )
}