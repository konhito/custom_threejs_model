'use client';

import { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, CheckCircle, XCircle, Lock, Sparkles, Users, BookOpen, Globe } from 'lucide-react';

// Valid access codes - in production, these would be stored securely on the server
const VALID_CODES = [
  '5X3JR'
];

const AccessGate = ({ onAccessGranted, children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  // Check if user already has access
  useEffect(() => {
    const hasAccess = sessionStorage.getItem('professionals_access') === 'true';
    if (hasAccess) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const isValidCode = VALID_CODES.includes(accessCode.toUpperCase());
    
    if (isValidCode) {
      setIsAuthenticated(true);
      sessionStorage.setItem('professionals_access', 'true');
      onAccessGranted && onAccessGranted();
    } else {
      setAttempts(prev => prev + 1);
      setError(`Invalid access code. ${3 - attempts} attempts remaining.`);
      
      if (attempts >= 2) {
        setError('Access denied. Please contact our team for assistance.');
        setAccessCode('');
      }
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('professionals_access');
    setAccessCode('');
    setError('');
    setAttempts(0);
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen">
        {/* Enhanced Access Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white py-6 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Professional Access Granted</h2>
                  <p className="text-sm text-white/80">Welcome to The Universe of Nahiara & AquaMundi</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-200 text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
        
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-700/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-slate-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-lg w-full">
          {/* Professional Logo/Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-800 border-2 border-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">
              Professional Access
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mb-2">
              The Universe of Nahiara & AquaMundi
            </p>
            <p className="text-sm sm:text-base text-slate-400">
              Enter your invitation code to access exclusive materials
            </p>
          </div>

          {/* Professional Access Form */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="accessCode" className="block text-sm font-semibold text-slate-200 mb-2 sm:mb-3">
                  Access Code
                </label>
                <div className="relative">
                  <input
                    id="accessCode"
                    type={showPassword ? 'text' : 'password'}
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 text-base sm:text-lg font-mono tracking-wider"
                    placeholder="Enter your invitation code"
                    required
                    disabled={isLoading || attempts >= 3}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    disabled={isLoading || attempts >= 3}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-3 text-red-300 bg-red-900/30 border border-red-800 p-3 rounded-lg">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || attempts >= 3 || !accessCode.trim()}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying Access...</span>
                  </div>
                ) : attempts >= 3 ? (
                  'Access Denied'
                ) : (
                  'Access Professional Area'
                )}
              </button>
            </form>

            {/* Professional Help Section */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-700">
              <div className="text-center">
                <p className="text-slate-300 mb-3 text-xs sm:text-sm">
                  Don&apos;t have an access code?
                </p>
                <div className="bg-slate-700/30 rounded-xl p-3 sm:p-4 border border-slate-600">
                  <div className="flex items-center justify-center space-x-2 text-slate-200 mb-2">
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">Contact Our Team</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Please contact our team at{' '}
                    <a href="mailto:professionals@aquamundi.org" className="text-slate-300 hover:text-white underline break-all">
                      professionals@aquamundi.org
                    </a>{' '}
                    to request access.
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* Professional Brand Footer */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-slate-400 text-xs">
              International Association for the Defense of Flowers
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Proveneya & Nahiara
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessGate;
