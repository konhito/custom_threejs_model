import Navigation from "../../components/Navigation";

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <Navigation />
      
      <div className="pt-20 px-4 lg:pl-24 lg:pr-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Education & Community
            </h1>
            <p className="text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Learning Resources and Global Community
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-16">
            {/* Introduction Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-teal-800 mb-6">
                Education and Community
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Education and Community is where AquaMundi becomes more than an archive or museum – 
                it transforms into a pedagogical tool and a collective movement.
              </p>
            </section>

            {/* Learning Resources Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-teal-800 mb-6">
                Learning Resources
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                    <h3 className="text-xl font-semibold text-blue-800 mb-3">Digital Library</h3>
                    <p className="text-gray-700">
                      Downloadable materials on flowers, pollinators, and guardians (fact sheets, illustrated guides, infographics).
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <h3 className="text-xl font-semibold text-green-800 mb-3">Interactive Tools</h3>
                    <p className="text-gray-700">
                      3D maps, augmented reality of flowers and pollinators, and educational mini-games.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200">
                    <h3 className="text-xl font-semibold text-purple-800 mb-3">The Araihan Measure</h3>
                    <p className="text-gray-700">
                      A symbolic tool to evaluate the risk of disappearance of national flowers, linked to scientific and poetic indicators.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200">
                    <h3 className="text-xl font-semibold text-orange-800 mb-3">Floral Economy</h3>
                    <p className="text-gray-700">
                      Educational content showing how book/game purchases help donate books to children and vulnerable communities.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Community Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-teal-800 mb-6">
                Community
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl border border-pink-200">
                    <h3 className="text-xl font-semibold text-pink-800 mb-3">Floral Ambassadors</h3>
                    <p className="text-gray-700">
                      A network of children, youth, and adults representing their country&apos;s flower in the international community.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200">
                    <h3 className="text-xl font-semibold text-indigo-800 mb-3">The Global Garden</h3>
                    <p className="text-gray-700">
                      A virtual space for users to upload photos, drawings, or sculptures of their national flower (&ldquo;Draw the Flower of Your Country&rdquo;).
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-200">
                    <h3 className="text-xl font-semibold text-teal-800 mb-3">Collective Guardians</h3>
                    <p className="text-gray-700">
                      Activities where schools or community groups adopt a symbolic Guardian and represent it with their own creative works.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-200">
                    <h3 className="text-xl font-semibold text-yellow-800 mb-3">Community Events</h3>
                    <p className="text-gray-700">
                      Ephemeral floral sculptures made with discarded flowers, school workshops, and intergenerational activities.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Purpose Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-teal-800 mb-6">
                Purpose
              </h2>
              <div className="text-center">
                <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
                  To educate, inspire, and connect. To make every visitor feel part of a global community of Guardians, 
                  where learning, creating, and sharing become acts of protection and hope for biodiversity.
                </p>
              </div>
            </section>

            {/* Call to Action Section */}
            <section className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-8 lg:p-12 text-center text-white">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Join the Global Community
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Become part of a worldwide network of Guardians protecting our floral heritage
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Explore Resources
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors">
                  Join Community
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
