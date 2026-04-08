"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useCart } from "@/store/cart"
import {
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
  ChefHat,
  Home,
  UtensilsCrossed,
  ClipboardList,
} from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const cartItems = useCart((state) => state.items)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    checkUser()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session)
      setUserName(session?.user?.email?.split("@")[0] || null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    setIsLoggedIn(!!session)
    setUserName(session?.user?.email?.split("@")[0] || null)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    setUserName(null)
    window.location.href = "/login"
  }

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/menu", label: "Menu", icon: UtensilsCrossed },
    { href: "/orders", label: "Orders", icon: ClipboardList },
  ]

  const isLoginPage = pathname === "/login"
  const isAdminPage = pathname.startsWith("/admin")

  // Don't show header on login page
  if (isLoginPage) return null

  if (isAdminPage) {
    return (
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl shadow-sm border-b border-border/50"
            : "bg-background border-b border-border/30"
        }`}
      >
        <div className="container flex h-14 items-center">
          <Link href="/admin" className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-primary" />
            <span className="font-semibold">Admin Panel</span>
          </Link>
          <nav className="flex items-center gap-6 ml-auto">
            <Link
              href="/admin/menu"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Menu
            </Link>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Orders
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </nav>
        </div>
      </header>
    )
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0)

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl shadow-sm border-b border-border/50"
            : "bg-background border-b border-border/30"
        }`}
      >
        <div className="container flex h-16 items-center">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-sm shadow-orange-500/20 transition-transform duration-200 group-hover:scale-105">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-base tracking-tight">
                Hunters Kitchen
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 ml-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2 ml-auto">
            {/* Cart */}
            <Link
              href="/cart"
              className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                pathname === "/cart"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-bold shadow-sm shadow-orange-500/30">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User section */}
            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10">
                    <User className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="truncate max-w-[100px]">{userName}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center w-10 h-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 h-9 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-sm shadow-primary/20 hover:opacity-90 transition-all duration-200"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-16 left-0 right-0 bg-background border-b shadow-xl animate-fade-in">
            <nav className="container py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )
              })}
              <div className="border-t my-2" />
              {isLoggedIn ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-primary"
                >
                  <User className="w-5 h-5" />
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
