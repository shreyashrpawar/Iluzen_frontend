'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiGet,apiPost } from '@/lib/api';
import ProtectedRoute from '@/components/protected-route';
import Navbar from '@/app/components/Navbar';
import { CirclePlus } from 'lucide-react';

export default function Page() {
  const { subdomain } = useParams();
    const [request, setRequest] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false)
      const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

      const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    url: '',
    type: 'GET',
    response: '',
  });
      async function fetchData() {
      const res = await apiGet(`/get_server/${subdomain}`);
      const data = await res.json();
      setRequest(data);
    }
  useEffect(() => {

    fetchData();
  }, [subdomain]);
  const handleCreateNew = () => {
    setIsPopupOpen(true)
    setError('') // Clear any previous errors
  }  
const closePopup = () => {
    setIsPopupOpen(false)
    setFormData({
    name: '',
    subdomain: '',
    url: '',
    type: '',
    response: '',    })
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
  

  
      try {
        const response = await apiPost(`/get_server/${subdomain}`, {
          name: formData.name.trim(),
          url: formData.url.trim(),
          type: formData.type.trim(),
          response: formData.response.trim(),
        })
  
        if (response && response.ok) {
          const result = await response.json()
          console.log('Server created successfully:', result)
          
          // Close popup and reset form
          closePopup()
          
          // You might want to refresh the server list here
          // or add the new server to the existing list
          alert('Server created successfully!')
          fetchData() // Refresh the server list                                                                                      
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
  
  if (!request) return <p>Loading...</p>;

  return (
    <ProtectedRoute>
        <Navbar/>
    <div className='flex flex-col items-center justify-center p-5'>
      <CirclePlus onClick={handleCreateNew} height={48} width={48}/>
      <span>Add new request</span>
    </div>
    <div>
        <h1 className="text-2xl font-bold m-4">Server requests</h1>
        {request.requests && request.requests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {request.requests.map((req) => (
              <div key={req.id} className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-semibold mb-2">Name: {req.name}</h2>
                <p className="text-gray-600">URL: {req.url}</p>
                <p className="text-sm text-gray-500 mt-2">type: {req.type}</p>
                <p className="text-sm text-gray-500 mt-2">response: {req.response}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No requests found.</p>
        )}
                {isPopupOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  Create New request
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
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter request name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                      request URL
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="url"
                        name="url"
                        value={formData.url}
                        onChange={handleInputChange}
                        placeholder="my-server"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>
                    <div>
                    <label
                        htmlFor="type"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Request Method
                    </label>
                    <div className="flex">
                        <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                        >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        </select>
                    </div>
                    </div>    

<div>
  <label
    htmlFor="response"
    className="block text-sm font-medium text-gray-700 mb-2"
  >
    Response (JSON)
  </label>
  <textarea
    id="response"
    name="response"
    value={formData.response}
    onChange={handleInputChange}
    placeholder='{"key": "value"}'
    rows={6}
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
    required
  />
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
