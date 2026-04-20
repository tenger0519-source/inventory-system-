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

export type ProductRequest = {
  id: number
  fromUserId: number
  toUserId: number
  type: "give" | "take"
  product: string
  quantity: number
  status: "pending" | "accepted" | "declined"
}

export type Task = {
  id: string
  type: "move" | "message" | "general"
  time: string
  action: string
  employee?: string
  product?: string
  quantity?: number
  from?: string
  to?: string
  shelf?: string
  message?: string
  day?: string
  date?: string
}

type AppContextType = {
  users: User[]
  currentUser: User | null
  roleRequests: RoleRequest[]
  productRequests: ProductRequest[]
  tasks: Task[]
  login: (name: string, password: string) => boolean
  logout: () => void
  register: (name: string, password: string) => boolean
  sendRoleRequest: (toUserId: number, role: Role) => void
  respondToRoleRequest: (requestId: number, accept: boolean) => void
  sendProductRequest: (toUserId: number, type: "give" | "take", product: string, quantity: number) => void
  respondToProductRequest: (requestId: number, accept: boolean) => void
  addTask: (task: Omit<Task, 'id'>) => void
  deleteTask: (taskId: string) => void
  getTasksForEmployee: (employeeName: string, day?: string) => Task[]
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
  const [productRequests, setProductRequests] = useState<ProductRequest[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

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
    const newUser: User = { id: Date.now(), name, password, roles: [] }
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

  const respondToRoleRequest = (requestId: number, accept: boolean) => {
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

  const sendProductRequest = (
    toUserId: number,
    type: "give" | "take",
    product: string,
    quantity: number
  ) => {
    if (!currentUser) return
    setProductRequests(prev => [...prev, {
      id: Date.now(),
      fromUserId: currentUser.id,
      toUserId,
      type,
      product,
      quantity,
      status: "pending",
    }])
  }

  const respondToProductRequest = (requestId: number, accept: boolean) => {
    setProductRequests(prev => prev.map(r =>
      r.id === requestId
        ? { ...r, status: accept ? "accepted" : "declined" }
        : r
    ))
  }

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    }
    setTasks(prev => [...prev, newTask])
  }

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  const getTasksForEmployee = (employeeName: string, day?: string): Task[] => {
    return tasks.filter(task => {
      const matchesEmployee = !task.employee || task.employee === employeeName
      const matchesDay = !day || !task.day || task.day === day
      return matchesEmployee && matchesDay
    })
  }

  return (
    <AppContext.Provider value={{
      users, currentUser, roleRequests, productRequests, tasks,
      login, logout, register,
      sendRoleRequest, respondToRoleRequest,
      sendProductRequest, respondToProductRequest,
      addTask, deleteTask, getTasksForEmployee,
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