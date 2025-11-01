// app/dashboard/page.js
'use client'
import {  useEffect, useState } from 'react'
import Navbar from "../components/Navbar";
import ProtectedRoute from "@/components/protected-route";
import { apiGet, apiPost } from "../../lib/api";
import Link from 'next/link';
import { Plus, Server, Activity, AlertTriangle, CheckCircle, Trash2, X } from 'lucide-react';

export default function DashboardPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [server, setServer] = useState('')
  const [formData, setFormData] = useState({
    serverName: '',
    serverSubdomain: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleCreateNew = () => {
    setIsPopupOpen(true)
    setError('') // Clear any previous errors
  }    
  async function fetchServer() {
          try {
      const response = await apiGet('/get_server')

      if (response && response.ok) {
        const result = await response.json()
        console.log('Server created successfully:', result)
        setServer(result.servers) // Assuming the server data is in result.server
      } else {
        const errorData = await response.json()
        console.log(errorData.message || 'Failed to fetch servers')
      }
    } catch (err) {
      console.error('Error fetching server:', err)
    } 
  }

  useEffect(() => {
  fetchServer();
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
      // const requestId = e.currentTarget.getAttribute('data-id');
      try {
        const response = await apiPost(`/delete_server`, {
          id: id,
        });
        
        if (response && response.ok) {
          console.log('Server deleted successfully');
          // Refresh the request list
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Basic validation
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

    // Subdomain validation (alphanumeric and hyphens only)
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
        
        // Close popup and reset form
        closePopup()
        
        // You might want to refresh the server list here
        // or add the new server to the existing list
        alert('Server created successfully!')
        fetchServer() // Refresh the server list                                                                                      
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
  // const activeServers = server.filter(s => s.status === 'online').length;
  // const offlineServers = server.filter(s => s.status === 'offline').length;

  return (
    <ProtectedRoute>
      <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white border-b border-slate-200 shadow-sm">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          
          <div className="group" onClick={handleCreateNew}>
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-dashed border-slate-300 hover:border-indigo-400 aspect-square flex flex-col items-center justify-center p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                <Plus className="text-indigo-600" size={32} />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 text-center">Create New</h3>
              <p className="text-xs text-slate-500 text-center mt-1">Illusive Server</p>
            </div>
          </div>

          {server && server.map((srv) => (

            <div key={srv.id} className="group">
                          <Link href={`/server/${srv.subdomain}`} key={srv.id} className="group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer aspect-square flex flex-col p-5 border border-slate-200 hover:border-indigo-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full opacity-50"></div>
                
                <div className="flex-1 flex flex-col justify-between relative z-10">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                        <Server className="text-indigo-600" size={20} />
                      </div>
                      <div className="p-1.5 hover:bg-red-50 rounded-lg m-3">
                        <Trash2 onClick={(e) =>{e.preventDefault();deleteServer(srv.id);}} className="text-slate-400 hover:text-red-500" size={16} />
                      </div>
                    </div>
                    
                    <h3 className="text-base font-semibold text-slate-900 mb-1 truncate">{srv.name}</h3>
                    <p className="text-xs text-slate-500 truncate">{srv.subdomain}.ilusion.io</p>
                  </div>
                </div>
              </div></Link>
            </div>
          ))}

        </div>

        {/* <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Server className="text-indigo-600" size={24} />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Servers</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{server.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Active</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{activeServers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="text-yellow-600" size={24} />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Offline</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{offlineServers}</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Plus className="text-indigo-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Create New Server
                </h3>
              </div>
              <button
                onClick={closePopup}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                  <span className="text-red-500 font-bold">!</span>
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
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                    <span className="inline-flex items-center px-4 py-3 border border-l-0 border-slate-300 bg-slate-50 text-slate-600 text-sm rounded-r-lg font-medium">
                      .iluzan.com
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Only letters, numbers, and hyphens are allowed
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
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
                  className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
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