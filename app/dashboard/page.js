// app/dashboard/page.js
'use client'
import {  useEffect, useState } from 'react'
import Navbar from "../components/Navbar";
import ProtectedRoute from "@/components/protected-route";
import { apiGet, apiPost } from "../../lib/api";
import Link from 'next/link';

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

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Create and manage your illusive servers</p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            
            {/* Create New Card */}
            <div className="group" onClick={handleCreateNew}>
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 border-dashed border-gray-300 hover:border-purple-400 aspect-square flex flex-col items-center justify-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <svg 
                    className="w-6 h-6 text-purple-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900 text-center">Create New</h3>
                <p className="text-xs text-gray-500 text-center mt-1">Illusive Server</p>
              </div>
            </div>

            {/* Example Existing Cards */}
            {server && server.map((srv, index) => (
              <div key={index} className="group">
              <Link href={`/server/${srv.subdomain}`}>
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer aspect-square flex flex-col p-4">
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="h-8 rounded-lg flex items-center justify-around mb-3">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                                              <svg className="w-4 h-4 text-blue-600" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.755 20.283 4 8h16l-1.755 12.283A2 2 0 0 1 16.265 22h-8.53a2 2 0 0 1-1.98-1.717zM21 4h-5V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v1H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2z"/></svg>

                    </div>
                    {/* <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.755 20.283 4 8h16l-1.755 12.283A2 2 0 0 1 16.265 22h-8.53a2 2 0 0 1-1.98-1.717zM21 4h-5V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v1H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2z"/></svg>
                    </div> */}
                    <h3 className="text-sm font-medium text-gray-900 mb-1">{srv.name}</h3>
                    <p className="text-xs text-gray-500">{srv.subdomain}</p>
                  </div>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Online
                    </span>
                  </div>
                </div>
              </div>
              </Link>
            </div>
            ))}

            {/* <div className="group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer aspect-square flex flex-col p-4">
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Beta Server</h3>
                    <p className="text-xs text-gray-500">beta.example.com</p>
                  </div>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Offline
                    </span>
                  </div>
                </div>
              </div>
            </div>*/}
          </div> 

          {/* Stats Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Total Servers</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Active</p>
                  <p className="text-2xl font-bold text-green-600">1</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Offline</p>
                  <p className="text-2xl font-bold text-yellow-600">1</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popup Modal */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  Create New Server
                </h3>
                <button
                  onClick={closePopup}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6">
                {error && (
                  <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label htmlFor="serverName" className="block text-sm font-medium text-gray-700 mb-2">
                      Server Name
                    </label>
                    <input
                      type="text"
                      id="serverName"
                      name="serverName"
                      value={formData.serverName}
                      onChange={handleInputChange}
                      placeholder="Enter server name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="serverSubdomain" className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                      <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-r-md">
                        .iluzan.com
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Only letters, numbers, and hyphens are allowed
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
                  <button
                    type="button"
                    onClick={closePopup}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </div>
                    ) : (
                      'Create Server'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}