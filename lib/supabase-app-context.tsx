"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from "./supabase"

// Reuse the same types from the original context
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

export type MoveRequest = {
  id: string
  product: string
  quantity: number
  from: string
  to: string
  shelf?: string
  requestedBy: "manager" | "supplier"
  status: "pending" | "confirmed"
  createdAt: string
  assignedTo?: string
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
  week?: number
  duration?: number
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
  sector?: string
  unit?: string
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
  moveRequests: MoveRequest[]
  tasks: Task[]
  products: Product[]
  transactions: Transaction[]
  globalTime: GlobalTime
  loading: boolean
  login: (name: string, password: string) => Promise<boolean>
  logout: () => void
  register: (name: string, password: string) => Promise<boolean>
  sendRoleRequest: (toUserId: number, role: Role) => Promise<void>
  respondToRoleRequest: (requestId: number, accept: boolean) => Promise<void>
  sendProductRequest: (toUserId: number, type: "give" | "take", product: string, quantity: number) => Promise<void>
  respondToProductRequest: (requestId: number, accept: boolean) => Promise<void>
  addMoveRequest: (request: Omit<MoveRequest, 'id' | 'createdAt'>) => Promise<void>
  confirmMoveRequest: (requestId: string) => Promise<void>
  assignMoveRequest: (requestId: string, employeeName: string) => Promise<void>
  getConfirmedMoveRequests: () => MoveRequest[]
  addTask: (task: Omit<Task, 'id'>) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  getTasksForEmployee: (employeeName: string, day?: string) => Task[]
  completeTask: (taskId: string) => Promise<void>
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>
  deleteProduct: (productId: number) => Promise<void>
  updateProductStock: (productId: number, newStock: number) => Promise<void>
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>
  getTransactionsByDay: (day: string) => Transaction[]
  updateGlobalTime: () => void
  refreshData: () => Promise<void>
}

const AppContext = createContext<AppContextType | null>(null)

const getGlobalTime = (): GlobalTime => {
  const now = new Date()
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const mongolianDays = ["Ýì", "Äàâàà", "ÿãìàð", "Ëõàãâà", "Ïýðýâ", "Áààñàí", "Áÿìáà"]
  
  return {
    currentDateTime: now,
    currentDay: mongolianDays[now.getDay()],
    currentTime: now.toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' }),
    currentDate: now.toISOString().split('T')[0]
  }
}

export function SupabaseAppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>([])
  const [productRequests, setProductRequests] = useState<ProductRequest[]>([])
  const [moveRequests, setMoveRequests] = useState<MoveRequest[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [globalTime, setGlobalTime] = useState<GlobalTime>(getGlobalTime())
  const [loading, setLoading] = useState(true)

  // Fetch all data from Supabase
  const fetchAllData = async () => {
    try {
      setLoading(true)
      
      // Fetch users
      const { data: usersData } = await supabase.from('users').select('*')
      if (usersData) setUsers(usersData.map(u => ({ ...u, roles: u.roles || [] })))
      
      // Fetch role requests
      const { data: roleRequestsData } = await supabase.from('role_requests').select('*')
      if (roleRequestsData) setRoleRequests(roleRequestsData)
      
      // Fetch product requests
      const { data: productRequestsData } = await supabase.from('product_requests').select('*')
      if (productRequestsData) setProductRequests(productRequestsData)
      
      // Fetch move requests
      const { data: moveRequestsData } = await supabase.from('move_requests').select('*')
      if (moveRequestsData) setMoveRequests(moveRequestsData.map(mr => ({
        ...mr,
        from: mr.from_location,
        to: mr.to_location,
        requestedBy: mr.requested_by,
        createdAt: mr.created_at,
        assignedTo: mr.assigned_to
      })))
      
      // Fetch tasks
      const { data: tasksData } = await supabase.from('tasks').select('*')
      if (tasksData) setTasks(tasksData.map(t => ({
        ...t,
        from: t.from_location,
        to: t.to_location
      })))
      
      // Fetch products
      const { data: productsData } = await supabase.from('products').select('*')
      if (productsData) setProducts(productsData)
      
      // Fetch transactions with items
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select(`
          *,
          transaction_items (
            product,
            quantity,
            price
          )
        `)
      
      if (transactionsData) {
        const formattedTransactions = transactionsData.map(t => ({
          ...t,
          items: t.transaction_items || []
        }))
        setTransactions(formattedTransactions)
      }
      
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  const login = async (name: string, password: string): Promise<boolean> => {
    const user = users.find(u => u.name === name && u.password === password)
    if (!user) return false
    setCurrentUser(user)
    return true
  }

  const logout = () => setCurrentUser(null)

  const register = async (name: string, password: string): Promise<boolean> => {
    const exists = users.some(u => u.name.toLowerCase() === name.toLowerCase())
    if (exists) return false
    
    try {
      const { data } = await supabase
        .from('users')
        .insert([{ name, password, roles: [] }])
        .select()
        .single()
      
      if (data) {
        setCurrentUser({ ...data, roles: data.roles || [] })
        await fetchAllData()
        return true
      }
    } catch (error) {
      console.error('Registration error:', error)
    }
    return false
  }

  const sendRoleRequest = async (toUserId: number, role: Role) => {
    if (!currentUser) return
    
    try {
      await supabase.from('role_requests').insert([{
        from_user_id: currentUser.id,
        to_user_id: toUserId,
        requested_role: role,
        status: 'pending'
      }])
      await fetchAllData()
    } catch (error) {
      console.error('Error sending role request:', error)
    }
  }

  const respondToRoleRequest = async (requestId: number, accept: boolean) => {
    try {
      const { data: request } = await supabase
        .from('role_requests')
        .select('*')
        .eq('id', requestId)
        .single()
      
      if (accept && request) {
        // Update user roles
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('id', request.to_user_id)
          .single()
        
        if (user && !user.roles.includes(request.requested_role)) {
          await supabase
            .from('users')
            .update({ roles: [...user.roles, request.requested_role] })
            .eq('id', request.to_user_id)
        }
      }
      
      await supabase
        .from('role_requests')
        .update({ status: accept ? 'accepted' : 'declined' })
        .eq('id', requestId)
      
      await fetchAllData()
    } catch (error) {
      console.error('Error responding to role request:', error)
    }
  }

  const sendProductRequest = async (
    toUserId: number,
    type: "give" | "take",
    product: string,
    quantity: number
  ) => {
    if (!currentUser) return
    
    try {
      await supabase.from('product_requests').insert([{
        from_user_id: currentUser.id,
        to_user_id: toUserId,
        type,
        product,
        quantity,
        status: 'pending'
      }])
      await fetchAllData()
    } catch (error) {
      console.error('Error sending product request:', error)
    }
  }

  const respondToProductRequest = async (requestId: number, accept: boolean) => {
    try {
      await supabase
        .from('product_requests')
        .update({ status: accept ? 'accepted' : 'declined' })
        .eq('id', requestId)
      await fetchAllData()
    } catch (error) {
      console.error('Error responding to product request:', error)
    }
  }

  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      await supabase.from('tasks').insert([{
        ...task,
        from_location: task.from,
        to_location: task.to
      }])
      await fetchAllData()
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      await supabase.from('tasks').delete().eq('id', taskId)
      await fetchAllData()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const getTasksForEmployee = (employeeName: string, day?: string): Task[] => {
    return tasks.filter(task => {
      const matchesEmployee = !task.employee || task.employee === employeeName
      const matchesDay = !day || !task.day || task.day === day
      return matchesEmployee && matchesDay
    })
  }

  const completeTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task || task.completed) return

    try {
      // Mark task as completed
      await supabase.from('tasks').update({ completed: true }).eq('id', taskId)

      // If it's a move task involving products, update stock and create sales transaction
      if (task.type === "move" && task.product && task.quantity && task.to?.includes("outside")) {
        // Update product stock
        const product = products.find(p => p.name === task.product)
        if (product) {
          const newStock = Math.max(0, product.stock - task.quantity)
          await supabase
            .from('products')
            .update({ stock: newStock })
            .eq('id', product.id)

          // Create sales transaction
          const transactionTotal = task.quantity * (product.price || 0)
          const { data: newTransaction } = await supabase
            .from('transactions')
            .insert([{
              worker: task.employee || "Unknown",
              day: task.day || "Unknown",
              date: new Date().toISOString().split('T')[0],
              total: transactionTotal,
              timestamp: Date.now()
            }])
            .select()
            .single()

          if (newTransaction) {
            await supabase.from('transaction_items').insert([{
              transaction_id: newTransaction.id,
              product: task.product,
              quantity: task.quantity,
              price: product.price || 0
            }])
          }
        }
      }
      
      await fetchAllData()
    } catch (error) {
      console.error('Error completing task:', error)
    }
  }

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      await supabase.from('products').insert([product])
      await fetchAllData()
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  const deleteProduct = async (productId: number) => {
    try {
      await supabase.from('products').delete().eq('id', productId)
      await fetchAllData()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const updateProductStock = async (productId: number, newStock: number) => {
    try {
      await supabase.from('products').update({ stock: newStock }).eq('id', productId)
      await fetchAllData()
    } catch (error) {
      console.error('Error updating product stock:', error)
    }
  }

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const { data: newTransaction } = await supabase
        .from('transactions')
        .insert([{
          worker: transaction.worker,
          day: transaction.day,
          date: transaction.date,
          total: transaction.total,
          timestamp: transaction.timestamp
        }])
        .select()
        .single()

      if (newTransaction) {
        await supabase.from('transaction_items').insert(
          transaction.items.map(item => ({
            transaction_id: newTransaction.id,
            product: item.product,
            quantity: item.quantity,
            price: item.price
          }))
        )
      }
      
      await fetchAllData()
    } catch (error) {
      console.error('Error adding transaction:', error)
    }
  }

  const getTransactionsByDay = (day: string): Transaction[] => {
    return transactions.filter(t => t.day === day)
  }

  const addMoveRequest = async (request: Omit<MoveRequest, 'id' | 'createdAt'>) => {
    if (!currentUser) return
    
    try {
      await supabase.from('move_requests').insert([{
        ...request,
        requested_by: request.requestedBy,
        from_location: request.from,
        to_location: request.to
      }])
      await fetchAllData()
    } catch (error) {
      console.error('Error adding move request:', error)
    }
  }

  const confirmMoveRequest = async (requestId: string) => {
    try {
      await supabase.from('move_requests').update({ status: "confirmed" }).eq('id', requestId)
      await fetchAllData()
    } catch (error) {
      console.error('Error confirming move request:', error)
    }
  }

  const assignMoveRequest = async (requestId: string, employeeName: string) => {
    try {
      await supabase.from('move_requests').update({ assigned_to: employeeName }).eq('id', requestId)
      await fetchAllData()
    } catch (error) {
      console.error('Error assigning move request:', error)
    }
  }

  const getConfirmedMoveRequests = (): MoveRequest[] => {
    return moveRequests.filter(r => r.status === "confirmed" && r.assignedTo === undefined)
  }

  const updateGlobalTime = () => {
    setGlobalTime(getGlobalTime())
  }

  const refreshData = async () => {
    await fetchAllData()
  }

  return (
    <AppContext.Provider value={{
      users, currentUser, roleRequests, productRequests, moveRequests, tasks, products, transactions, globalTime, loading,
      login, logout, register,
      sendRoleRequest, respondToRoleRequest,
      sendProductRequest, respondToProductRequest,
      addMoveRequest, confirmMoveRequest, assignMoveRequest, getConfirmedMoveRequests,
      addTask, deleteTask, getTasksForEmployee, completeTask,
      addProduct, deleteProduct, updateProductStock,
      addTransaction, getTransactionsByDay, updateGlobalTime, refreshData,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useSupabaseApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useSupabaseApp must be used within SupabaseAppProvider")
  return ctx
}
