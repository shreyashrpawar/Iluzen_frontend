'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/auth-context'
import { useRouter } from 'next/navigation'


export default function SignupPage() { 
        const { register } = useAuth()
      const [email, setEmail] = useState('')
      const [password, setPassword] = useState('')
        const [error, setError] = useState('')
        const [isLoading, setIsLoading] = useState(false)
        
      const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await register(email, password)
      router.push('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
    const router = useRouter()

    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w
            md">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Sign Up
                </h1>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input type="email"                 value={email}
                onChange={(e) => setEmail(e.target.value)}
 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter your email" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input type="password"                 value={password}
                onChange={(e) => setPassword(e.target.value)}
 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Create a password" required />
                    </div>
                    <button type="submit" className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Already have an account? <a href="/login" className="text-purple-600
    hover:underline">Sign In</a>
                </p>
            </div>
        </div>
    )
}