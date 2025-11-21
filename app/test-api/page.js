'use client';

import { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Server, 
  Database, 
  Zap,
  ShoppingCart,
  Users,
  Package
} from 'lucide-react';

const API_URL = 'https://backend.aquamundi.org';

export default function APITestPage() {
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [testingEndpoint, setTestingEndpoint] = useState(null);

  const updateResult = (testName, status, data, error = null) => {
    setResults(prev => ({
      ...prev,
      [testName]: { status, data, error, timestamp: new Date().toISOString() }
    }));
  };

  const testEndpoint = async (testName, url, options = {}) => {
    setTestingEndpoint(testName);
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        updateResult(testName, 'success', data);
      } else {
        updateResult(testName, 'error', data, data.error?.message || 'Request failed');
      }
      
      return { success: response.ok, data };
    } catch (error) {
      updateResult(testName, 'error', null, error.message);
      return { success: false, error: error.message };
    } finally {
      setTestingEndpoint(null);
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    setResults({});

    // Test 1: Backend Health
    await testEndpoint('health', `${API_URL}/health`);
    
    // Test 2: API Root
    await testEndpoint('root', `${API_URL}/`);
    
    // Test 3: Products API (tests PostgreSQL)
    await testEndpoint('products', `${API_URL}/api/products`);
    
    // Test 4: Create Session (tests PostgreSQL + Redis)
    await testEndpoint('session-create', `${API_URL}/api/sessions/current`, {
      credentials: 'include',
    });
    
    // Test 5: Get Session (tests Redis cache)
    await testEndpoint('session-get', `${API_URL}/api/sessions/current`, {
      credentials: 'include',
    });
    
    // Test 6: Test Redis Caching (get products again)
    await testEndpoint('products-cached', `${API_URL}/api/products`);
    
    // Test 7: Admin Login (tests JWT)
    await testEndpoint('admin-ping', `${API_URL}/api/admin/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin',
        password: 'admin'
      }),
    });

    setIsLoading(false);
  };

  const getStatusIcon = (status) => {
    if (status === 'success') return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === 'error') return <XCircle className="w-5 h-5 text-red-600" />;
    return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
  };

  const getStatusColor = (status) => {
    if (status === 'success') return 'border-green-200 bg-green-50';
    if (status === 'error') return 'border-red-200 bg-red-50';
    return 'border-blue-200 bg-blue-50';
  };

  const tests = [
    {
      id: 'health',
      name: 'Backend Health Check',
      icon: Server,
      description: 'Verify backend is running',
    },
    {
      id: 'root',
      name: 'API Root',
      icon: Server,
      description: 'Check API version',
    },
    {
      id: 'products',
      name: 'Products API (PostgreSQL)',
      icon: Package,
      description: 'Test database connection',
    },
    {
      id: 'session-create',
      name: 'Create Session (PostgreSQL + Redis)',
      icon: Users,
      description: 'Test session creation',
    },
    {
      id: 'session-get',
      name: 'Get Session (Redis Cache)',
      icon: Zap,
      description: 'Test Redis caching',
    },
    {
      id: 'products-cached',
      name: 'Products Cached (Redis)',
      icon: Zap,
      description: 'Verify cache hit',
    },
    {
      id: 'admin-ping',
      name: 'Admin Endpoint Test',
      icon: ShoppingCart,
      description: 'Test authentication endpoint',
    },
  ];

  const successCount = Object.values(results).filter(r => r.status === 'success').length;
  const errorCount = Object.values(results).filter(r => r.status === 'error').length;
  const totalTests = Object.keys(results).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🧪 Backend API Test Suite
          </h1>
          <p className="text-gray-600 text-lg">
            Testing: <code className="bg-gray-100 px-2 py-1 rounded text-sm">https://backend.aquamundi.org</code>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            EC2 Instance • PostgreSQL • Redis • Node.js
          </p>
        </div>

        {/* Stats */}
        {totalTests > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="text-3xl font-bold text-gray-900">{totalTests}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-green-200">
              <div className="text-3xl font-bold text-green-600">{successCount}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-red-200">
              <div className="text-3xl font-bold text-red-600">{errorCount}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </div>
        )}

        {/* Run Tests Button */}
        <div className="mb-6">
          <button
            onClick={runAllTests}
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Server className="w-5 h-5 mr-2" />
                Run All Tests
              </>
            )}
          </button>
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          {tests.map((test) => {
            const result = results[test.id];
            const Icon = test.icon;
            const isTesting = testingEndpoint === test.id;

            return (
              <div
                key={test.id}
                className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
                  result ? getStatusColor(result.status) : 'border-gray-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${
                        result?.status === 'success' ? 'bg-green-100' :
                        result?.status === 'error' ? 'bg-red-100' :
                        'bg-gray-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          result?.status === 'success' ? 'text-green-600' :
                          result?.status === 'error' ? 'text-red-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {test.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {test.description}
                        </p>

                        {result && (
                          <div className="space-y-2">
                            {result.error && (
                              <div className="bg-red-50 border border-red-200 rounded p-3">
                                <p className="text-sm text-red-800">
                                  <strong>Error:</strong> {result.error}
                                </p>
                              </div>
                            )}

                            {result.data && (
                              <details className="bg-gray-50 border border-gray-200 rounded">
                                <summary className="cursor-pointer p-3 text-sm font-medium text-gray-700 hover:bg-gray-100">
                                  View Response Data
                                </summary>
                                <div className="p-3 border-t border-gray-200">
                                  <pre className="text-xs overflow-x-auto">
                                    {JSON.stringify(result.data, null, 2)}
                                  </pre>
                                </div>
                              </details>
                            )}

                            <p className="text-xs text-gray-500">
                              Tested at: {new Date(result.timestamp).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      {isTesting ? (
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                      ) : result ? (
                        getStatusIcon(result.status)
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* System Info */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">Backend Server</span>
              </div>
              <p className="text-gray-600">EC2 Instance</p>
              <p className="text-xs text-gray-500">Node.js + Express</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="font-medium">PostgreSQL</span>
              </div>
              <p className="text-gray-600">Local on EC2</p>
              <p className="text-xs text-gray-500">Port 5432</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-red-600" />
                <span className="font-medium">Redis</span>
              </div>
              <p className="text-gray-600">Local on EC2</p>
              <p className="text-xs text-gray-500">Port 6379</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Quick Links:</p>
          <div className="flex justify-center gap-4 mt-2">
            <a 
              href="https://backend.aquamundi.org/health" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              Health Check
            </a>
            <span>•</span>
            <a 
              href="https://backend.aquamundi.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              API Root
            </a>
            <span>•</span>
            <a 
              href="https://backend.aquamundi.org/api/products" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              Products API
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

