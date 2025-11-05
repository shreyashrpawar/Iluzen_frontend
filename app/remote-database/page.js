'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { apiGet,apiPost } from '@/lib/api';
import { Database, Eye, Table, Lock, Unlock, AlertCircle, CheckCircle, Loader, ArrowRight, Server, Globe, Shield, Maximize2, X, RefreshCw } from 'lucide-react';

export default function RemoteDatabaseViewer() {
  const [connectionData, setConnectionData] = useState({
    host: '',
    port: '3306',
    username: '',
    password: '',
    database: ''
  });
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isRefreshingTables, setIsRefreshingTables] = useState(false);
  const [isRefreshingData, setIsRefreshingData] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConnectionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setError('');
    
    try {
      const response = await apiPost('/connect-remote-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(connectionData),
      });

      if (response.ok) {
        const result = await response.json();
        setTables(result.tables || []);
        setIsConnected(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to connect to database');
      }
    } catch (err) {
      setError('Connection failed. Please check your credentials and try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRefreshTables = async () => {
    setIsRefreshingTables(true);
    
    try {
      const response = await apiPost('/connect-remote-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(connectionData),
      });

      if (response.ok) {
        const result = await response.json();
        setTables(result.tables || []);
      }
    } catch (err) {
      console.error('Failed to refresh tables:', err);
    } finally {
      setIsRefreshingTables(false);
    }
  };

  const handleViewTable = async (tableName) => {
    setSelectedTable(tableName);
    setIsRefreshingData(true);
    
    try {
      const response = await apiPost('/get-remote-table-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...connectionData,
          table: tableName
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setTableData(result.data || []);
        setTableColumns(result.columns || []);
      }
    } catch (err) {
      console.error('Failed to fetch table data:', err);
    } finally {
      setIsRefreshingData(false);
    }
  };

  const handleRefreshData = async () => {
    if (!selectedTable) return;
    
    setIsRefreshingData(true);
    
    try {
      const response = await apiPost('/get-remote-table-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...connectionData,
          table: selectedTable
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setTableData(result.data || []);
        setTableColumns(result.columns || []);
      }
    } catch (err) {
      console.error('Failed to refresh table data:', err);
    } finally {
      setIsRefreshingData(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setTables([]);
    setSelectedTable(null);
    setTableData([]);
    setTableColumns([]);
    setConnectionData({
      host: '',
      port: '3306',
      username: '',
      password: '',
      database: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <span className="text-white text-xl font-bold">Ilusion</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-white/80 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/register" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* SEO Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Free MySQL Database Viewer & Explorer
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
            Connect to any remote MySQL database instantly. View tables, browse data, and explore your database structure without installing any software. Free online MySQL database browser.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-white/60">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm">Secure Connection</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="text-sm">No Installation Required</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Works with Any MySQL Server</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isConnected ? (
          /* Connection Form */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Database className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Connect to Your Database</h2>
                  <p className="text-white/60 text-sm">Enter your MySQL database credentials</p>
                </div>
              </div>

              {error && (
                <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Host *
                    </label>
                    <input
                      type="text"
                      name="host"
                      value={connectionData.host}
                      onChange={handleInputChange}
                      placeholder="e.g., localhost or 192.168.1.1"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Port *
                    </label>
                    <input
                      type="text"
                      name="port"
                      value={connectionData.port}
                      onChange={handleInputChange}
                      placeholder="3306"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={connectionData.username}
                    onChange={handleInputChange}
                    placeholder="Database username"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={connectionData.password}
                      onChange={handleInputChange}
                      placeholder="Database password"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Database Name *
                  </label>
                  <input
                    type="text"
                    name="database"
                    value={connectionData.database}
                    onChange={handleInputChange}
                    placeholder="Name of the database"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-300">
                    <strong>Privacy & Security:</strong> Your database credentials are used only for this session and are never stored on our servers. All connections are encrypted.
                  </div>
                </div>
              </div>

              <button
                onClick={handleConnect}
                disabled={isConnecting || !connectionData.host || !connectionData.username || !connectionData.password || !connectionData.database}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Database className="w-5 h-5" />
                    Connect to Database
                  </>
                )}
              </button>
            </div>

            {/* SEO Content */}
            <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">Why Use Our Online MySQL Database Viewer?</h2>
              <div className="grid md:grid-cols-2 gap-6 text-white/70">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">✓ No Installation Required</h3>
                  <p>Access your MySQL database directly from your browser. No need to install phpMyAdmin, MySQL Workbench, or any other software.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">✓ Works Anywhere</h3>
                  <p>Connect from any device - Windows, Mac, Linux, or even your mobile phone. All you need is a web browser.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">✓ Secure & Private</h3>
                  <p>Your credentials are never stored. All connections use encrypted protocols to ensure your data remains secure.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">✓ Free to Use</h3>
                  <p>View and explore your database tables completely free. No credit card required, no signup needed.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Database Explorer */
          <div>
            {/* Connection Status Bar */}
            <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-green-300 font-semibold">Connected to {connectionData.database}</p>
                  <p className="text-green-400/70 text-sm">{connectionData.host}:{connectionData.port}</p>
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors border border-red-400/30"
              >
                Disconnect
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Tables List */}
              <div className="lg:col-span-1">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Table className="w-5 h-5 text-purple-400" />
                      Tables ({tables.length})
                    </h3>
                    <button
                      onClick={handleRefreshTables}
                      disabled={isRefreshingTables}
                      className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors disabled:opacity-50"
                      title="Refresh tables"
                    >
                      <RefreshCw className={`w-4 h-4 text-purple-400 ${isRefreshingTables ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {tables.map((table, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleViewTable(table)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                          selectedTable === table
                            ? 'bg-purple-500/30 border border-purple-400/50 text-white'
                            : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Table className="w-4 h-4" />
                          <span className="font-medium">{table}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table Data */}
              <div className="lg:col-span-2">
                {selectedTable ? (
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Eye className="w-5 h-5 text-blue-400" />
                        {selectedTable}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 text-sm">{tableData.length} rows</span>
                        <button
                          onClick={handleRefreshData}
                          disabled={isRefreshingData}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors disabled:opacity-50"
                          title="Refresh data"
                        >
                          <RefreshCw className={`w-4 h-4 text-blue-400 ${isRefreshingData ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                          onClick={() => setIsMaximized(true)}
                          className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors"
                          title="Maximize view"
                        >
                          <Maximize2 className="w-4 h-4 text-purple-400" />
                        </button>
                      </div>
                    </div>

                    {isRefreshingData ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader className="w-8 h-8 text-purple-400 animate-spin" />
                      </div>
                    ) : tableData.length > 0 ? (
                      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                        <table className="w-full border-collapse">
                          <thead className="bg-slate-700/50 sticky top-0">
                            <tr>
                              {tableColumns.map((col, idx) => (
                                <th key={idx} className="px-4 py-3 text-left text-sm font-semibold text-gray-300 border-b border-white/10">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tableData.map((row, rowIdx) => (
                              <tr key={rowIdx} className="hover:bg-white/5 transition-colors border-b border-white/5">
                                {tableColumns.map((col, colIdx) => (
                                  <td key={colIdx} className="px-4 py-3 text-sm text-gray-300">
                                    {row[col] !== null ? String(row[col]) : <span className="text-gray-500 italic">NULL</span>}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-white/60">
                        <Table className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No data in this table</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 shadow-xl text-center">
                    <Eye className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                    <p className="text-white/60 text-lg">Select a table to view its data</p>
                  </div>
                )}
              </div>
            </div>

            {/* Maximized View Modal */}
            {isMaximized && selectedTable && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-slate-800 rounded-2xl shadow-2xl w-full h-full max-w-[95vw] max-h-[95vh] border border-white/20 flex flex-col">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-800 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                      <Eye className="w-6 h-6 text-blue-400" />
                      <div>
                        <h3 className="text-2xl font-bold text-white">{selectedTable}</h3>
                        <p className="text-sm text-white/60">{tableData.length} rows</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRefreshData}
                        disabled={isRefreshingData}
                        className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors disabled:opacity-50"
                        title="Refresh data"
                      >
                        <RefreshCw className={`w-5 h-5 text-blue-400 ${isRefreshingData ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        onClick={() => setIsMaximized(false)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                        title="Close"
                      >
                        <X className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>

                  {/* Modal Body */}
                  <div className="flex-1 overflow-auto p-6">
                    {isRefreshingData ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader className="w-12 h-12 text-purple-400 animate-spin" />
                      </div>
                    ) : tableData.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead className="bg-slate-700/50 sticky top-0">
                            <tr>
                              {tableColumns.map((col, idx) => (
                                <th key={idx} className="px-6 py-4 text-left text-sm font-semibold text-gray-300 border-b border-white/10">
                                  <div className="flex flex-col">
                                    <span>{col}</span>
                                    {/* <span className="text-xs text-gray-500 font-normal">{col.type}</span> */}
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tableData.map((row, rowIdx) => (
                              <tr key={rowIdx} className="hover:bg-white/5 transition-colors border-b border-white/5">
                                {tableColumns.map((col, colIdx) => (
                                  <td key={colIdx} className="px-6 py-4 text-sm text-gray-300">
                                    {row[col] !== null ? String(row[col]) : <span className="text-gray-500 italic">NULL</span>}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-white/60">
                        <Table className="w-20 h-20 mb-4 opacity-50" />
                        <p className="text-lg">No data in this table</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CTA Section */}
            <div className="mt-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Need More Features?</h3>
              <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                Create an account to get virtual databases, mock APIs, data management tools, and more advanced features for your development workflow.
              </p>
              <Link href="/register">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg inline-flex items-center gap-2">
                  Sign Up Free
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* SEO Footer Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Free MySQL Database Browser & Viewer Tool</h2>
            <p className="text-white/70 max-w-3xl mx-auto">
              Access and explore your MySQL databases online without downloading any software. Our web-based MySQL client allows you to connect to remote databases, view table structures, browse data, and more - all from your browser.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 text-white/70">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Keywords</h3>
              <p className="text-sm">MySQL viewer, database browser, online MySQL client, phpMyAdmin alternative, MySQL explorer, remote database viewer, web-based MySQL tool</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Use Cases</h3>
              <p className="text-sm">Database administration, quick data inspection, remote database management, development testing, database debugging, SQL query testing</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Compatible With</h3>
              <p className="text-sm">MySQL, MariaDB, Percona Server, Amazon RDS, Google Cloud SQL, Azure Database for MySQL, and other MySQL-compatible databases</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}