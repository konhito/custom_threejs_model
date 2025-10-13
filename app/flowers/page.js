import Navigation from "../../components/Navigation";

export default function FlowersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>
      
      <Navigation />
      
      <div className="relative pt-20 px-4 lg:pl-24 lg:pr-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-5xl lg:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
              National Flowers
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Living symbols of cultural identity and natural heritage
            </p>
          </div>

          {/* Main Content - Full Width Layout */}
          <div className="space-y-8 mb-20">
            {/* Introduction Card */}
            <div className="group bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500 hover:scale-[1.01]">
              <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
                Criteria of Selection and Explanation
              </h2>
              <div className="space-y-6">
                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                  National flowers are living symbols of <span className="font-semibold text-blue-600">cultural identity</span>, historical memory, and natural heritage. They represent not only the biodiversity of each country but also the values and emotions that their peoples have placed upon them over time.
                </p>
                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                  In AquaMundi, the inclusion of each flower follows a <span className="font-semibold text-purple-600">rigorous protocol</span> that ensures accuracy, cultural significance, and scientific validity.
                </p>
              </div>
            </div>

            {/* Criteria Cards Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Official Criterion Card */}
              <div className="group bg-gradient-to-br from-blue-50/80 to-blue-100/40 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl border border-blue-200/30 hover:shadow-3xl transition-all duration-500 hover:scale-[1.01]">
                <h3 className="text-2xl lg:text-3xl font-bold text-blue-700 mb-6">Official Criterion</h3>
                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                  Priority is given to flowers officially recognized as national emblems by States, Parliaments, or governmental institutions.
                </p>
              </div>

              {/* Cultural Criterion Card */}
              <div className="group bg-gradient-to-br from-purple-50/80 to-purple-100/40 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl border border-purple-200/30 hover:shadow-3xl transition-all duration-500 hover:scale-[1.01]">
                <h3 className="text-2xl lg:text-3xl font-bold text-purple-700 mb-6">Cultural Criterion</h3>
                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                  In the absence of official recognition, the guidelines of the Non-Official Flower Protocol (PFNO) are applied. This protocol allows the inclusion of species that, without legislative backing, hold strong cultural, historical, or emotional significance in the memory of a country or region.
                </p>
              </div>

              {/* Scientific and Symbolic Criterion Card */}
              <div className="group bg-gradient-to-br from-indigo-50/80 to-indigo-100/40 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl border border-indigo-200/30 hover:shadow-3xl transition-all duration-500 hover:scale-[1.01]">
                <h3 className="text-2xl lg:text-3xl font-bold text-indigo-700 mb-6">Scientific and Symbolic Criterion</h3>
                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                  International botanical and scientific sources are consulted to ensure the correct identification of each species. At the same time, symbolic meanings acquired through rituals, traditions, and community narratives are valued.
                </p>
              </div>
            </div>

            {/* Narrative Criterion Card - Full Width */}
            <div className="group bg-gradient-to-br from-cyan-50/80 to-cyan-100/40 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-cyan-200/30 hover:shadow-3xl transition-all duration-500 hover:scale-[1.01]">
              <h3 className="text-2xl lg:text-3xl font-bold text-cyan-700 mb-6">Narrative Criterion</h3>
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                Each flower is part of a symbolic mantle that connects with the guardians, pollinators, and the broader narrative of AquaMundi, becoming an essential piece of a global story about biodiversity and hope.
              </p>
            </div>

            {/* Selection Process Card - Full Width */}
            <div className="group bg-gradient-to-br from-purple-50/80 to-purple-100/40 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-purple-200/30 hover:shadow-3xl transition-all duration-500 hover:scale-[1.01]">
              <h3 className="text-2xl lg:text-3xl font-bold text-purple-700 mb-8">Selection Process</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-start group/item">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-3 mr-4 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300"></div>
                  <span className="text-lg text-gray-700 leading-relaxed">
                    Official recognition by government institutions
                  </span>
                </div>
                <div className="flex items-start group/item">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-3 mr-4 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300"></div>
                  <span className="text-lg text-gray-700 leading-relaxed">
                    Cultural and historical significance
                  </span>
                </div>
                <div className="flex items-start group/item">
                  <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full mt-3 mr-4 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300"></div>
                  <span className="text-lg text-gray-700 leading-relaxed">
                    Scientific validation and accuracy
                  </span>
                </div>
                <div className="flex items-start group/item">
                  <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full mt-3 mr-4 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300"></div>
                  <span className="text-lg text-gray-700 leading-relaxed">
                    Integration with AquaMundi&apos;s story
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Full Width */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-white/80 via-indigo-50/80 to-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500 hover:scale-[1.01] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed italic font-medium">
                  &ldquo;Through this approach, AquaMundi ensures that each national flower accurately reflects the identity of its country, offering an experience that unites <span className="font-bold text-indigo-600">science, culture, and poetry</span> in a single <span className="font-bold text-blue-600">digital garden</span>.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
