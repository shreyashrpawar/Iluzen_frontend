'use client';
import React, { useState } from 'react';
import { ArrowRight, Check, Code, Zap, Globe, Play, Star, Users, Database, Shield, Clock, Sparkles, Server, Table, Eye, Plus } from 'lucide-react';
import Image from 'next/image';

const Home = () => {
  const [email, setEmail] = useState('');
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Server className="w-6 h-6" />,
      title: "Mock API Servers",
      description: "Create instant mock API endpoints with custom responses in seconds."
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Virtual Databases",
      description: "Create and manage virtual MySQL databases with full table control."
    },
    {
      icon: <Table className="w-6 h-6" />,
      title: "Visual Data Editor",
      description: "Design tables, add columns, and manage data with an intuitive interface."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Isolated",
      description: "Every database is isolated and secure with user-level access control."
    }
  ];

  const useCases = [
    { 
      icon: <Code className="w-5 h-5" />,
      title: "Frontend Development", 
      description: "Build UIs without backend dependencies using mock APIs and test databases" 
    },
    { 
      icon: <Zap className="w-5 h-5" />,
      title: "Rapid Prototyping", 
      description: "Quickly prototype with realistic data structures and API responses" 
    },
    { 
      icon: <Eye className="w-5 h-5" />,
      title: "API Testing", 
      description: "Test edge cases, error scenarios, and data flows easily" 
    },
    { 
      icon: <Users className="w-5 h-5" />,
      title: "Team Collaboration", 
      description: "Share mock endpoints and databases across your development team" 
    }
  ];

  const databaseFeatures = [
    "Create unlimited virtual databases",
    "Design custom table structures",
    "Add, view, and manage data visually",
    "Support for multiple data types",
    "Auto-generated primary keys",
    "Real-time data operations"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                      <Image src="/favicon.ico" alt="Ilusion Logo" width={40} height={40} />

              </div>
              <span className="text-white text-xl font-bold">Ilusion</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="/remote-database" className="text-white/80 hover:text-white transition-colors">Remote Database</a>
              {/* <a href="#api" className="text-white/80 hover:text-white transition-colors">Mock APIs</a>
              <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
              <a href="#database" className="text-white/80 hover:text-white transition-colors">Database</a> */}
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/50">
                <a href="/login">Get Started</a>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-white/90">Now with Virtual Database Management</span>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Mock APIs & Virtual
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"> Databases</span>
              <br />in Seconds
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed max-w-3xl mx-auto">
              Create instant mock API endpoints and manage virtual MySQL databases. Build, test, and prototype without waiting for backend infrastructure.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <a href="/register">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2 group shadow-lg shadow-purple-500/50">
                  Start Building Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </a>
              <button className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Dual Code Preview */}
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Server className="w-4 h-4 text-purple-400" />
                  <span className="text-white/70 text-sm font-semibold">Mock API</span>
                </div>
                <pre className="text-left text-sm text-white/90 overflow-x-auto">
                  <code>{`fetch('https://api.ilusion.io/users')
  .then(res => res.json())
  .then(data => console.log(data))`}</code>
                </pre>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-4 h-4 text-blue-400" />
                  <span className="text-white/70 text-sm font-semibold">Virtual Database</span>
                </div>
                <pre className="text-left text-sm text-white/90 overflow-x-auto">
                  <code>{`mysql -h ilusion.io -u user
mysql> USE myapp_db;
mysql> SELECT * FROM users;`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need to move fast
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Powerful features for modern development workflows
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                onMouseEnter={() => setActiveFeature(idx)}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mock API Features Section */}
      <section id="api" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">api-server</h3>
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Request
                  </button>
                </div>
                
                <div className="space-y-3">
                  {[
                    { name: 'Get Users', method: 'GET', url: '/api/users', color: 'blue' },
                    { name: 'Create User', method: 'POST', url: '/api/users', color: 'green' },
                    { name: 'Update Profile', method: 'POST', url: '/api/profile', color: 'green' },
                    { name: 'Get Posts', method: 'GET', url: '/api/posts', color: 'blue' }
                  ].map((request, idx) => (
                    <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Server className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{request.name}</div>
                            <div className="text-xs text-white/50">{request.url}</div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          request.color === 'blue' 
                            ? 'bg-blue-500/20 text-blue-300' 
                            : 'bg-green-500/20 text-green-300'
                        }`}>
                          {request.method}
                        </span>
                      </div>
                      <div className="text-xs text-white/40 font-mono bg-black/20 rounded p-2 mt-2">
                        https://api-server.ilusion.io{request.url}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl"></div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-full px-4 py-2 mb-6">
                <Server className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-300">Instant Mock API Server</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Create APIs in Seconds
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Build instant mock API endpoints with custom responses. No backend setup, no configuration hassle. Just create and start using.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Create unlimited mock API endpoints",
                  "Custom JSON responses for each route",
                  "Support for GET and POST methods",
                  "Share endpoints with your team",
                  "Auto-generated subdomain URLs",
                  "Copy-paste ready endpoints"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white/80">{feature}</span>
                  </div>
                ))}
              </div>
              
              <a href="/register">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-purple-500/50">
                  Create Your API Server
                  <ArrowRight className="w-5 h-5" />
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Database Features Section */}
      <section id="database" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2 mb-6">
                <Database className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-300">Virtual Database Management</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Manage Databases Like a Pro
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Create virtual MySQL databases, design tables visually, and manage data with an intuitive interface. No server setup required.
              </p>
              
              <div className="space-y-4 mb-8">
                {databaseFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white/80">{feature}</span>
                  </div>
                ))}
              </div>
              
              <a href="/register">
                <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/50">
                  Create Your Database
                  <ArrowRight className="w-5 h-5" />
                </button>
              </a>
                            <a href="/remote-database">
                <button className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/50">
                  Connect Your Database
                  <ArrowRight className="w-5 h-5" />
                </button>
              </a>
            </div>
            
            <div className="relative">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">production_db</h3>
                  <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Table
                  </button>
                </div>
                
                <div className="space-y-3">
                  {['users', 'posts', 'comments', 'categories'].map((table, idx) => (
                    <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Table className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{table}</div>
                            {/* <div className="text-xs text-white/50">{Math.floor(Math.random() * 100)} rows</div> */}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors">
                            <Plus className="w-3 h-3 text-green-400" />
                          </button>
                          <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors">
                            <Eye className="w-3 h-3 text-blue-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Built for every workflow
            </h2>
            <p className="text-xl text-white/70">
              From prototyping to production testing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase, idx) => (
              <div key={idx} className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-400/50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    {useCase.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{useCase.title}</h3>
                    <p className="text-white/70">{useCase.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl p-12 border border-white/20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to build something amazing?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Join developers who ship faster with instant mock APIs and virtual databases
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/register">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/50">
                    Get Started Free
                  </button>
                </a>
                <a href="/login">
                  <button className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                    Sign In
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">I</span>
                </div>
                <span className="text-white text-xl font-bold">Ilusion</span>
              </div>
              <p className="text-white/60 max-w-md">
                The fastest way to create mock APIs and virtual databases for modern development teams.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">About Product</h4>
              <ul className="space-y-2">
                <li><a href="#api" className="text-white/60 hover:text-white transition-colors">Mock APIs</a></li>
                <li><a href="#features" className="text-white/60 hover:text-white transition-colors">Features</a></li>
                <li><a href="#database" className="text-white/60 hover:text-white transition-colors">Database</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/60 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">&copy; 2025 Ilusion. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;