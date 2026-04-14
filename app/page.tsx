"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userType) return
    
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (userType === "manager") {
      router.push("/manager")
    } else if (userType === "supplier") {
      router.push("/supplier")
    } else {
      router.push("/employee")
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Package className="h-8 w-8" />
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold text-foreground">
              Агуулахын Удирдлагын Систем
            </CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">
              Хянах самбартаа нэвтрэх
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userType">Хэрэглэгчийн төрөл</Label>
              <Select open={open} onOpenChange={setOpen} value={userType} onValueChange={setUserType}>
                <SelectTrigger>
                  <SelectValue placeholder="Хэрэглэгчийн төрлөө сонгоно уу" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[999] bg-[#121212] border-slate-800 shadow-2xl">
                 <SelectItem value="manager" className="text-white hover:bg-slate-800 cursor-pointer">
                 Менежер
                 </SelectItem>
                 <SelectItem value="employee" className="text-white hover:bg-slate-800 cursor-pointer">
                 Ажилтан
              </SelectItem>
  <SelectItem value="supplier" className="text-white hover:bg-slate-800 cursor-pointer">
    Нийлүүлэгч
  </SelectItem>
</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Хэрэглэгчийн нэр</Label>
              <Input
                id="username"
                type="text"
                placeholder="Хэрэглэгчийн нэрээ оруулна уу"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading || !userType}
            >
              {isLoading ? "Нэвтэрч байна..." : "Нэвтрэх"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
