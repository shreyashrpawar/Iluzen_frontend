'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiGet, apiPost } from '@/lib/api';
import ProtectedRoute from '@/components/protected-route';
import Navbar from '@/app/components/Navbar';
import { CirclePlus, X, Server, Globe, Trash2 } from 'lucide-react';
import CopyButton from '@/app/components/CopyButton';
import toast, { Toaster } from 'react-hot-toast';

export default function Page() {
  const { subdomain } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
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
        toast.success('Server created successfully!');
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
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50"><Navbar />
        {/* Header Section */}
        <div className="bg-white/60 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Server Requests</h1>
                <p className="text-slate-600">Manage and monitor your API endpoints</p>
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
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 group hover:border-purple-400"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                          <Server className="text-purple-600" size={24} />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">{req.name}</h2>
                          <span className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(req.type)}`}>
                            {req.type}
                          </span>
                        </div>
                      </div>
                      <div>
                        <Trash2 
                          onClick={() => deleteRequest(req.id)} 
                          className="text-slate-400 hover:text-red-600 cursor-pointer transition-colors" 
                          size={22}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <Globe className="text-slate-500 mt-0.5 flex-shrink-0" size={16} />
                        <p className="text-sm text-slate-700 break-all">{req.url}</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className='flex items-center justify-between mb-2'>
                          <p className="text-xs text-slate-600 font-medium">Response Preview</p>
                          <CopyButton text={req.response} />
                        </div>
                        <pre className="text-xs text-slate-700 font-mono overflow-x-auto">
                          {req.response.length > 60 ? req.response.substring(0, 60) + '...' : req.response}
                        </pre>
                      </div>

                      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-600">Send to:</p>
                        <p className="text-sm text-slate-700 break-all flex-1">{subdomain}.ilusion.io/{req.url}</p>
                        <CopyButton text={'https://' + subdomain + '.ilusion.io/' + req.url} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-full shadow-md mb-4 border border-purple-200">
                <Server className="text-slate-600" size={48} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No requests yet</h3>
              <p className="text-slate-600 mb-6">Get started by creating your first server request</p>
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <CirclePlus size={20} />
                Add New Request
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-auto border border-slate-200">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CirclePlus className="text-purple-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Create New Request
                  </h3>
                </div>
                <button
                  onClick={closePopup}
                  className="text-slate-500 hover:text-slate-900 transition-colors p-1 hover:bg-slate-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-2">
                    <span className="text-red-600 font-bold">!</span>
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
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                      placeholder="/api/users"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Modal Footer */}
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