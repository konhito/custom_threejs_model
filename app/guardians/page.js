"use client";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { useTranslation } from "../../lib/useTranslation";

export default function GuardiansPage() {
  const { t, isLoading } = useTranslation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
      <Navigation />
      
      <div className="pt-20 px-4 lg:pr-24 lg:pl-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              {t('guardians.pageTitle')}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              {t('guardians.heroSubtitle')}
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-16">
            {/* Introduction Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-purple-800 mb-6">
                {t('guardians.introTitle')}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t('guardians.introText')}
              </p>
            </section>

            {/* Floral Guardians Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-purple-800 mb-6">
                {t('guardians.floralTitle')}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {t('guardians.floralText')}
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-xl font-semibold text-green-800 mb-3">{t('guardians.individualProtection')}</h3>
                  <p className="text-gray-700">
                    {t('guardians.individualProtectionDesc')}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('guardians.nahiaraConnection')}</h3>
                  <p className="text-gray-700">
                    {t('guardians.nahiaraConnectionDesc')}
                  </p>
                </div>
              </div>
            </section>

            {/* Collective Guardians Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-purple-800 mb-6">
                {t('guardians.collectiveTitle')}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {t('guardians.collectiveText')}
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl border border-green-300 text-center">
                  <h3 className="text-2xl font-bold text-green-800 mb-3">{t('guardians.greenLegion')}</h3>
                  <p className="text-green-700 font-medium">{t('guardians.volume1')}</p>
                  <p className="text-sm text-green-600 mt-2">{t('guardians.greenLegionDesc')}</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-100 to-orange-200 p-6 rounded-xl border border-orange-300 text-center">
                  <h3 className="text-2xl font-bold text-orange-800 mb-3">{t('guardians.pollinatorGuardians')}</h3>
                  <p className="text-orange-700 font-medium">{t('guardians.volume2')}</p>
                  <p className="text-sm text-orange-600 mt-2">{t('guardians.pollinatorGuardiansDesc')}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-purple-200 p-6 rounded-xl border border-purple-300 text-center">
                  <h3 className="text-2xl font-bold text-purple-800 mb-3">{t('guardians.elementalGuardians')}</h3>
                  <p className="text-purple-700 font-medium">{t('guardians.volume3')}</p>
                  <p className="text-sm text-purple-600 mt-2">{t('guardians.elementalGuardiansDesc')}</p>
                </div>
              </div>
            </section>

            {/* Symbolic Nature Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-purple-800 mb-6">
                {t('guardians.symbolicTitle')}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t('guardians.symbolicText')}
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">{t('guardians.lights')}</h4>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-300 to-cyan-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">{t('guardians.energies')}</h4>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">{t('guardians.silhouettes')}</h4>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">{t('guardians.poeticForms')}</h4>
                </div>
              </div>
            </section>

            {/* Function Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-purple-800 mb-6">
                {t('guardians.functionTitle')}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t('guardians.functionText')}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    1
                  </div>
                  <p className="text-lg text-gray-700">
                    {t('guardians.function1')}
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    2
                  </div>
                  <p className="text-lg text-gray-700">
                    {t('guardians.function2')}
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    3
                  </div>
                  <p className="text-lg text-gray-700">
                    {t('guardians.function3')}
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    4
                  </div>
                  <p className="text-lg text-gray-700">
                    {t('guardians.function4')}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
