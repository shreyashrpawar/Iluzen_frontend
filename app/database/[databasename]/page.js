'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiGet, apiPost } from '@/lib/api';
import ProtectedRoute from '@/components/protected-route';
import Navbar from '@/app/components/Navbar';
import { Plus, Table, Trash2, Database, Columns3, Key, X } from 'lucide-react';

export default function DatabasePage() {
  const { databasename } = useParams();
  const router = useRouter();
  const [database, setDatabase] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    engine: 'InnoDB',
    collation: 'utf8mb4_general_ci'
  });

  async function fetchData() {
    try {
      const response = await apiGet('/get_databases/' + databasename);

      if (response && response.ok) {
        const result = await response.json();
        console.log('Database fetched successfully:', result);
        setDatabase(result);
      } else {
        console.log('Database not found');
        router.push('/not-found');
      }
    } catch (err) {
      console.log('Database not found');
      router.push('/not-found');
    }
  }

  useEffect(() => {
    fetchData();
  }, [databasename]);

  const handleCreateNew = () => {
    setIsPopupOpen(true);
    setError('');
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setFormData({
      name: '',
      description: '',
      engine: 'InnoDB',
      collation: 'utf8mb4_general_ci'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await apiPost(`/get_database/${databasename}`, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        engine: formData.engine,
        collation: formData.collation,
      });

      if (response && response.ok) {
        const result = await response.json();
        console.log('Table created successfully:', result);
        closePopup();
        alert('Table created successfully!');
        fetchData();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create table');
      }
    } catch (err) {
      console.error('Error creating table:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this table? This action cannot be undone.')) {
      try {
        const response = await apiPost(`/delete_table/${databasename}`, {
          id: id,
        });

        if (response && response.ok) {
          console.log('Table deleted successfully');
          fetchData();
        } else {
          const errorData = await response.json();
          console.log(errorData.message || 'Failed to delete table');
        }
      } catch (err) {
        console.log('Error deleting table:', err);
      }
    }
  };

  if (!database) return <p>Loading...</p>;

  const tables = database.tables || [];

  return (
    <ProtectedRoute>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header Section */}
        <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-lg"><Navbar />
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Database className="text-purple-400" size={32} />
                  <h1 className="text-3xl font-bold text-white">{databasename}</h1>
                </div>
                <p className="text-gray-300">Manage your database tables and structure</p>
              </div>
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
              >
                <Plus size={20} />
                Create New Table
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Table className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-gray-300 text-sm font-medium">Total Tables</span>
              </div>
              <div className="text-3xl font-bold text-white">{tables.length}</div>
            </div>
          
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Columns3 className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-gray-300 text-sm font-medium">Total Columns</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {tables.reduce((sum, t) => sum + (t.columns || 0), 0)}
              </div>
            </div>
          
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Key className="w-5 h-5 text-yellow-400" />
                </div>
                <span className="text-gray-300 text-sm font-medium">Total Rows</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {tables.reduce((sum, t) => sum + (t.rows || 0), 0).toLocaleString()}
              </div>
            </div>
          
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Database className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-gray-300 text-sm font-medium">Total Size</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {tables.reduce((sum, t) => sum + parseFloat(t.size || 0), 0).toFixed(2)} KB
              </div>
            </div>
          </div>

          {/* Tables List */}
          {tables.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/20 group hover:border-purple-400/50"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                          <Table className="text-purple-300" size={24} />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-white">{table.name}</h2>
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300">
                            {table.engine}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(table.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  
                    <div className="space-y-3">
                      {table.description && (
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-sm text-gray-300">{table.description}</p>
                        </div>
                      )}
                    
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-xs text-gray-400 mb-1 font-medium">Columns</p>
                          <p className="text-lg font-semibold text-white">{table.columns || 0}</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-xs text-gray-400 mb-1 font-medium">Rows</p>
                          <p className="text-lg font-semibold text-white">{(table.rows || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-xs text-gray-400 mb-1 font-medium">Details</p>
                        <div className="text-xs text-gray-300 space-y-1">
                          <p>Collation: {table.collation}</p>
                          <p>Size: {table.size || '0 KB'}</p>
                          <p>Created: {table.createdAt ? new Date(table.createdAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-6 bg-white/10 backdrop-blur-lg rounded-full shadow-lg mb-4 border border-white/20">
                <Table className="text-gray-400" size={48} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No tables yet</h3>
              <p className="text-gray-400 mb-6">Get started by creating your first database table</p>
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
              >
                <Plus size={20} />
                Create New Table
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
                    <Plus className="text-purple-300" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Create New Table
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
                      Table Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., users, posts, orders"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-300 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Brief description of the table"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="engine" className="block text-sm font-semibold text-gray-300 mb-2">
                      Storage Engine
                    </label>
                    <select
                      id="engine"
                      name="engine"
                      value={formData.engine}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="InnoDB">InnoDB (Recommended)</option>
                      <option value="MyISAM">MyISAM</option>
                      <option value="MEMORY">MEMORY</option>
                      <option value="ARCHIVE">ARCHIVE</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="collation" className="block text-sm font-semibold text-gray-300 mb-2">
                      Collation
                    </label>
                    <select
                      id="collation"
                      name="collation"
                      value={formData.collation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="utf8mb4_general_ci">utf8mb4_general_ci</option>
                      <option value="utf8mb4_unicode_ci">utf8mb4_unicode_ci</option>
                      <option value="utf8_general_ci">utf8_general_ci</option>
                      <option value="latin1_swedish_ci">latin1_swedish_ci</option>
                    </select>
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
                      'Create Table'
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