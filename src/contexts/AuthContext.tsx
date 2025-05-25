import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])



  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Sign in error:', error.message)
        setError(error.message)
        throw error
      }

      // Verify the user exists and is confirmed
      if (!data.user?.confirmed_at) {
        setError('Please confirm your email address before signing in')
        throw new Error('Email not confirmed')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred during sign in'
      console.error('Sign in error:', message)
      setError(message)
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setError(null)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        console.error('Sign up error:', error.message)
        setError(error.message)
        throw error
      }

      // Check if email confirmation is required
      if (!data.user?.confirmed_at) {
        setError('Please check your email for confirmation link')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred during sign up'
      console.error('Sign up error:', message)
      setError(message)
      throw error
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error.message)
        setError(error.message)
        throw error
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred during sign out'
      console.error('Sign out error:', message)
      setError(message)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
