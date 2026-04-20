"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type Role = "manager" | "employee" | "supplier"

export type User = {
  id: number
  name: string
  password: string
  roles: Role[]
}

export type RoleRequest = {
  id: number
  fromUserId: number
  toUserId: number
  requestedRole: Role
  status: "pending" | "accepted" | "declined"
}

type AppContextType = {
  users: User[]
  currentUser: User | null
  roleRequests: RoleRequest[]
  login: (name: string, password: string) => boolean
  logout: () => void
  register: (name: string, password: string) => boolean
  sendRoleRequest: (toUserId: number, role: Role) => void
  respondToRequest: (requestId: number, accept: boolean) => void
}

const AppContext = createContext<AppContextType | null>(null)

const initialUsers: User[] = [
  { id: 1, name: "Бат",        password: "password123", roles: ["employee"] },
  { id: 2, name: "Сараа",      password: "password123", roles: ["manager"]  },
  { id: 3, name: "Тэмүүжин",  password: "password123", roles: ["employee"] },
  { id: 4, name: "Номин",      password: "password123", roles: ["employee"] },
  { id: 5, name: "ABC Co",     password: "password123", roles: ["supplier"] },
  { id: 6, name: "FoodSupply", password: "password123", roles: ["supplier"] },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>([])

  const login = (name: string, password: string): boolean => {
    const user = users.find(u => u.name === name && u.password === password)
    if (!user) return false
    setCurrentUser(user)
    return true
  }

  const logout = () => setCurrentUser(null)

  const register = (name: string, password: string): boolean => {
    const exists = users.some(u => u.name.toLowerCase() === name.toLowerCase())
    if (exists) return false
    const newUser: User = {
      id: Date.now(),
      name,
      password,
      roles: [],
    }
    setUsers(prev => [...prev, newUser])
    setCurrentUser(newUser)
    return true
  }

  const sendRoleRequest = (toUserId: number, role: Role) => {
    if (!currentUser) return
    const exists = roleRequests.some(
      r => r.toUserId === toUserId && r.requestedRole === role && r.status === "pending"
    )
    if (exists) return
    setRoleRequests(prev => [...prev, {
      id: Date.now(),
      fromUserId: currentUser.id,
      toUserId,
      requestedRole: role,
      status: "pending",
    }])
  }

  const respondToRequest = (requestId: number, accept: boolean) => {
    setRoleRequests(prev => prev.map(r => {
      if (r.id !== requestId) return r
      if (accept) {
        setUsers(prev => prev.map(u => {
          if (u.id !== r.toUserId) return u
          if (u.roles.includes(r.requestedRole)) return u
          return { ...u, roles: [...u.roles, r.requestedRole] }
        }))
        setCurrentUser(prev => {
          if (!prev || prev.id !== r.toUserId) return prev
          if (prev.roles.includes(r.requestedRole)) return prev
          return { ...prev, roles: [...prev.roles, r.requestedRole] }
        })
      }
      return { ...r, status: accept ? "accepted" : "declined" }
    }))
  }

  return (
    <AppContext.Provider value={{
      users, currentUser, roleRequests,
      login, logout, register,
      sendRoleRequest, respondToRequest,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}