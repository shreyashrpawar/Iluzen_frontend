'use client'
import {  useEffect, useState } from 'react'
import Navbar from "../components/Navbar";
import ProtectedRoute from "@/components/protected-route";
import { apiGet, apiPost } from "../../lib/api";
import Link from 'next/link';
import { Plus, Server, Activity, AlertTriangle, CheckCircle, Trash2, X, Database, Copy, ExternalLink } from 'lucide-react';
import toast,{Toaster} from 'react-hot-toast';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('servers')
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isDatabasePopupOpen, setIsDatabasePopupOpen] = useState(false)
  const [isRemoteBasePopupOpen, setIsRemoteBasePopupOpen] = useState(false)
  const closeDatabasePopup = () => {
    setIsDatabasePopupOpen(false)
    setTableData({
      DatabaseName: '',
      DatabasePassword: ''
    })
    setError('')
  }
    const closeRemotePopup = () => {
    setIsRemoteBasePopupOpen(false)
    setRemotetableData({
      DatabaseHost: '',
      DatabaseName: '',
      DatabaseUsername: '',
      DatabasePassword: ''
    })
    setError('')
  }
  
  const copyToClipboard = (text, label = 'Copied!') => {
    navigator.clipboard.writeText(text)
    toast.success(label)
  }
  const [server, setServer] = useState('')
  const [database, setDatabase] = useState('')
  const [tableData, setTableData] = useState({
    DatabaseName: '',
    DatabasePassword: ''
  })
  const [formData, setFormData] = useState({
    serverName: '',
    serverSubdomain: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleCreateNew = () => {
    setIsPopupOpen(true)
    setError('')
  }    
  async function fetchServer() {
          try {
      const response = await apiGet('/get_server')

      if (response && response.ok) {
        const result = await response.json()
        console.log('Server created successfully:', result)
        setServer(result.servers)
      } else {
        const errorData = await response.json()
        console.log(errorData.message || 'Failed to fetch servers')
      }
    } catch (err) {
      console.error('Error fetching server:', err)
    } 
  }
    async function fetchDatabase() {
          try {
      const response = await apiGet('/get_databases')

      if (response && response.ok) {
        const result = await response.json()
        console.log('DATABASE fetch:', result)
        setDatabase(result.databases)
      } else {
        const errorData = await response.json()
        console.log(errorData.message || 'Failed to fetch database')
      }
    } catch (err) {
      console.error('Error fetching database:', err)
    } 
  }

  useEffect(() => {
  fetchServer();
  fetchDatabase();
  }, []);

  const closePopup = () => {
    setIsPopupOpen(false)
    setFormData({
      serverName: '',
      serverSubdomain: ''
    })
    setError('')
  }
    const deleteServer = async (id) => {
      try {
        const response = await apiPost(`/delete_server`, {
          id: id,
        });
        
        if (response && response.ok) {
          console.log('Server deleted successfully');
          fetchServer();
        } else {
          const errorData = await response.json();
          console.log(errorData.message || 'Failed to delete request');
        }
      } catch (err) {
        console.log('Error deleting request:', err);
      }
    };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
    const handleTableChange = (e) => {
    const { name, value } = e.target
    setTableData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const [RemotetableData, setRemotetableData] = useState({
    DatabaseHost: '',
    DatabaseName: '',
    DatabaseUsername: '',
    DatabasePassword: ''
  })
    const handleRemoteTableChange = (e) => {
    const { name, value } = e.target
    setRemotetableData(prev => ({
      ...prev,
      [name]: value
    }))
  }

    const handleRemoteDatabaseSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    console.log('Submitting remote table data:', RemotetableData);

    try {
      const response = await apiPost('/connect_remote_database', {
        host: RemotetableData.DatabaseHost,
        database_name: RemotetableData.DatabaseName,
        username: RemotetableData.DatabaseUsername,
        password: RemotetableData.DatabasePassword,
      })

      if (response && response.ok) {
        const result = await response.json()
        console.log('Remote Database connected successfully:', result)
        
        closeRemotePopup()
        
        toast.success('Remote Database connected successfully!')
        fetchDatabase()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to connect remote database')
      }
    } catch (err) {
      console.error('Error connecting remote database:', err)
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    if (!formData.serverName.trim()) {
      setError('Server name is required')
      setIsSubmitting(false)
      return
    }

    if (!formData.serverSubdomain.trim()) {
      setError('Server subdomain is required')
      setIsSubmitting(false)
      return
    }

    const subdomainRegex = /^[a-zA-Z0-9-]+$/
    if (!subdomainRegex.test(formData.serverSubdomain)) {
      setError('Subdomain can only contain letters, numbers, and hyphens')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await apiPost('/create_server', {
        name: formData.serverName.trim(),
        subdomain: formData.serverSubdomain.trim().toLowerCase()
      })

      if (response && response.ok) {
        const result = await response.json()
        console.log('Server created successfully:', result)
        
        closePopup()
        
        toast.success('Server created successfully!')
        fetchServer()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to create server')
      }
    } catch (err) {
      console.error('Error creating server:', err)
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDatabaseSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    console.log('Submitting table data:', tableData);

    try {
      const response = await apiPost('/create_database', {
        database_name: tableData.DatabaseName,
        password: tableData.DatabasePassword,
      })

      if (response && response.ok) {
        const result = await response.json()
        console.log('Database created successfully:', result)
        
        closePopup()
        
        toast.success('Database created successfully!')
        fetchDatabase()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to create server')
      }
    } catch (err) {
      console.error('Error creating server:', err)
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute>
     <Toaster position="top-center" reverseOrder={false} />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50"> 
      <div className="bg-white/60 backdrop-blur-md border-b border-slate-200 shadow-sm"><Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
              <p className="text-slate-600">Create and manage your illusive servers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="mb-8 border-b border-slate-200">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('servers')}
              className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'servers'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Server size={18} />
                Illusive Servers {server?.length > 0 && `(${server.length})`}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('databases')}
              className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'databases'
                  ? 'border-cyan-600 text-cyan-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Database size={18} />
                Databases {database?.length > 0 && `(${database.length})`}
              </div>
            </button>
          </div>
        </div>

        {/* Servers Tab */}
        {activeTab === 'servers' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Your Servers</h2>
                <p className="text-sm text-slate-600">Manage your API mock servers</p>
              </div>
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                <Plus size={20} />
                New Server
              </button>
            </div>

            {server && server.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {server.map((srv) => (
                  <Link href={`/server/${srv.subdomain}`} key={srv.id}>
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-purple-400 overflow-hidden group cursor-pointer h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      
                      <div className="p-6 relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                            <Server className="text-purple-600" size={24} />
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              deleteServer(srv.id)
                            }}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="text-slate-400 hover:text-red-600" size={18} />
                          </button>
                        </div>

                        <h3 className="text-lg font-semibold text-slate-900 mb-1 truncate">{srv.name}</h3>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">Active</span>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-600">Domain:</span>
                            <code className="text-slate-900 font-mono flex-1 truncate">{srv.subdomain}.ilusion.io</code>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                copyToClipboard(`${srv.subdomain}.ilusion.io`, 'Domain copied!')
                              }}
                              className="p-1 hover:bg-slate-200 rounded transition-colors flex-shrink-0"
                            >
                              <Copy size={16} className="text-slate-600" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs text-slate-500">Click to manage requests →</span>
                          <ExternalLink size={16} className="text-slate-400 group-hover:text-purple-600 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border-2 border-dashed border-purple-200">
                <div className="p-4 bg-purple-100 rounded-full mb-4">
                  <Server className="text-purple-600" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No servers yet</h3>
                <p className="text-slate-600 mb-6">Create your first mock API server</p>
                <button
                  onClick={handleCreateNew}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-md"
                >
                  <Plus size={18} />
                  Create Server
                </button>
              </div>
            )}
          </div>
        )}

        {/* Databases Tab */}
        {activeTab === 'databases' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Your Databases</h2>
                <p className="text-sm text-slate-600">Manage virtual and remote databases</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsRemoteBasePopupOpen(true)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-lg font-medium transition-all"
                >
                  <Plus size={20} />
                  Connect Remote
                </button>
                <button
                  onClick={() => setIsDatabasePopupOpen(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:from-cyan-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                >
                  <Plus size={20} />
                  Virtual DB
                </button>
              </div>
            </div>

            {database && database.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {database.map((srv) => (
                  <Link href={`/database/${srv.DATABASE_NAME}`} key={srv.DATABASE_NAME}>
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-cyan-400 overflow-hidden group cursor-pointer h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      
                      <div className="p-6 relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-cyan-100 rounded-lg group-hover:bg-cyan-200 transition-colors">
                            <Database className="text-cyan-600" size={24} />
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              deleteServer(srv.DATABASE_NAME)
                            }}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="text-slate-400 hover:text-red-600" size={18} />
                          </button>
                        </div>

                        <h3 className="text-lg font-semibold text-slate-900 mb-1 truncate">{srv.DATABASE_NAME}</h3>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs font-medium rounded">Connected</span>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-600">Type:</span>
                            <span className="text-slate-900 font-medium flex-1">{srv.type || 'Virtual'}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs text-slate-500">Click to explore data →</span>
                          <ExternalLink size={16} className="text-slate-400 group-hover:text-cyan-600 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border-2 border-dashed border-cyan-200">
                <div className="p-4 bg-cyan-100 rounded-full mb-4">
                  <Database className="text-cyan-600" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No databases yet</h3>
                <p className="text-slate-600 mb-6">Create a virtual database or connect a remote one</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDatabasePopupOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:from-cyan-700 hover:to-blue-700 transition-all shadow-md"
                  >
                    <Plus size={18} />
                    Virtual DB
                  </button>
                  <button
                    onClick={() => setIsRemoteBasePopupOpen(true)}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-lg font-medium transition-all"
                  >
                    <Plus size={18} />
                    Remote DB
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isDatabasePopupOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-auto border border-slate-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Plus className="text-cyan-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Create Virtual Database
                </h3>
              </div>
              <button
                onClick={closeDatabasePopup}
                className="text-slate-500 hover:text-slate-900 transition-colors p-1 hover:bg-slate-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-2">
                  <span className="text-red-600 font-bold">!</span>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="DatabaseName" className="block text-sm font-semibold text-slate-700 mb-2">
                    Database Name
                  </label>
                  <input
                    type="text"
                    id="DatabaseName"
                    name="DatabaseName"
                    value={tableData.DatabaseName || ""}
                    onChange={handleTableChange}
                    placeholder="e.g., Production API Server"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="serverSubdomain" className="block text-sm font-semibold text-slate-700 mb-2">
                    Database Username
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={tableData.username || "name"}
                      placeholder="my-server"
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 focus:outline-none transition-all"
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="DatabasePassword" className="block text-sm font-semibold text-slate-700 mb-2">
                    Database Password
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="DatabasePassword"
                      name="DatabasePassword"
                      value={tableData.DatabasePassword || ""}
                      onChange={handleTableChange}
                      placeholder="my-server"
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closePopup}
                  className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDatabaseSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Database'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


            {isRemoteBasePopupOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-auto border border-slate-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Plus className="text-cyan-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Connect Remote Database
                </h3>
              </div>
              <button
                onClick={closeRemotePopup}
                className="text-slate-500 hover:text-slate-900 transition-colors p-1 hover:bg-slate-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-2">
                  <span className="text-red-600 font-bold">!</span>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="DatabaseHost" className="block text-sm font-semibold text-slate-700 mb-2">
                    Database Host
                  </label>
                  <input
                    type="text"
                    id="DatabaseHost"
                    name="DatabaseHost"
                    value={RemotetableData.DatabaseHost}
                    onChange={handleRemoteTableChange}
                    placeholder="e.g., Production API Server"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="DatabaseName" className="block text-sm font-semibold text-slate-700 mb-2">
                    Database Name
                  </label>
                  <input
                    type="text"
                    id="DatabaseName"
                    name="DatabaseName"
                    value={RemotetableData.DatabaseName}
                    onChange={handleRemoteTableChange}
                    placeholder="e.g., Production API Server"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="serverSubdomain" className="block text-sm font-semibold text-slate-700 mb-2">
                    Database Username
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="DatabaseUsername"
                      name="DatabaseUsername"
                      value={RemotetableData.DatabaseUsername}
                      onChange={handleRemoteTableChange}
                      placeholder="my-server"
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="DatabasePassword" className="block text-sm font-semibold text-slate-700 mb-2">
                    Database Password
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="DatabasePassword"
                      name="DatabasePassword"
                      value={RemotetableData.DatabasePassword}
                      onChange={handleRemoteTableChange}
                      placeholder="my-server"
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closePopup}
                  className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRemoteDatabaseSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Creating...
                    </div>
                  ) : (
                    'Save Connection'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-auto border border-slate-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Plus className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Create New Server
                </h3>
              </div>
              <button
                onClick={closePopup}
                className="text-slate-500 hover:text-slate-900 transition-colors p-1 hover:bg-slate-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-2">
                  <span className="text-red-600 font-bold">!</span>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="serverName" className="block text-sm font-semibold text-slate-700 mb-2">
                    Server Name
                  </label>
                  <input
                    type="text"
                    id="serverName"
                    name="serverName"
                    value={formData.serverName}
                    onChange={handleInputChange}
                    placeholder="e.g., Production API Server"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="serverSubdomain" className="block text-sm font-semibold text-slate-700 mb-2">
                    Server Subdomain
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="serverSubdomain"
                      name="serverSubdomain"
                      value={formData.serverSubdomain}
                      onChange={handleInputChange}
                      placeholder="my-server"
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-l-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    <span className="inline-flex items-center px-4 py-3 border border-l-0 border-slate-200 bg-slate-50 text-slate-600 text-sm rounded-r-lg font-medium">
                      .iluzan.com
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Only letters, numbers, and hyphens are allowed
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closePopup}
                  className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Server'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}