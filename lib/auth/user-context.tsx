"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase-client"

// واجهة سياق المستخدم
interface UserContextType {
  user: User | null
  loading: boolean
  error: Error | null
  signOut: () => Promise<void>
}

// إنشاء سياق المستخدم
const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
  signOut: async () => {},
})

// مزود سياق المستخدم
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  // تسجيل الخروج
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Error signing out:", error)
      setError(error as Error)
    }
  }

  // الحصول على المستخدم الحالي عند تحميل المكون
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        
        // الحصول على المستخدم الحالي
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          throw error
        }
        
        setUser(user)
      } catch (error) {
        console.error("Error fetching user:", error)
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUser()
    
    // الاستماع إلى تغييرات حالة المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user)
        } else if (event === "SIGNED_OUT") {
          setUser(null)
        }
      }
    )
    
    // إلغاء الاشتراك عند إزالة المكون
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // توفير سياق المستخدم للمكونات الفرعية
  return (
    <UserContext.Provider value={{ user, loading, error, signOut }}>
      {children}
    </UserContext.Provider>
  )
}

// خطاف لاستخدام سياق المستخدم
export function useUser() {
  return useContext(UserContext)
}
