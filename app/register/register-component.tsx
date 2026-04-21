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

export default function RegisterComponent() {
  const router = useRouter()
  const { register, loading } = useSupabaseApp()
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const success = await register(name, password)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Registration failed")
      }
    } catch (err) {
      setError("Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Package className="h-6 w-6" />
            </div>
          </div>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Sign up for Inventory System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-sm text-destructive text-center">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
