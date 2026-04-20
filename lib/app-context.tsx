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
  completed?: boolean
}

export type Product = {
  id: number
  name: string
  supplier: string
  price: number
  type: string
  date: string
  stock: number
  minStock: number
}

export type SalesItem = {
  product: string
  quantity: number
  price: number
}

export type Transaction = {
  id: number
  worker: string
  day: string
  items: SalesItem[]
  date: string
  total: number
  timestamp: number
}

export type GlobalTime = {
  currentDateTime: Date
  currentDay: string
  currentTime: string
  currentDate: string
}

type AppContextType = {
  users: User[]
  currentUser: User | null
  roleRequests: RoleRequest[]
  productRequests: ProductRequest[]
  tasks: Task[]
  products: Product[]
  transactions: Transaction[]
  globalTime: GlobalTime
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
  completeTask: (taskId: string) => void
  addProduct: (product: Omit<Product, 'id'>) => void
  deleteProduct: (productId: number) => void
  updateProductStock: (productId: number, newStock: number) => void
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  getTransactionsByDay: (day: string) => Transaction[]
  updateGlobalTime: () => void
}

const AppContext = createContext<AppContextType | null>(null)

const initialUsers: User[] = [
  { id: 1, name: "Bat",        password: "password123", roles: ["employee"] },
  { id: 2, name: "Saraa",      password: "password123", roles: ["manager"]  },
  { id: 3, name: "Temuujin",  password: "password123", roles: ["employee"] },
  { id: 4, name: "Nomin",      password: "password123", roles: ["employee"] },
  { id: 5, name: "ABC Co",     password: "password123", roles: ["supplier"] },
  { id: 6, name: "FoodSupply", password: "password123", roles: ["supplier"] },
]

const getGlobalTime = (): GlobalTime => {
  const now = new Date()
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const mongolianDays = ["H Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  
  return {
    currentDateTime: now,
    currentDay: mongolianDays[now.getDay()],
    currentTime: now.toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' }),
    currentDate: now.toISOString().split('T')[0]
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>([])
  const [productRequests, setProductRequests] = useState<ProductRequest[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [globalTime, setGlobalTime] = useState<GlobalTime>(getGlobalTime())

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

  const completeTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task || task.completed) return

    // Mark task as completed
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: true } : t
    ))

    // If it's a move task involving products, update stock and create sales transaction
    if (task.type === "move" && task.product && task.quantity && task.to?.includes("outside")) {
      // Update product stock
      const product = products.find(p => p.name === task.product)
      if (product) {
        const newStock = Math.max(0, product.stock - task.quantity)
        setProducts(prev => prev.map(p => 
          p.id === product.id ? { ...p, stock: newStock } : p
        ))

        // Create sales transaction
        const transactionTotal = task.quantity * (product.price || 0)
        const newTransaction: Transaction = {
          id: Date.now(),
          worker: task.employee || "Unknown",
          day: task.day || "Unknown",
          date: new Date().toISOString().split('T')[0],
          items: [{
            product: task.product,
            quantity: task.quantity,
            price: product.price || 0
          }],
          total: transactionTotal,
          timestamp: Date.now()
        }
        setTransactions(prev => [...prev, newTransaction])
      }
    }
  }

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now(),
    }
    setProducts(prev => [...prev, newProduct])
  }

  const deleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId))
  }

  const updateProductStock = (productId: number, newStock: number) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, stock: newStock } : p
    ))
  }

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now(),
    }
    setTransactions(prev => [...prev, newTransaction])
  }

  const getTransactionsByDay = (day: string): Transaction[] => {
    return transactions.filter(t => t.day === day)
  }

  const updateGlobalTime = () => {
    setGlobalTime(getGlobalTime())
  }

  return (
    <AppContext.Provider value={{
      users, currentUser, roleRequests, productRequests, tasks, products, transactions, globalTime,
      login, logout, register,
      sendRoleRequest, respondToRoleRequest,
      sendProductRequest, respondToProductRequest,
      addTask, deleteTask, getTasksForEmployee, completeTask,
      addProduct, deleteProduct, updateProductStock,
      addTransaction, getTransactionsByDay, updateGlobalTime,
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