"use client";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { useTranslation } from "../../lib/useTranslation";

export default function EducationPage() {
  const { t, isLoading } = useTranslation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <Navigation />
      
      <div className="pt-20 px-4 lg:pr-24 lg:pl-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6">
              {t('education.pageTitle')}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              {t('education.heroSubtitle')}
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-16">
            {/* Introduction Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-teal-800 mb-6">
                {t('education.introTitle')}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t('education.introText')}
              </p>
            </section>

            {/* Learning Resources Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-teal-800 mb-6">
                {t('education.resourcesTitle')}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                    <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('education.digitalLibrary')}</h3>
                    <p className="text-gray-700">
                      {t('education.digitalLibraryDesc')}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <h3 className="text-xl font-semibold text-green-800 mb-3">{t('education.interactiveTools')}</h3>
                    <p className="text-gray-700">
                      {t('education.interactiveToolsDesc')}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200">
                    <h3 className="text-xl font-semibold text-purple-800 mb-3">{t('education.nahiaraMeasurement')}</h3>
                    <p className="text-gray-700">
                      {t('education.nahiaraMeasurementDesc')}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200">
                    <h3 className="text-xl font-semibold text-orange-800 mb-3">{t('education.floralEconomy')}</h3>
                    <p className="text-gray-700">
                      {t('education.floralEconomyDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Community Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-teal-800 mb-6">
                {t('education.communityTitle')}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl border border-pink-200">
                    <h3 className="text-xl font-semibold text-pink-800 mb-3">{t('education.floralAmbassadors')}</h3>
                    <p className="text-gray-700">
                      {t('education.floralAmbassadorsDesc')}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200">
                    <h3 className="text-xl font-semibold text-indigo-800 mb-3">{t('education.globalGarden')}</h3>
                    <p className="text-gray-700">
                      {t('education.globalGardenDesc')}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-200">
                    <h3 className="text-xl font-semibold text-teal-800 mb-3">{t('education.collectiveGuardians')}</h3>
                    <p className="text-gray-700">
                      {t('education.collectiveGuardiansDesc')}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-200">
                    <h3 className="text-xl font-semibold text-yellow-800 mb-3">{t('education.communityEvents')}</h3>
                    <p className="text-gray-700">
                      {t('education.communityEventsDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Purpose Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-teal-800 mb-6">
                {t('education.purposeTitle')}
              </h2>
              <div className="text-center">
                <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
                  {t('education.purposeText')}
                </p>
              </div>
            </section>

            {/* Call to Action Section */}
            <section className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-8 lg:p-12 text-center text-white">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                {t('education.joinCommunity')}
              </h2>
              <p className="text-xl mb-8 opacity-90">
                {t('education.joinCommunityText')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  {t('education.exploreResources')}
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors">
                  {t('education.joinCommunityBtn')}
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
