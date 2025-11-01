import React from 'react';
import { Home, Search, ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* 404 Number with gradient */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[200px] font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent leading-none animate-pulse">
            404
          </h1>
        </div>

        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-bounce">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-xl text-white/70 mb-12 max-w-md mx-auto">
          Oops! The page you're looking for seems to have vanished into the digital void.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <a href="/">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2 group shadow-lg shadow-purple-500/50">
              <Home className="w-5 h-5" />
              Back to Home
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
          </a>
          
          <button className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm">
            <Search className="w-5 h-5" />
            Search Site
          </button>
        </div>

        {/* Helpful Links */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <p className="text-white/60 mb-4">You might want to try:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/" className="text-purple-400 hover:text-purple-300 transition-colors">
              Home
            </a>
            <span className="text-white/30">•</span>
            <a href="/docs" className="text-purple-400 hover:text-purple-300 transition-colors">
              Documentation
            </a>
            <span className="text-white/30">•</span>
            <a href="/support" className="text-purple-400 hover:text-purple-300 transition-colors">
              Support
            </a>
            <span className="text-white/30">•</span>
            <a href="/contact" className="text-purple-400 hover:text-purple-300 transition-colors">
              Contact Us
            </a>
          </div>
        </div>

        {/* Error Code */}
        <div className="mt-8 text-white/40 text-sm">
          Error Code: 404 | Page Not Found
        </div>
      </div>
    </div>
  );
}