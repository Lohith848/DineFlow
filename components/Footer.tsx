"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChefHat, Phone, MapPin, Clock } from "lucide-react"

export function Footer() {
  const pathname = usePathname()

  // Don't show footer on login page
  if (pathname === "/login") return null

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-sm shadow-orange-500/20">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight">
                DineFlow
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Fresh, home-style meals delivered free to you.
              Made with love, served with care.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/70">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/menu", label: "Browse Menu" },
                { href: "/orders", label: "My Orders" },
                { href: "/cart", label: "Cart" },
                { href: "/profile", label: "Profile" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/70">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-primary/60" />
                <span>WhatsApp: +91 63833 46991</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary/60" />
                <span>Delivers to all college hostels</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-primary/60" />
                <span>Open daily during meal hours</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/70">
              More
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/admin/login"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} The DineFlow. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/50">
            Exclusively for you 
            Made by Lohith 🌻
          </p>
        </div>
      </div>
    </footer>
  )
}
