import Navigation from "../../components/Navigation";

export default function ImpactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      <Navigation />
      
      <div className="pt-20 px-4 lg:pl-24 lg:pr-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 bg-clip-text text-transparent mb-6">
              Impact & Transparency
            </h1>
            <p className="text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Where Does AquaMundi Bloom?
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-16">
            {/* Introduction Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-emerald-800 mb-6">
                Impact and Transparency
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Impact and Transparency are at the heart of AquaMundi&apos;s mission. Every action, every contribution, 
                is designed to create measurable, visible, and meaningful change.
              </p>
            </section>

            {/* Educational Impact Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-emerald-800 mb-6">
                Educational Impact
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">Learning Resources</h3>
                  <p className="text-gray-700">
                    Development of learning resources (fact sheets, guides, mini-games).
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-xl font-semibold text-green-800 mb-3">Global Access</h3>
                  <p className="text-gray-700">
                    Children and youth worldwide gaining free access to biodiversity content.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200">
                  <h3 className="text-xl font-semibold text-purple-800 mb-3">Integration</h3>
                  <p className="text-gray-700">
                    Integration into school programs and museum experiences.
                  </p>
                </div>
              </div>
            </section>

            {/* Social Impact Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-emerald-800 mb-6">
                Social Impact
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200">
                  <h3 className="text-xl font-semibold text-orange-800 mb-3">Floral Economy</h3>
                  <p className="text-gray-700">
                    Donation of printed books to vulnerable communities through the &ldquo;Floral Economy.&rdquo;
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl border border-pink-200">
                  <h3 className="text-xl font-semibold text-pink-800 mb-3">Shared Beauty</h3>
                  <p className="text-gray-700">
                    Ephemeral floral sculptures in neighborhoods and cities as acts of shared beauty.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200">
                  <h3 className="text-xl font-semibold text-indigo-800 mb-3">Global Network</h3>
                  <p className="text-gray-700">
                    A network of Floral Ambassadors representing the cultural diversity of each nation.
                  </p>
                </div>
              </div>
            </section>

            {/* Cultural and Artistic Impact Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-emerald-800 mb-6">
                Cultural and Artistic Impact
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-6 rounded-xl border border-violet-200">
                  <h3 className="text-xl font-semibold text-violet-800 mb-3">Digital Museum of Guardians</h3>
                  <p className="text-gray-700">
                    Creation of the Digital Museum of Guardians, where artists worldwide contribute their vision.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-200">
                  <h3 className="text-xl font-semibold text-teal-800 mb-3">Symbolic Narratives</h3>
                  <p className="text-gray-700">
                    Integration of symbolic narratives connecting science, art, and the spirit of nature.
                  </p>
                </div>
              </div>
            </section>

            {/* Scientific and Environmental Impact Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-emerald-800 mb-6">
                Scientific and Environmental Impact
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200">
                  <h3 className="text-xl font-semibold text-emerald-800 mb-3">Global Archive</h3>
                  <p className="text-gray-700">
                    A global archive of national flowers and pollinators accessible in 3D.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-lime-50 to-yellow-50 p-6 rounded-xl border border-lime-200">
                  <h3 className="text-xl font-semibold text-lime-800 mb-3">Original Developments</h3>
                  <p className="text-gray-700 mb-4">
                    Among other entirely original developments of the project:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">1.</span>
                      <span>Nahiara Measure</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">2.</span>
                      <span>Araihan Measure</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">3.</span>
                      <span>PFNO Protocol</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">4.</span>
                      <span>SAN Code</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-xl font-semibold text-green-800 mb-3">Conservation</h3>
                  <p className="text-gray-700">
                    Raising visibility of species at risk and promoting regenerative practices.
                  </p>
                </div>
              </div>
            </section>

            {/* Transparency Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold text-emerald-800 mb-6">
                Transparency
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                At AquaMundi, every gesture of support translates into verifiable impact:
              </p>
              
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-8 rounded-xl border border-emerald-200">
                <h3 className="text-2xl font-bold text-emerald-800 mb-6">Annual Reports</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                        1
                      </div>
                      <p className="text-gray-700">Funds raised.</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                        2
                      </div>
                      <p className="text-gray-700">Number of books donated and countries reached.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                        3
                      </div>
                      <p className="text-gray-700">Digital resources developed.</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                        4
                      </div>
                      <p className="text-gray-700">Communities and schools supported.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">Educational and Cultural Traceability</h3>
                  <p className="text-gray-700">
                    Each purchase or donation is symbolically reflected in the Digital Garden as a seed that germinates within the project.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200">
                  <h3 className="text-xl font-semibold text-purple-800 mb-3">Ethical Commitment</h3>
                  <p className="text-gray-700">
                    AquaMundi does not point fingers or politicize. It opens pathways of restoration through knowledge and global participation.
                  </p>
                </div>
              </div>
            </section>

            {/* Conclusion Section */}
            <section className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-8 lg:p-12 text-center text-white">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Conclusion
              </h2>
              <p className="text-xl lg:text-2xl leading-relaxed max-w-4xl mx-auto opacity-90">
                Impact without transparency is incomplete. AquaMundi commits to ensuring that both walk hand in hand: 
                measurable action, transparent communication, and shared hope.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
