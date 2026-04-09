"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabaseServer"

export async function signInWithOAuth(provider: "google") {
  const supabase = await createClient()

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }

  return { error: "Could not initiate OAuth flow" }
}

export async function signInWithOTP(email: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/")
  redirect("/login")
}

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return profile
}

export async function createProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const full_name = formData.get("full_name") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string
  const college = formData.get("college") as string

  if (!full_name || !phone || !address || !college) {
    return { error: "All fields are required" }
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name,
    phone,
    address,
    college,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/")
  redirect("/")
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const full_name = formData.get("full_name") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string
  const college = formData.get("college") as string

  if (!full_name || !phone || !address || !college) {
    return { error: "All fields are required" }
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name,
    phone,
    address,
    college,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/")
  redirect("/")
}
