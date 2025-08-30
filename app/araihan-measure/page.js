import Navigation from "../../components/Navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp } from "lucide-react";

export default function AraihanMeasurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      
      <div className="pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">
              Araihan Measure
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed">
              This page is under development. Content will be added soon.
            </p>
          </div>

          {/* Placeholder Content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-white/20 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Coming Soon
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              The Araihan Measure initiative is currently being developed. This page will contain important information about our measures and initiatives.
            </p>
            
            {/* Back to Home Button */}
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
