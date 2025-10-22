'use client';

import { useState } from 'react';
import { Clock, Shield, Sparkles, CheckCircle, X } from 'lucide-react';

const ComingSoonModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Enhanced Coming Soon Button */}
      <button
        onClick={handleOpenModal}
        className="group inline-flex items-center px-6 sm:px-10 py-3 sm:py-5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-300/50 text-sm sm:text-lg"
        aria-label="Open Coming Soon information"
      >
        <Clock className="w-4 h-4 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:rotate-12 transition-transform duration-300" />
        <span>Coming Soon</span>
        <Sparkles className="w-3 h-3 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:animate-pulse" />
      </button>

      {/* Enhanced Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Enhanced Background overlay */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={handleCloseModal}
              aria-hidden="true"
            ></div>

            {/* Enhanced Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-2xl sm:rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full mx-4">
              {/* Header */}
              <div className="bg-slate-700 px-4 sm:px-8 py-4 sm:py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center">
                      <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-2xl font-bold text-white">Coming Soon</h3>
                      <p className="text-slate-200 text-xs sm:text-sm">Professional materials under development</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  >
                    <X className="w-3 h-3 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="bg-white px-4 sm:px-8 py-6 sm:py-8">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-slate-600" />
                  </div>
                  
                  <p className="text-gray-700 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-lg">
                    This area is under secure development. We're implementing advanced authentication and security measures to ensure the highest level of protection for our professional materials.
                  </p>
                  
                  <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-slate-200">
                    <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg flex items-center justify-center space-x-2">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                      <span>What to expect:</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="flex items-center space-x-2 sm:space-x-3 text-left">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-700 text-xs sm:text-sm">Secure invitation-based access</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3 text-left">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-700 text-xs sm:text-sm">Sample chapters and editorial materials</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3 text-left">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-700 text-xs sm:text-sm">Market analysis and industry insights</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3 text-left">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-700 text-xs sm:text-sm">Official media kit and promotional assets</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4">
                    <p className="text-amber-800 text-xs sm:text-sm">
                      <strong>For immediate access inquiries:</strong> Please contact our team directly at{' '}
                      <a href="mailto:professionals@aquamundi.org" className="text-blue-600 hover:underline font-medium break-all">
                        professionals@aquamundi.org
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="bg-slate-50 px-4 sm:px-8 py-4 sm:py-6 flex justify-center">
                <button
                  onClick={handleCloseModal}
                  className="inline-flex items-center px-6 sm:px-8 py-2 sm:py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all duration-200 text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ComingSoonModal;
