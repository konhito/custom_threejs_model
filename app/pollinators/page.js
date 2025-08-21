import Navigation from "../../components/Navigation";
import Link from "next/link";
import { ArrowRight, Heart, Zap, Globe, BookOpen, AlertTriangle, TrendingDown, Shield, Users, Target } from "lucide-react";

// Chart Component
function PollinatorDeclineChart() {
  const data = [
    { label: "Wild flowering plants depending on pollinators (2016)", percentage: 90, color: "from-blue-500 to-blue-600" },
    { label: "Food crops requiring pollinators (2016)", percentage: 75, color: "from-blue-500 to-blue-600" },
    { label: "Pollinating insects highly threatened (2025)", percentage: 40, color: "from-red-500 to-red-600" },
    { label: "Annual decline of terrestrial insects (per decade)", percentage: 9, color: "from-red-500 to-red-600" },
    { label: "Managed bee colony losses (U.S., 2025)", percentage: 65, color: "from-orange-500 to-orange-600" },
    { label: "Native pollinators at risk (N. America, 2025)", percentage: 22, color: "from-orange-500 to-orange-600" }
  ];

  return (
    <div className="bg-white/90 rounded-2xl p-6 border border-gray-200 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
        Pollinator Decline - Key Figures
      </h3>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-48 text-sm text-gray-700 flex-shrink-0">
              {item.label}
            </div>
            <div className="flex-1 relative">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <div className="absolute -top-1 -right-2 w-8 h-5 bg-white border border-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700">{item.percentage}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
            <span>2016 Data</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded"></div>
            <span>2025 Crisis</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded"></div>
            <span>US Impact</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PollinatorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <Navigation />
      
      <div className="pt-20 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-6">
              Pollinators
            </h1>
            <p className="text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              The invisible guardians of life on Earth. Thanks to them, millions of flowers transform into fruits and seeds, ensuring the continuity of ecosystems and the nourishment of humanity.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-16">
            {/* Introduction Section */}
            <section className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-white/20">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
                  Guardians of Biodiversity
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  In AquaMundi, pollinators hold a central place alongside national flowers, as they represent the bridge between nature, culture, and survival. These remarkable creatures are the unsung heroes that keep our planet's delicate balance intact.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  From the tiniest bee to the most magnificent hummingbird, each pollinator plays a vital role in the grand symphony of life, ensuring that future generations can continue to marvel at the beauty and abundance of our natural world.
                </p>
              </div>
            </section>

            {/* Visual Chart Section */}
            <section className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 lg:p-12 border border-gray-200 shadow-xl">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingDown className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                    The Numbers Don't Lie
                  </h2>
                  <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                    Visual representation of the pollinator crisis from 2016 to 2025, showing the dramatic decline and urgent need for action.
                  </p>
                </div>
                
                <PollinatorDeclineChart />
              </div>
            </section>

            {/* NAHIARA Manifesto Section */}
            <section className="bg-gradient-to-br from-red-50 to-orange-100 rounded-3xl p-8 lg:p-12 border border-red-200 shadow-xl">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-red-800 mb-4">
                    From Decline to Guardianship
                  </h2>
                  <p className="text-lg text-red-700 font-medium">
                    A Manifesto from the NAHIARA Universe (2016 – 2025)
                  </p>
                </div>

                <div className="space-y-8">
                  {/* 2016 Findings */}
                  <div className="bg-white/80 rounded-2xl p-6 border border-red-200">
                    <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-red-100 rounded-full mr-3 flex items-center justify-center text-red-600 font-bold text-sm">2016</span>
                      The Historic IPBES Report
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">90% of wild flowering plants depended on animal pollinators</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">More than 75% of global food crops required their intervention</p>
                      </div>
                    </div>
                  </div>

                  {/* 2025 Crisis */}
                  <div className="bg-red-100/80 rounded-2xl p-6 border border-red-300">
                    <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-red-200 rounded-full mr-3 flex items-center justify-center text-red-700 font-bold text-sm">2025</span>
                      The Evidence is Alarming
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-start space-x-3">
                        <TrendingDown className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">Over 40% of global pollinating insects are highly threatened</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <TrendingDown className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">Terrestrial insect populations decline at ~9% per decade</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <TrendingDown className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">Managed bee colony losses in U.S. reached 60–70% in a single year</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <TrendingDown className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">22% of North America's native pollinators at high risk of extinction</p>
                      </div>
                    </div>
                  </div>

                  {/* Institutional Inertia */}
                  <div className="bg-white/80 rounded-2xl p-6 border border-red-200">
                    <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                      <Shield className="w-6 h-6 text-red-600 mr-3" />
                      Institutional Inertia
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">Fragmented initiatives that never reached global coordination</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">Short-term priorities that relegated biodiversity</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">Underestimation of pollinators as vital infrastructure</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">Resistance to move away from pesticide-intensive agriculture</p>
                      </div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6 border border-amber-300">
                    <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center">
                      <Target className="w-6 h-6 text-amber-600 mr-3" />
                      A Call for the Next Decade
                    </h3>
                    <p className="text-gray-700 mb-4 text-sm">
                      The NAHIARA thesis calls for urgent global action:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-start space-x-3">
                        <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                        <p className="text-gray-700">Integrate pollinator protection into national and food security policies</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                        <p className="text-gray-700">Establish ecological corridors for species survival and mobility</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                        <p className="text-gray-700">Transition agricultural systems toward regenerative models</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                        <p className="text-gray-700">Implement real-time global monitoring, accessible and transparent</p>
                      </div>
                      <div className="flex items-start space-x-3 md:col-span-2">
                        <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                        <p className="text-gray-700">Embed pollinators into education and culture as living symbols of life</p>
                      </div>
                    </div>
                  </div>

                  {/* Conclusion */}
                  <div className="bg-red-50 rounded-2xl p-6 border border-red-200 text-center">
                    <h3 className="text-xl font-bold text-red-800 mb-3">Conclusion</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Protecting pollinators is not optional – it is a moral, ecological, and cultural duty. The coming decade will decide whether humanity chooses restoration or collapse.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Three Pillars */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Biological Diversity */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-800 mb-3">Biological Diversity</h3>
                <p className="text-blue-700">
                  Bees, hummingbirds, butterflies, bats, and other species that play key roles across continents are included. Each pollinator is presented with its scientific and educational context.
                </p>
              </div>

              {/* Symbolic Dimension */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-purple-800 mb-3">Symbolic Dimension</h3>
                <p className="text-purple-700">
                  Every pollinator is also treated as a poetic guardian within the narrative of AquaMundi, with a symbolic name and a unique role in the story.
                </p>
              </div>

              {/* Interactive Gallery */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-3">Interactive Gallery</h3>
                <p className="text-green-700">
                  The digital gallery will allow visitors to explore pollinators in 3D, access scientific and symbolic data, and discover the connections linking them with each national flower.
                </p>
              </div>
            </section>

            {/* Gallery Preview Section */}
            <section className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-8 lg:p-12 border border-amber-200">
              <div className="text-center mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                  Explore the Pollinators Gallery
                </h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  Discover an initial gallery of bees, hummingbirds, butterflies, bats, and other beings that keep the planet's biodiversity in balance. Explore their images, learn their names, and join us in building a living archive.
                </p>
              </div>

              <div className="text-center">
                <Link 
                  href="/pollinators/gallery"
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="text-lg">Access the Pollinators Gallery</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  This gallery will soon transform into a 3D digital garden where you can interact with pollinators in their natural habitats.
                </p>
              </div>
            </section>

            {/* Impact Section */}
            <section className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-white/20">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
                  Ambassadors of Hope
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Through this integration, AquaMundi turns pollinators into ambassadors of hope, reminding us that without them, life itself could not flourish. They are the living threads that connect every flower, every fruit, and every future generation.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
