import Navigation from "../../components/Navigation";

export default function LivingArchivePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Navigation />
      
      <div className="pt-20 px-4 lg:pl-24 lg:pr-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
              The Living Archive
            </h1>
            <p className="text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Central Access Point for the Core Content of the NAHIARA Universe
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-16">
            {/* Introduction Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-amber-800 mb-6">
                Welcome to The Living Archive
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                This page serves as the central access point for the core content of the NAHIARA universe, 
                where knowledge, stories, and interactive experiences come together to preserve and celebrate 
                our floral heritage.
              </p>
            </section>

            {/* The Book Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-amber-800 mb-6">
                The Book of Flowers – Central Work of NAHIARA
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Immerse yourself in the complete NAHIARA experience through our comprehensive book, 
                available in multiple formats to suit your reading preferences.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl border border-blue-200 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">📖</span>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800 mb-3">Chapter by Chapter</h3>
                  <p className="text-gray-700 mb-6">
                    Download individual chapters to explore specific aspects of the NAHIARA universe at your own pace.
                  </p>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Browse Chapters
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl border border-green-200 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">📚</span>
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-3">Complete Volume</h3>
                  <p className="text-gray-700 mb-6">
                    Access the full NAHIARA experience in one comprehensive volume, perfect for deep immersion.
                  </p>
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    Download Full Volume
                  </button>
                </div>
              </div>
            </section>

            {/* The Digital Card Game Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-amber-800 mb-6">
                The Digital Card Game
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Experience the NAHIARA universe through interactive gameplay, available in both free and premium versions.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-8 rounded-xl border border-purple-200 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">🎮</span>
                  </div>
                  <h3 className="text-2xl font-bold text-purple-800 mb-3">Free Basic Version</h3>
                  <p className="text-gray-700 mb-6">
                    Start your NAHIARA journey with the free basic version, featuring core gameplay mechanics and essential content.
                  </p>
                  <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                    Play Free Version
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-xl border border-orange-200 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">⭐</span>
                  </div>
                  <h3 className="text-2xl font-bold text-orange-800 mb-3">Premium Full Experience</h3>
                  <p className="text-gray-700 mb-6">
                    Unlock the complete NAHIARA experience with premium features, exclusive content, and enhanced gameplay.
                  </p>
                  <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-amber-800 mb-6">
                What You&apos;ll Find Here
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🌺</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">National Flowers</h3>
                  <p className="text-gray-600 text-sm">
                    Discover the cultural significance and natural beauty of flowers from around the world
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🦋</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Pollinators</h3>
                  <p className="text-gray-600 text-sm">
                    Learn about the vital role of pollinators in maintaining biodiversity and ecosystem health
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Guardians</h3>
                  <p className="text-gray-600 text-sm">
                    Explore the symbolic entities that protect and preserve our floral heritage
                  </p>
                </div>
              </div>
            </section>

            {/* Call to Action Section */}
            <section className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 lg:p-12 text-center text-white">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Begin Your NAHIARA Journey
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Choose your path to explore the living archive of our floral world
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Explore The Book
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-600 transition-colors">
                  Play The Game
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
