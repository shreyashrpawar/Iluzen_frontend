'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiGet, apiPost } from '@/lib/api';
import ProtectedRoute from '@/components/protected-route';
import Navbar from '@/app/components/Navbar';
import { CirclePlus, X, Server, Globe, Trash2 } from 'lucide-react';
import CopyButton from '@/app/components/CopyButton';

export default function Page() {
  const { subdomain } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const getMethodColor = (type) => {
    return type === 'GET' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300';
  };

  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    url: '',
    type: 'GET',
    response: '',
  });

  async function fetchData() {
    try {
      const response = await apiGet('/get_server/' + subdomain);

      if (response && response.ok) {
        const result = await response.json();
        console.log('Server created successfully:', result);
        setRequest(result);
      } else {
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
    setIsPopupOpen(true);
    setError('');
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setFormData({
      name: '',
      subdomain: '',
      url: '',
      type: 'GET',
      response: '',
    });
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const deleteRequest = async (id) => {
    try {
      const response = await apiPost(`/delete_request/${subdomain}`, {
        id: id,
      });

      if (response && response.ok) {
        console.log('Request deleted successfully');
        fetchData();
      } else {
        const errorData = await response.json();
        console.log(errorData.message || 'Failed to delete request');
      }
    } catch (err) {
      console.log('Error deleting request:', err);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await apiPost(`/get_server/${subdomain}`, {
        name: formData.name.trim(),
        url: formData.url.trim(),
        type: formData.type.trim(),
        response: formData.response.trim(),
      });

      if (response && response.ok) {
        const result = await response.json();
        console.log('Server created successfully:', result);
        closePopup();
        alert('Server created successfully!');
        fetchData();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create server');
      }
    } catch (err) {
      console.error('Error creating server:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!request) return <p>Loading...</p>;

  return (
    <ProtectedRoute>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"><Navbar />
        {/* Header Section */}
        <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Server Requests</h1>
                <p className="text-gray-300">Manage and monitor your API endpoints</p>
              </div>
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
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
                  className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/20 group hover:border-purple-400/50"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                          <Server className="text-purple-300" size={24} />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-white">{req.name}</h2>
                          <span className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(req.type)}`}>
                            {req.type}
                          </span>
                        </div>
                      </div>
                      <div>
                        <Trash2 
                          onClick={() => deleteRequest(req.id)} 
                          className="text-gray-400 hover:text-red-400 cursor-pointer transition-colors" 
                          size={22}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                        <Globe className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />
                        <p className="text-sm text-gray-300 break-all">{req.url}</p>
                      </div>

                      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className='flex items-center justify-between mb-2'>
                          <p className="text-xs text-gray-400 font-medium">Response Preview</p>
                          <CopyButton text={req.response} />
                        </div>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
                          {req.response.length > 60 ? req.response.substring(0, 60) + '...' : req.response}
                        </pre>
                      </div>

                      <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-sm text-gray-400">Send to:</p>
                        <p className="text-sm text-gray-300 break-all flex-1">{subdomain}.ilusion.io/{req.url}</p>
                        <CopyButton text={'https://' + subdomain + '.ilusion.io/' + req.url} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-6 bg-white/10 backdrop-blur-lg rounded-full shadow-lg mb-4 border border-white/20">
                <Server className="text-gray-400" size={48} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No requests yet</h3>
              <p className="text-gray-400 mb-6">Get started by creating your first server request</p>
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
              >
                <CirclePlus size={20} />
                Add New Request
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full mx-auto border border-white/20">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <CirclePlus className="text-purple-300" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Create New Request
                  </h3>
                </div>
                <button
                  onClick={closePopup}
                  className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {error && (
                  <div className="mb-4 bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg flex items-start gap-2">
                    <span className="text-red-400 font-bold">!</span>
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                      Request Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., User Authentication API"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="url" className="block text-sm font-semibold text-gray-300 mb-2">
                      Request URL
                    </label>
                    <input
                      type="text"
                      id="url"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      placeholder="https://api.example.com/endpoint"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-semibold text-gray-300 mb-2">
                      Request Method
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="response" className="block text-sm font-semibold text-gray-300 mb-2">
                      Response (JSON)
                    </label>
                    <textarea
                      id="response"
                      name="response"
                      value={formData.response}
                      onChange={handleInputChange}
                      placeholder='{"key": "value", "status": "success"}'
                      rows={6}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Modal Footer */}
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
                      'Create Request'
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