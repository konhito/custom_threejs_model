"use client";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { useTranslation } from "../../lib/useTranslation";

export default function ImpactPage() {
  const { t, isLoading } = useTranslation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      <Navigation />
      
      <div className="pt-20 px-4 lg:pr-24 lg:pl-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 bg-clip-text text-transparent mb-6">
              {t('impact.pageTitle')}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              {t('impact.heroSubtitle')}
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-16">
            {/* Introduction Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-emerald-800 mb-6">
                {t('impact.introTitle')}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t('impact.introText')}
              </p>
            </section>

            {/* Educational Impact Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-emerald-800 mb-6">
                {t('impact.educationalImpact')}
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('impact.learningResources')}</h3>
                  <p className="text-gray-700">
                    {t('impact.learningResourcesDesc')}
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-xl font-semibold text-green-800 mb-3">{t('impact.globalAccess')}</h3>
                  <p className="text-gray-700">
                    {t('impact.globalAccessDesc')}
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200">
                  <h3 className="text-xl font-semibold text-purple-800 mb-3">{t('impact.integration')}</h3>
                  <p className="text-gray-700">
                    {t('impact.integrationDesc')}
                  </p>
                </div>
              </div>
            </section>

            {/* Social Impact Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-emerald-800 mb-6">
                {t('impact.socialImpact')}
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200">
                  <h3 className="text-xl font-semibold text-orange-800 mb-3">{t('impact.floralEconomy')}</h3>
                  <p className="text-gray-700">
                    {t('impact.floralEconomyDesc')}
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl border border-pink-200">
                  <h3 className="text-xl font-semibold text-pink-800 mb-3">{t('impact.sharedBeauty')}</h3>
                  <p className="text-gray-700">
                    {t('impact.sharedBeautyDesc')}
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200">
                  <h3 className="text-xl font-semibold text-indigo-800 mb-3">{t('impact.globalNetwork')}</h3>
                  <p className="text-gray-700">
                    {t('impact.globalNetworkDesc')}
                  </p>
                </div>
              </div>
            </section>

            {/* Cultural and Artistic Impact Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-emerald-800 mb-6">
                {t('impact.culturalImpact')}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-6 rounded-xl border border-violet-200">
                  <h3 className="text-xl font-semibold text-violet-800 mb-3">{t('impact.digitalMuseum')}</h3>
                  <p className="text-gray-700">
                    {t('impact.digitalMuseumDesc')}
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-200">
                  <h3 className="text-xl font-semibold text-teal-800 mb-3">{t('impact.symbolicNarratives')}</h3>
                  <p className="text-gray-700">
                    {t('impact.symbolicNarrativesDesc')}
                  </p>
                </div>
              </div>
            </section>

            {/* Scientific and Environmental Impact Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-emerald-800 mb-6">
                {t('impact.scientificImpact')}
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200">
                  <h3 className="text-xl font-semibold text-emerald-800 mb-3">{t('impact.globalArchive')}</h3>
                  <p className="text-gray-700">
                    {t('impact.globalArchiveDesc')}
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-lime-50 to-yellow-50 p-6 rounded-xl border border-lime-200">
                  <h3 className="text-xl font-semibold text-lime-800 mb-3">{t('impact.originalDevelopments')}</h3>
                  <p className="text-gray-700 mb-4">
                    {t('impact.originalDevelopmentsDesc')}
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">1.</span>
                      <span>{t('impact.nahiaraMeasure')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">2.</span>
                      <span>{t('impact.araihanMeasure')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">3.</span>
                      <span>{t('impact.pfnoProtocol')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">4.</span>
                      <span>{t('impact.sanCode')}</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-xl font-semibold text-green-800 mb-3">{t('impact.conservation')}</h3>
                  <p className="text-gray-700">
                    {t('impact.conservationDesc')}
                  </p>
                </div>
              </div>
            </section>

            {/* Transparency Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-emerald-800 mb-6">
                {t('impact.transparencyTitle')}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {t('impact.transparencyText')}
              </p>
              
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-8 rounded-xl border border-emerald-200">
                <h3 className="text-2xl font-bold text-emerald-800 mb-6">{t('impact.annualReports')}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                        1
                      </div>
                      <p className="text-gray-700">{t('impact.fundsRaised')}</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                        2
                      </div>
                      <p className="text-gray-700">{t('impact.booksDonated')}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                        3
                      </div>
                      <p className="text-gray-700">{t('impact.resourcesDeveloped')}</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                        4
                      </div>
                      <p className="text-gray-700">{t('impact.communitiesSupported')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('impact.traceability')}</h3>
                  <p className="text-gray-700">
                    {t('impact.traceabilityDesc')}
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200">
                  <h3 className="text-xl font-semibold text-purple-800 mb-3">{t('impact.ethicalCommitment')}</h3>
                  <p className="text-gray-700">
                    {t('impact.ethicalCommitmentDesc')}
                  </p>
                </div>
              </div>
            </section>

            {/* Conclusion Section */}
            <section className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-8 lg:p-12 text-center text-white">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                {t('impact.conclusionTitle')}
              </h2>
              <p className="text-xl lg:text-2xl leading-relaxed max-w-4xl mx-auto opacity-90">
                {t('impact.conclusionText')}
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
