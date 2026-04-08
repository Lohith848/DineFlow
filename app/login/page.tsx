"use client"

import { useState } from "react"
import { signInWithOAuth } from "@/lib/actions/auth"

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleOAuth = async (provider: "google" | "azure") => {
    setLoading(provider)
    setError(null)
    try {
      const result = await signInWithOAuth(provider)
      if (result?.error) {
        setError(result.error)
        setLoading(null)
      }
    } catch {
      // redirect happens on success — this catch is for the NEXT_REDIRECT
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-50 via-amber-50/50 to-rose-50" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-200/40 to-amber-100/30 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[-8%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-rose-200/30 to-orange-100/20 blur-3xl" />
      </div>

      <div className="w-full max-w-[420px] mx-4 animate-fade-up">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/25 mb-5">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
              <line x1="6" y1="17" x2="18" y2="17" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            The Hunters Kitchen
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Sign in to order fresh food delivered to your hostel
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 shadow-xl shadow-black/[0.03]">
          <div className="space-y-3">
            {/* Google */}
            <button
              onClick={() => handleOAuth("google")}
              disabled={loading !== null}
              className="group w-full flex items-center justify-center gap-3 h-12 px-6 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "google" ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
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

            {/* Microsoft */}
            <button
              onClick={() => handleOAuth("azure")}
              disabled={loading !== null}
              className="group w-full flex items-center justify-center gap-3 h-12 px-6 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "azure" ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 23 23">
                  <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                  <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
                  <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
                  <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
                </svg>
              )}
              <span>Continue with Microsoft</span>
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600 animate-fade-in">
              {error}
            </div>
          )}

          {/* Divider */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs text-center text-muted-foreground leading-relaxed">
              By continuing, you agree to our Terms of Service.
              <br />
              Only college students with valid IDs are eligible.
            </p>
          </div>
        </div>

        {/* Footer tag */}
        <p className="text-center text-xs text-muted-foreground/60 mt-6">
          © {new Date().getFullYear()} The Hunters Kitchen
        </p>
      </div>
    </div>
  )
}
