// lib/auth-context.js
'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    console.log(token);
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        // credentials: 'include',
      })

      if (response.ok) {
        const userData = await response.json()
        console.log("User data:", userData);
        setUser(userData)
        return;
      } 
      // else {
      //   localStorage.removeItem('token')
      // }
    } catch (error) {
      console.error('Auth check failed:', error)
      // localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

    const register = async (name,email, password) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // credentials: 'include',
      body: JSON.stringify({ name,email, password })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Login failed')
    }

    const data = await response.json()
    localStorage.setItem('token', data.token)
    setUser(data.token)
    console.log("User logged in:", data.message);
    console.log(user);
  }


  const login = async (email, password) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // credentials: 'include',
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Login failed')
    }

    const data = await response.json()
    localStorage.setItem('token', data.token)
    setUser(data.token)
    console.log("User logged in:", data.message);
    console.log(user);
  }

  const logout = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        })
      } catch (error) {
        console.error('Logout request failed:', error)
      }
    }
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading ,register}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}