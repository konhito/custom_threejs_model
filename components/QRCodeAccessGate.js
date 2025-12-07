'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle, XCircle, Lock, QrCode } from 'lucide-react';

// QR Code access token - this should match what's encoded in the QR code
// The QR code should link to: /contact-the-author?auth=author
const QR_AUTH_PARAM = 'author';

// Exclusive access code
const VALID_CODES = [
  '1NP&7' // Exclusive access code
];

const QRCodeAccessGate = ({ onAccessGranted, children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasAuthParam, setHasAuthParam] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  // Check for auth parameter in URL or session storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const authParam = urlParams.get('auth');
      
      // Check if user already has full access from session
      const hasFullAccess = sessionStorage.getItem('author_contact_access') === 'true';
      if (hasFullAccess) {
        setIsAuthenticated(true);
        return;
      }

      // Check if auth parameter is present
      if (authParam === QR_AUTH_PARAM) {
        setHasAuthParam(true);
        // Clean URL but keep auth for reference
        window.history.replaceState({}, '', '/contact-the-author?auth=author');
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only allow access code entry if auth parameter is present
    if (!hasAuthParam) {
      setError('Please scan the QR code from the business card first.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Check access code (case-sensitive for "1NP&7")
    const isValidCode = VALID_CODES.includes(accessCode);
    
    if (isValidCode) {
      setIsAuthenticated(true);
      sessionStorage.setItem('author_contact_access', 'true');
      onAccessGranted && onAccessGranted();
    } else {
      setAttempts(prev => prev + 1);
      setError(`Invalid access code. ${3 - attempts} attempts remaining.`);
      
      if (attempts >= 2) {
        setError('Access denied. This area is exclusively for QR code holders.');
        setAccessCode('');
      }
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('author_contact_access');
    setAccessCode('');
    setError('');
    setAttempts(0);
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen">
        {/* Access Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-4 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Access Granted</h2>
                  <p className="text-xs text-white/80">Contact the Author</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-200 text-xs font-medium"
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


  // Show access code form only if auth parameter is present
  if (!hasAuthParam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-800/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-800/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-lg w-full">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-800 border-2 border-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                <QrCode className="w-8 h-8 sm:w-10 sm:h-10 text-green-300" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">
                Contact the Author
              </h1>
              <p className="text-base sm:text-lg text-green-200 mb-2">
                Exclusive Access via QR Code
              </p>
              <p className="text-sm sm:text-base text-green-300">
                Scan the QR code from the business card to access this private section
              </p>
            </div>

            {/* Message */}
            <div className="bg-green-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-green-700 p-6 sm:p-8">
              <div className="bg-green-700/30 rounded-xl p-4 sm:p-6 border border-green-600">
                <div className="flex items-center justify-center space-x-2 text-green-200 mb-3">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base font-medium">Exclusive Access</span>
                </div>
                <p className="text-green-300 text-sm sm:text-base leading-relaxed text-center">
                  This area is exclusively accessible via QR code from the business card. 
                  Please scan the QR code to gain access.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-green-400 text-xs">
                International Association for the Defense of Flowers
              </p>
              <p className="text-green-500 text-xs mt-1">
                Proveneya & Nahiara
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show access code form if auth parameter is present
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-800/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-800/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-lg w-full">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-800 border-2 border-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
              <QrCode className="w-8 h-8 sm:w-10 sm:h-10 text-green-300" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">
              Contact the Author
            </h1>
            <p className="text-base sm:text-lg text-green-200 mb-2">
              QR Code Verified
            </p>
            <p className="text-sm sm:text-base text-green-300">
              Please enter your access code to continue
            </p>
          </div>

          {/* Access Form */}
          <div className="bg-green-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-green-700 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="accessCode" className="block text-sm font-semibold text-green-200 mb-2 sm:mb-3">
                  Access Code
                </label>
                <div className="relative">
                  <input
                    id="accessCode"
                    type={showPassword ? 'text' : 'password'}
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-green-700/50 border border-green-600 rounded-xl text-white placeholder-green-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-base sm:text-lg font-mono tracking-wider"
                    placeholder="Enter access code"
                    required
                    disabled={isLoading || attempts >= 3}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-300 transition-colors"
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
                className="w-full bg-green-700 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying Access...</span>
                  </div>
                ) : attempts >= 3 ? (
                  'Access Denied'
                ) : (
                  'Access Contact Area'
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-green-400 text-xs">
              International Association for the Defense of Flowers
            </p>
            <p className="text-green-500 text-xs mt-1">
              Proveneya & Nahiara
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeAccessGate;




















