import { Metadata } from 'next';
import ComingSoonModal from '@/components/ComingSoonModal';
import AccessGate from '@/components/AccessGate';
//code 5X3JR
export const metadata = {
  title: 'Professional Access Area',
  description: 'Exclusive access for publishers, literary agents, and industry professionals to The Universe of Nahiara & AquaMundi editorial materials.',
  keywords: 'publishers, literary agents, professional access, Nahiara, AquaMundi, editorial materials, media kit',
  robots: 'noindex, nofollow', // Keep private until ready
  openGraph: {
    title: 'Professional Access Area - AquaMundi',
    description: 'Exclusive access for industry professionals',
    type: 'website',
    url: 'https://aquamundi.org/professionals',
  },
};

const ProfessionalsPage = () => {
  return (
    <AccessGate>
      <div className="min-h-screen bg-slate-50 relative">
        {/* Professional Header Section */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-700 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium mb-6 sm:mb-8">
                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                <span>Professional Access Portal</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-slate-900 mb-4 sm:mb-6">
                Professional Access Area
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
                Exclusive access for publishers, literary agents, and industry professionals to 
                <span className="font-semibold text-slate-800"> The Universe of Nahiara & AquaMundi</span>
              </p>

              {/* Status Badge */}
              <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-700 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium">
                <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                <span>Secure Access Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8 md:p-12">
            {/* Professional Content Block */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-slate-50 rounded-xl p-6 sm:p-8 border-l-4 border-slate-400 mb-8 sm:mb-12">
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Exclusive Editorial Materials</h3>
                    <p className="text-slate-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                      This area will soon provide access to official editorial materials from The Universe of Nahiara & AquaMundi, including sample chapters, market analysis, and the media kit.
                    </p>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                      Access will be available through unique invitation codes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Features Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
                <div className="text-center p-4 sm:p-6 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition-shadow duration-200">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Sample Chapters</h3>
                  <p className="text-slate-600 text-xs sm:text-sm">Exclusive preview content and early access to literary materials</p>
                </div>

                <div className="text-center p-4 sm:p-6 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition-shadow duration-200">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Market Analysis</h3>
                  <p className="text-slate-600 text-xs sm:text-sm">Comprehensive industry insights and market research data</p>
                </div>

                <div className="text-center p-4 sm:p-6 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition-shadow duration-200 sm:col-span-2 lg:col-span-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Media Kit</h3>
                  <p className="text-slate-600 text-xs sm:text-sm">Official promotional materials and brand assets</p>
                </div>
              </div>

              {/* Professional Coming Soon Button */}
              <div className="text-center mb-8 sm:mb-12">
                <ComingSoonModal />
              </div>
            </div>
          </div>

          {/* Professional Security Notice */}
          <div className="mt-6 sm:mt-8 bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-800 mb-2">Secure Development in Progress</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  This area is currently under secure development with advanced authentication and security measures being implemented. 
                  We're ensuring the highest level of protection for our professional materials.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Footer Note */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <div className="text-center">
            <div className="bg-slate-100 rounded-xl p-4 sm:p-6 border border-slate-200">
              <p className="text-slate-600 text-xs sm:text-sm mb-2">© 2024 The Universe of Nahiara & AquaMundi. All rights reserved.</p>
              <p className="text-slate-500 text-xs">International Association for the Defense of Flowers – Proveneya & Nahiara</p>
            </div>
          </div>
        </div>
      </div>
    </AccessGate>
  );
};

export default ProfessionalsPage;
