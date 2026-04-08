import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Only login and auth callback are public — everything else requires auth
  const publicPaths = ["/login", "/auth/callback", "/auth/signout"]

  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  // Admin paths
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin")

  if (!isPublicPath && !user) {
    // No user, redirect to login
    const url = new URL("/login", request.url)
    url.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // If user is already logged in and visits /login, redirect to home
  if (user && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (isAdminPath && user) {
    // Check if user is admin
    const { data: admin } = await supabase
      .from("admins")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!admin) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return supabaseResponse
}
