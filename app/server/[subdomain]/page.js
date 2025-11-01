'use client';

import { useEffect, useState } from 'react';
import { useParams,useRouter } from 'next/navigation';
import { apiGet,apiPost } from '@/lib/api';
import ProtectedRoute from '@/components/protected-route';
import Navbar from '@/app/components/Navbar';
import { CirclePlus,X, Server, Globe, ArrowRight ,Trash2} from 'lucide-react';
import CopyButton from '@/app/components/CopyButton';
export default function Page() {
  const { subdomain } = useParams();
  const router = useRouter();
    const [request, setRequest] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false)
      const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
    const getMethodColor = (type) => {
    return type === 'GET' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700';
  };

      const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    url: '',
    type: 'GET',
    response: '',
  });
    async function fetchData() {
      // const res = await apiGet(`/get_server/${subdomain}`);
      // const data = await res.json();
      // setRequest(data);
                try {
      const response = await apiGet('/get_server/'+subdomain);

      if (response && response.ok) {
        const result = await response.json()
        console.log('Server created successfully:', result)
        setRequest(result); // Assuming the server data is in result.server
      } else {
        // const errorData = await response.json()
        console.log('Server not found');
        router.push('/not-found'); 
      }     
    } catch (err) {
      console.log('Server not found');
      router.push('/not-found'); 
    } 
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
    type: 'GET',
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
  const deleteRequest = async (id) => {
    // const requestId = e.currentTarget.getAttribute('data-id');
    try {
      const response = await apiPost(`/delete_request/${subdomain}`, {
        id: id,
      });
      
      if (response && response.ok) {
        console.log('Request deleted successfully');
        // Refresh the request list
        fetchData();
      } else {
        const errorData = await response.json();
        console.log(errorData.message || 'Failed to delete request');
      }
    } catch (err) {
      console.log('Error deleting request:', err);
    }
  };
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Server Requests</h1>
              <p className="text-slate-600">Manage and monitor your API endpoints</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium"
            >
              <CirclePlus size={20} />
              Add New Request
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {request.requests && request.requests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {request.requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 group hover:border-indigo-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                        <Server className="text-indigo-600" size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">{req.name}</h2>
                        <span className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(req.type)}`}>
                          {req.type}
                        </span>
                      </div>
                    </div>
                    <div><Trash2 onClick={() => deleteRequest(req.id)} className="text-slate-400 hover:text-red-500" size={22}/></div>
                  </div>
                  
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                      <Globe className="text-slate-400 mt-0.5 flex-shrink-0" size={16} />
                      <p className="text-sm text-slate-700 break-all">{req.url}</p>
                    </div>
                    
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1 font-medium">Response Preview</p>
                      <pre className="text-xs text-slate-700 font-mono overflow-x-auto">
                        {req.response.length > 60 ? req.response.substring(0, 60) + '...' : req.response}
                      </pre>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <p>Send to</p>
                      <p className="text-sm text-slate-700 break-all">{subdomain}.ilusion.io/{req.url}</p>
                        <CopyButton text={'https://'+subdomain+'.ilusion.io/'+req.url} />
                    </div>
                  </div>
                </div>
                
                {/* <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 transition-colors">
                    View Details
                    <ArrowRight size={14} />
                  </button>
                </div> */}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="p-6 bg-white rounded-full shadow-md mb-4">
              <Server className="text-slate-400" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No requests yet</h3>
            <p className="text-slate-600 mb-6">Get started by creating your first server request</p>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium"
            >
              <CirclePlus size={20} />
              Add New Request
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto animate-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <CirclePlus className="text-indigo-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Create New Request
                </h3>
              </div>
              <button
                onClick={closePopup}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                  <span className="text-red-500 font-bold">!</span>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                    Request Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., User Authentication API"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="url" className="block text-sm font-semibold text-slate-700 mb-2">
                    Request URL
                  </label>
                  <input
                    type="text"
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    placeholder="https://api.example.com/endpoint"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-semibold text-slate-700 mb-2">
                    Request Method
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                    required
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="response" className="block text-sm font-semibold text-slate-700 mb-2">
                    Response (JSON)
                  </label>
                  <textarea
                    id="response"
                    name="response"
                    value={formData.response}
                    onChange={handleInputChange}
                    placeholder='{"key": "value", "status": "success"}'
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closePopup}
                  className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Request'
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
