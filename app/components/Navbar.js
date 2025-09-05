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
    <nav className="w-full bg-white shadow flex items-center justify-between px-6 py-4">
      <Link href="/" className="text-xl font-bold text-purple-600">
        Iluzan
      </Link>
      
      <div className="flex gap-4">
        {loading ? (
          // Show loading state while checking authentication
          <div className="bg-gray-200 text-gray-400 px-4 py-2 rounded-lg">
            Loading...
          </div>
        ) : isAuthenticated ? (
          <div className="flex items-center gap-4">
            {/* Optional: Show user info */}
            <span className="text-gray-700">
              Welcome, {user.name}
            </span>
            
            <button
              onClick={handleLogout}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link
              href="/login"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-gray-200 text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}