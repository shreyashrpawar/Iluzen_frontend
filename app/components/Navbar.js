// components/Navbar.js
'use client'
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const isAuthenticated = !!user;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4">
      <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-blue-300 transition-all">
        Ilusion
      </Link>
      
      <div className="flex gap-4">
        {loading ? (
          <div className="bg-white/10 text-gray-400 px-4 py-2 rounded-lg">
            Loading...
          </div>
        ) : isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-300">
              Welcome, {user.name}
            </span>
            
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link
              href="/login"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-white/10 text-purple-300 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}