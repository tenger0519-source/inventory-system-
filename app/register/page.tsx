"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSupabaseApp } from "@/lib/supabase-app-context"

export default function RegisterPage() {
  const router = useRouter()
  const { register, loading } = useSupabaseApp()
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirm) {
      setError("Нууц үг таарахгүй байна.")
      return
    }
    if (password.length < 6) {
      setError("Нууц үг хамгийн багадаа 6 тэмдэгтэй байх.")
      return
    }
    setIsLoading(true)
    const success = await register(name, password)
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Энэ нэр хэрэглэгдэж байна.")
    }
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Package className="h-8 w-8" />
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold">Шинэ бүртгэл үүсгэх</CardTitle>
            <CardDescription className="mt-1">Нэр болон нууц үгээ оруулна уу</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Хэрэглэгчийн нэр</Label>
              <Input
                id="name"
                placeholder="Нэрээ оруулна уу"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Нууц үг</Label>
              <Input
                id="password"
                type="password"
                placeholder="Нууц үгээ оруулна уу"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Нууц үг давтах</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="Нууц үгээ дахин оруулна уу"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Үүсгэж байна..." : "Бүртгэл үүсгэх"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">эсвэл</span>
            </div>
          </div>

          <Link href="/">
            <Button variant="outline" className="w-full">Нэвтрэх хуудас руу буцах</Button>
          </Link>

          <p className="text-xs text-center text-muted-foreground">
            Бүртгэл үүсгэсний дараа менежер таны эрхийг тогтооно.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}