import Navigation from "../../components/Navigation";

export default function GuardiansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
      <Navigation />
      
      <div className="pt-20 px-4 lg:pl-24 lg:pr-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Guardians
            </h1>
            <p className="text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Every Flower Has Its Guardian
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-16">
            {/* Introduction Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-purple-800 mb-6">
                Guardians of AquaMundi
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                In AquaMundi, no flower stands alone. Each national flower is accompanied by its own unique Guardian, 
                a symbolic entity that protects its essence and story.
              </p>
            </section>

            {/* Floral Guardians Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-purple-800 mb-6">
                Floral Guardians
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Every national flower has its inseparable Guardian, representing and defending it within the mantle of NAHIARA.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-xl font-semibold text-green-800 mb-3">Individual Protection</h3>
                  <p className="text-gray-700">
                    Each flower is paired with a unique Guardian that embodies its cultural significance and natural beauty.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">NAHIARA Connection</h3>
                  <p className="text-gray-700">
                    Guardians operate within the sacred mantle of NAHIARA, ensuring the preservation of floral heritage.
                  </p>
                </div>
              </div>
            </section>

            {/* Collective Guardians Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-purple-800 mb-6">
                Collective Guardians
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Beyond the individual bond, flowers and pollinators are also grouped into legions:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl border border-green-300 text-center">
                  <h3 className="text-2xl font-bold text-green-800 mb-3">The Green Legion</h3>
                  <p className="text-green-700 font-medium">Volume I</p>
                  <p className="text-sm text-green-600 mt-2">Guardians of terrestrial flora and national flowers</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-100 to-orange-200 p-6 rounded-xl border border-orange-300 text-center">
                  <h3 className="text-2xl font-bold text-orange-800 mb-3">The Pollinator Guardians</h3>
                  <p className="text-orange-700 font-medium">Volume II</p>
                  <p className="text-sm text-orange-600 mt-2">Protectors of pollination and biodiversity</p>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-purple-200 p-6 rounded-xl border border-purple-300 text-center">
                  <h3 className="text-2xl font-bold text-purple-800 mb-3">The Elemental Guardians</h3>
                  <p className="text-purple-700 font-medium">Volume III+</p>
                  <p className="text-sm text-purple-600 mt-2">Masters of natural elements and cosmic forces</p>
                </div>
              </div>
            </section>

            {/* Symbolic Nature Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-purple-800 mb-6">
                Symbolic Nature
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Guardians are not human figures. They appear as lights, energies, silhouettes, or poetic forms 
                that reflect the connection between nature and memory.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">Lights</h4>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-300 to-cyan-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">Energies</h4>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">Silhouettes</h4>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">Poetic Forms</h4>
                </div>
              </div>
            </section>

            {/* Function Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-purple-800 mb-6">
                Function in AquaMundi
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                The Guardians page allows visitors to:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    1
                  </div>
                  <p className="text-lg text-gray-700">
                    See each national flower and its corresponding Guardian
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    2
                  </div>
                  <p className="text-lg text-gray-700">
                    Explore the different Guardian legions and their purposes
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    3
                  </div>
                  <p className="text-lg text-gray-700">
                    Understand the symbolic connection between nature and cultural memory
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    4
                  </div>
                  <p className="text-lg text-gray-700">
                    Discover the protective role of Guardians in preserving floral heritage
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
