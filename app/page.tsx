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

export default function LoginPage() {
  const router = useRouter()
  const { login, users, loading } = useSupabaseApp()
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    const success = await login(name, password)
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Нэр эсвэл нууц үг буруу байна.")
    }
    setIsLoading(false)
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center h-32">
            <p>Loading...</p>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Package className="h-8 w-8" />
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold">Агуулахын Удирдлагын Систем</CardTitle>
            <CardDescription className="mt-1">Хянах самбартаа нэвтрэх</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
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
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Нэвтэрч байна..." : "Нэвтрэх"}
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

          <Link href="/register">
            <Button variant="outline" className="w-full">Шинэ бүртгэл үүсгэх</Button>
          </Link>

          <div className="rounded-lg bg-muted p-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Туршилтын акаунтууд (нууц үг: password123)</p>
            {users.map((user: any) => (
              <p key={user.id} className="text-xs text-muted-foreground">· {user.name} - {user.roles.join(", ")}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}