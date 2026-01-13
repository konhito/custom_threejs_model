"use client";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { useTranslation } from "../../lib/useTranslation";

export default function LivingArchivePage() {
  const { t, isLoading } = useTranslation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Navigation />
      
      <div className="pt-20 px-4 lg:pr-24 lg:pl-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
              {t('nav.archive')}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              {t('navDescriptions.archive')}
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-16">
            {/* Introduction Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-amber-800 mb-6">
                {t('nav.archive')}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t('navDescriptions.archive')}
              </p>
            </section>

            {/* The Book Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-amber-800 mb-6">
                {t('nav.archive')}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {t('navDescriptions.archive')}
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl border border-blue-200 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">📖</span>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800 mb-3">{t('nav.archive')}</h3>
                  <p className="text-gray-700 mb-6">
                    {t('navDescriptions.archive')}
                  </p>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    {t('common.viewAll')}
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl border border-green-200 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">📚</span>
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-3">{t('nav.archive')}</h3>
                  <p className="text-gray-700 mb-6">
                    {t('navDescriptions.archive')}
                  </p>
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    {t('common.viewAll')}
                  </button>
                </div>
              </div>
            </section>

            {/* The Digital Card Game Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-amber-800 mb-6">
                {t('nav.game')}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {t('navDescriptions.archive')}
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-8 rounded-xl border border-purple-200 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">🎮</span>
                  </div>
                  <h3 className="text-2xl font-bold text-purple-800 mb-3">{t('nav.game')}</h3>
                  <p className="text-gray-700 mb-6">
                    {t('navDescriptions.archive')}
                  </p>
                  <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                    {t('nav.game')}
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-xl border border-orange-200 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">⭐</span>
                  </div>
                  <h3 className="text-2xl font-bold text-orange-800 mb-3">{t('nav.game')}</h3>
                  <p className="text-gray-700 mb-6">
                    {t('navDescriptions.archive')}
                  </p>
                  <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                    {t('common.learnMore')}
                  </button>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-amber-800 mb-6">
                {t('nav.archive')}
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🌺</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('nav.flowers')}</h3>
                  <p className="text-gray-600 text-sm">
                    {t('navDescriptions.flowers')}
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🦋</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('nav.pollinators')}</h3>
                  <p className="text-gray-600 text-sm">
                    {t('navDescriptions.pollinators')}
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('nav.guardians')}</h3>
                  <p className="text-gray-600 text-sm">
                    {t('navDescriptions.guardians')}
                  </p>
                </div>
              </div>
            </section>

            {/* Call to Action Section */}
            <section className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 lg:p-12 text-center text-white">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                {t('nav.archive')}
              </h2>
              <p className="text-xl mb-8 opacity-90">
                {t('navDescriptions.archive')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  {t('common.viewAll')}
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-600 transition-colors">
                  {t('nav.game')}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
