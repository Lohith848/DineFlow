import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabaseServer"
import AdminLayoutClient from "./components/AdminLayoutClient"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const allowedAdminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
  
  if (!allowedAdminEmail || user.email?.toLowerCase() !== allowedAdminEmail.toLowerCase()) {
    redirect("/")
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>
}