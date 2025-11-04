'use client'
import {  useEffect, useState } from 'react'
import Navbar from "../components/Navbar";
import ProtectedRoute from "@/components/protected-route";
import { apiGet, apiPost } from "../../lib/api";
import Link from 'next/link';
import { Plus, Server, Activity, AlertTriangle, CheckCircle, Trash2, X, Database } from 'lucide-react';
import toast,{Toaster} from 'react-hot-toast';

export default function DashboardPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"> 
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-lg"><Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-300">Create and manage your illusive servers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold text-white mb-4">Illusive Servers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          
          <div className="group" onClick={handleCreateNew}>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-dashed border-white/30 hover:border-purple-400/70 aspect-square flex flex-col items-center justify-center p-6">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                <Plus className="text-purple-300" size={32} />
              </div>
              <h3 className="text-sm font-semibold text-white text-center">Create New</h3>
              <p className="text-xs text-gray-400 text-center mt-1">Illusive Server</p>
            </div>
          </div>

          {server && server.map((srv) => (

            <div key={srv.id} className="group">
                          <Link href={`/server/${srv.subdomain}`} key={srv.id} className="group">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer aspect-square flex flex-col p-5 border border-white/20 hover:border-purple-400/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full opacity-50"></div>
                
                <div className="flex-1 flex flex-col justify-between relative z-10">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                        <Server className="text-purple-300" size={20} />
                      </div>
                      <div className="p-1.5 hover:bg-red-500/20 rounded-lg m-3">
                        <Trash2 onClick={(e) =>{e.preventDefault();deleteServer(srv.id);}} className="text-gray-400 hover:text-red-400" size={16} />
                      </div>
                    </div>
                    
                    <h3 className="text-base font-semibold text-white mb-1 truncate">{srv.name}</h3>
                    <p className="text-xs text-gray-400 truncate">{srv.subdomain}.ilusion.io</p>
                  </div>
                </div>
              </div></Link>
            </div>
          ))}

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold text-white mb-4">Virtual Databases</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          
          <div className="group" onClick={() => setIsDatabasePopupOpen(true)}>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-dashed border-white/30 hover:border-blue-400/70 aspect-square flex flex-col items-center justify-center p-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Plus className="text-blue-300" size={32} />
              </div>
              <h3 className="text-sm font-semibold text-white text-center">Create Virtual Database</h3>
            </div>
          </div>

          <div className="group" onClick={() => setIsRemoteBasePopupOpen(true)}>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-dashed border-white/30 hover:border-blue-400/70 aspect-square flex flex-col items-center justify-center p-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Plus className="text-blue-300" size={32} />
              </div>
              <h3 className="text-sm font-semibold text-white text-center">Connect Remote Database</h3>
            </div>
          </div>

          {database && database.map((srv) => (

            <div key={srv.DATABASE_NAME} className="group">
                          <Link href={`/database/${srv.DATABASE_NAME}`} key={srv.DATABASE_NAME} className="group">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer aspect-square flex flex-col p-5 border border-white/20 hover:border-blue-400/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full opacity-50"></div>
                
                <div className="flex-1 flex flex-col justify-between relative z-10">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                        <Database className="text-blue-300" size={20} />
                      </div>
                      <div className="p-1.5 hover:bg-red-500/20 rounded-lg m-3">
                        <Trash2 onClick={(e) =>{e.preventDefault();deleteServer(srv.DATABASE_NAME);}} className="text-gray-400 hover:text-red-400" size={16} />
                      </div>
                    </div>
                    
                    <h3 className="text-base font-semibold text-white mb-1 truncate">{srv.DATABASE_NAME}</h3>
                  </div>
                </div>
              </div></Link>
            </div>
          ))}

        </div>
      </div>

      {isDatabasePopupOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full mx-auto border border-white/20">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Plus className="text-blue-300" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Create Virtual Database
                </h3>
              </div>
              <button
                onClick={closeDatabasePopup}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg flex items-start gap-2">
                  <span className="text-red-400 font-bold">!</span>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="DatabaseName" className="block text-sm font-semibold text-gray-300 mb-2">
                    Database Name
                  </label>
                  <input
                    type="text"
                    id="DatabaseName"
                    name="DatabaseName"
                    value={tableData.DatabaseName || ""}
                    onChange={handleTableChange}
                    placeholder="e.g., Production API Server"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="serverSubdomain" className="block text-sm font-semibold text-gray-300 mb-2">
                    Database Username
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={tableData.username || "name"}
                      placeholder="my-server"
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-gray-400 focus:outline-none transition-all"
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="DatabasePassword" className="block text-sm font-semibold text-gray-300 mb-2">
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
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={closePopup}
                  className="px-5 py-2.5 text-sm font-medium text-gray-300 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDatabaseSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full mx-auto border border-white/20">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Plus className="text-blue-300" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Connect Remote Database
                </h3>
              </div>
              <button
                onClick={closeRemotePopup}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg flex items-start gap-2">
                  <span className="text-red-400 font-bold">!</span>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="DatabaseHost" className="block text-sm font-semibold text-gray-300 mb-2">
                    Database Host
                  </label>
                  <input
                    type="text"
                    id="DatabaseHost"
                    name="DatabaseHost"
                    value={RemotetableData.DatabaseHost}
                    onChange={handleRemoteTableChange}
                    placeholder="e.g., Production API Server"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="DatabaseName" className="block text-sm font-semibold text-gray-300 mb-2">
                    Database Name
                  </label>
                  <input
                    type="text"
                    id="DatabaseName"
                    name="DatabaseName"
                    value={RemotetableData.DatabaseName}
                    onChange={handleRemoteTableChange}
                    placeholder="e.g., Production API Server"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="serverSubdomain" className="block text-sm font-semibold text-gray-300 mb-2">
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
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-gray-400 focus:outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="DatabasePassword" className="block text-sm font-semibold text-gray-300 mb-2">
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
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={closePopup}
                  className="px-5 py-2.5 text-sm font-medium text-gray-300 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRemoteDatabaseSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full mx-auto border border-white/20">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Plus className="text-purple-300" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Create New Server
                </h3>
              </div>
              <button
                onClick={closePopup}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg flex items-start gap-2">
                  <span className="text-red-400 font-bold">!</span>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="serverName" className="block text-sm font-semibold text-gray-300 mb-2">
                    Server Name
                  </label>
                  <input
                    type="text"
                    id="serverName"
                    name="serverName"
                    value={formData.serverName}
                    onChange={handleInputChange}
                    placeholder="e.g., Production API Server"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="serverSubdomain" className="block text-sm font-semibold text-gray-300 mb-2">
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
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    <span className="inline-flex items-center px-4 py-3 border border-l-0 border-white/20 bg-white/5 text-gray-400 text-sm rounded-r-lg font-medium">
                      .iluzan.com
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Only letters, numbers, and hyphens are allowed
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={closePopup}
                  className="px-5 py-2.5 text-sm font-medium text-gray-300 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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