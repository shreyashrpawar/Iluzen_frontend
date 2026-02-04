'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiGet, apiPost } from '@/lib/api';
import ProtectedRoute from '@/components/protected-route';
import Navbar from '@/app/components/Navbar';
import { Plus, Table, Trash2, Database, Columns3, Key, X, Edit, Eye } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';


export default function DatabasePage() {
  const { databasename } = useParams();
  const router = useRouter();
  const [database, setDatabase] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDataPopupOpen, setIsDataPopupOpen] = useState(false);
  const [isViewDataPopupOpen, setIsViewDataPopupOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableColumns, setTableColumns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    columns: []
  });
  const [rowData, setRowData] = useState({});

  async function fetchData() {
    try {
      const response = await apiGet('/get_database/' + databasename);

      if (response && response.ok) {
        const result = await response.json();
        console.log('Database fetched successfully:', result);
        setDatabase(result.tables);
      } else {
        console.log('Database not found');
        router.push('/not-found');
      }
    } catch (err) {
      console.log('Database not found');
      router.push('/not-found');
    }
  }

  async function fetchTableColumns(tableName) {
    try {
      const response = await apiGet(`/get_table_columns/${databasename}/${tableName}`);
      if (response && response.ok) {
        const result = await response.json();
        setTableColumns(result.columns || []);
        const initialData = {};
        result.columns.forEach(col => {
          if (col.name !== 'id' && col.extra !== 'auto_increment') {
            initialData[col.name] = '';
          }
        });
        setRowData(initialData);
      }
    } catch (err) {
      console.error('Error fetching table columns:', err);
    }
  }

  async function fetchTableData(tableName) {
    try {
      const response = await apiGet(`/get_table_data/${databasename}/${tableName}`);
      if (response && response.ok) {
        const result = await response.json();
        setTableData(result.data || []);
        setTableColumns(result.columns || []);
      }
    } catch (err) {
      console.error('Error fetching table data:', err);
    }
  }

  useEffect(() => {
    fetchData();
  }, [databasename]);

  const handleCreateNew = () => {
    setIsPopupOpen(true);
    setError('');
  };

  const handleAddData = async (tableName) => {
    setSelectedTable(tableName);
    await fetchTableColumns(tableName);
    setIsDataPopupOpen(true);
    setError('');
  };

  const handleViewData = async (tableName) => {
    setSelectedTable(tableName);
    await fetchTableData(tableName);
    setIsViewDataPopupOpen(true);
    setError('');
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setFormData({
      name: '',
      description: '',
      columns: []
    });
    setError('');
  };

  const closeDataPopup = () => {
    setIsDataPopupOpen(false);
    setSelectedTable(null);
    setTableColumns([]);
    setRowData({});
    setError('');
  };

  const closeViewDataPopup = () => {
    setIsViewDataPopupOpen(false);
    setSelectedTable(null);
    setTableData([]);
    setTableColumns([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRowDataChange = (columnName, value) => {
    setRowData(prev => ({
      ...prev,
      [columnName]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await apiPost(`/create_table/${databasename}`, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        columns: formData.columns
      });

      if (response && response.ok) {
        const result = await response.json();
        console.log('Table created successfully:', result);
        closePopup();
        toast.success('Table created successfully!');
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

  const handleDataSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await apiPost(`/insert_data/${databasename}/${selectedTable}`, {
        data: rowData
      });

      if (response && response.ok) {
        const result = await response.json();
        console.log('Data inserted successfully:', result);
        closeDataPopup();
        toast.success('Data inserted successfully!');
        fetchData();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to insert data');
      }
    } catch (err) {
      console.error('Error inserting data:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRow = async (id) => {
    if (confirm('Are you sure you want to delete this row?')) {
      try {
        const response = await apiPost(`/delete_data/${databasename}/${selectedTable}`, {
          id: id
        });

        if (response && response.ok) {
          toast.success('Row deleted successfully!');
          await fetchTableData(selectedTable);
        } else {
          const errorData = await response.json();
          toast(errorData.message || 'Failed to delete row');
        }
      } catch (err) {
        console.error('Error deleting row:', err);
        toast('Network error. Please try again.');
      }
    }
  };

  const handleDelete = async (tableName) => {
    if (confirm('Are you sure you want to delete this table? This action cannot be undone.')) {
      try {
        const response = await apiPost(`/delete_table/${databasename}`, {
          name: tableName,
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

  const addColumn = () => {
    setFormData({
      ...formData,
      columns: [...formData.columns, { name: '', type: '', length: '', nullable: false, primary: false }]
    });
  };

  const removeColumn = (index) => {
    const newCols = [...formData.columns];
    newCols.splice(index, 1);
    setFormData({ ...formData, columns: newCols });
  };

  const handleColumnChange = (index, field, value) => {
    const newCols = [...formData.columns];
    newCols[index][field] = value;
    setFormData({ ...formData, columns: newCols });
  };

  if (!database) return <p>Loading...</p>;

  const tables = database || [];

  return (
    <ProtectedRoute>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <Navbar />
        {/* Header Section */}
        <div className="bg-white/60 backdrop-blur-md border-b border-slate-200 shadow-sm">

          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Database className="text-purple-600" size={32} />
                  <h1 className="text-3xl font-bold text-slate-900">{databasename}</h1>
                </div>
                <p className="text-slate-600">Manage your database tables and structure</p>
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
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Table className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-slate-600 text-sm font-medium">Total Tables</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">{tables.length}</div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Columns3 className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-slate-600 text-sm font-medium">Total Columns</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {tables.reduce((sum, t) => sum + (t.columns || 0), 0)}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Key className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="text-slate-600 text-sm font-medium">Total Rows</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {tables.reduce((sum, t) => sum + (t.rows || 0), 0).toLocaleString()}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Database className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-slate-600 text-sm font-medium">Total Size</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {tables.reduce((sum, t) => sum + parseFloat(t.size || 0), 0).toFixed(2)} KB
              </div>
            </div>
          </div>

          {/* Tables List */}
          {tables.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tables.map((table) => (
                <div
                  key={table}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 group hover:border-purple-400"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                          <Table className="text-purple-600" size={24} />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">{table}</h2>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(table)}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddData(table)}
                          className="flex-1 flex items-center justify-center gap-2 p-3 bg-green-100 hover:bg-green-200 rounded-lg border border-green-200 transition-colors"
                        >
                          <Plus className="text-green-700" size={16} />
                          <span className="text-sm text-green-700 font-medium">Add Data</span>
                        </button>
                        <button
                          onClick={() => handleViewData(table)}
                          className="flex-1 flex items-center justify-center gap-2 p-3 bg-blue-100 hover:bg-blue-200 rounded-lg border border-blue-200 transition-colors"
                        >
                          <Eye className="text-blue-700" size={16} />
                          <span className="text-sm text-blue-700 font-medium">View Data</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-full shadow-md mb-4 border border-purple-200">
                <Table className="text-slate-600" size={48} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No tables yet</h3>
              <p className="text-slate-600 mb-6">Get started by creating your first database table</p>
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

        {/* Create Table Modal */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-auto border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Plus className="text-purple-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Create New Table
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
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
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
                    <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
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
                </div>

                <div className="mt-6">
                  <h4 className="text-md font-semibold text-slate-700 mb-3">Table Columns</h4>

                  {formData.columns.map((col, index) => (
                    <div key={index} className="grid grid-cols-6 gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Column name"
                        value={col.name}
                        onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
                        className="col-span-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400"
                      />
                      <select
                        value={col.type}
                        onChange={(e) => handleColumnChange(index, 'type', e.target.value)}
                        className="w-full col-span-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      >
                        <option value="">Type</option>
                        <option value="INT">INT</option>
                        <option value="VARCHAR">VARCHAR</option>
                        <option value="TEXT">TEXT</option>
                        <option value="DATE">DATE</option>
                        <option value="TIMESTAMP">TIMESTAMP</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Length"
                        value={col.length || ''}
                        onChange={(e) => handleColumnChange(index, 'length', e.target.value)}
                        className="col-span-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                      <label className="flex items-center gap-1 text-slate-700 text-xs">
                        <input
                          type="checkbox"
                          checked={col.primary || false}
                          onChange={(e) => handleColumnChange(index, 'primary', e.target.checked)}
                        />
                        PK
                      </label>
                      <button
                        onClick={() => removeColumn(index)}
                        className="text-red-400 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addColumn}
                    className="mt-2 px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                  >
                    + Add Column
                  </button>
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
                      'Create Table'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Data Modal */}
        {isDataPopupOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-auto border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Plus className="text-green-700" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Add Data to {selectedTable}
                  </h3>
                </div>
                <button
                  onClick={closeDataPopup}
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

                <div className="space-y-4">
                  {tableColumns.filter(col => col.name !== 'id' && col.extra !== 'auto_increment').map((column) => (
                    <div key={column.name}>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {column.name}
                        <span className="text-xs text-slate-500 ml-2">({column.type})</span>
                      </label>
                      <input
                        type="text"
                        value={rowData[column.name] || ''}
                        onChange={(e) => handleRowDataChange(column.name, e.target.value)}
                        placeholder={`Enter ${column.name}`}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeDataPopup}
                    className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDataSubmit}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Inserting...
                      </div>
                    ) : (
                      'Insert Data'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Data Modal */}
        {isViewDataPopupOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-xl max-w-6xl w-full mx-auto border border-slate-200 max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="text-blue-700" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {selectedTable} Data
                    </h3>
                    <p className="text-sm text-slate-600">{tableData.length} rows</p>
                  </div>
                </div>
                <button
                  onClick={closeViewDataPopup}
                  className="text-slate-500 hover:text-slate-900 transition-colors p-1 hover:bg-slate-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-6">
                {tableData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead className="sticky top-0 bg-slate-50 backdrop-blur-sm">
                        <tr>
                          {tableColumns.map((col) => (
                            <th key={col.name} className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b border-slate-200">
                              {col.name}
                            </th>
                          ))}
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b border-slate-200">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((row, index) => (
                          <tr key={index} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                            {tableColumns.map((col) => (
                              <td key={col.name} className="px-4 py-3 text-sm text-slate-700">
                                {row[col.name] !== null ? String(row[col.name]) : <span className="text-slate-400 italic">NULL</span>}
                              </td>
                            ))}
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleDeleteRow(row.id)}
                                className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                                title="Delete row"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="p-4 bg-slate-100 rounded-full mb-4">
                      <Database className="text-slate-500" size={40} />
                    </div>
                    <p className="text-slate-600 text-lg">No data in this table</p>
                    <p className="text-slate-500 text-sm mt-2">Add some data to get started</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-white flex justify-between items-center">
                <button
                  onClick={() => {
                    closeViewDataPopup();
                    handleAddData(selectedTable);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                >
                  <Plus size={16} />
                  Add New Row
                </button>
                <button
                  onClick={closeViewDataPopup}
                  className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}