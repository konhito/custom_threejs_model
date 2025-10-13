import Navigation from "../../components/Navigation";
import { generateMetadata, generateStructuredData } from "../../lib/seo";

// Generate metadata for the about page
export const metadata = generateMetadata({
  title: "About International Association for the Defense of Flowers - Mission & Purpose",
  description: "Learn about the mission to preserve floral and pollinator memory, unite communities through nature's beauty, and create a global archive of biodiversity.",
  keywords: ["about", "mission", "purpose", "biodiversity", "environmental education", "floral archive", "pollinator conservation"],
  url: "/about",
  type: "website",
});

export default function AboutPage() {
  // Generate structured data for the about page
  const structuredData = generateStructuredData({
    type: "AboutPage",
    name: "About International Association for the Defense of Flowers",
    description: "Learn about the mission to preserve floral and pollinator memory, unite communities through nature's beauty, and create a global archive of biodiversity.",
    url: "/about",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "About", url: "/about" }
    ],
  });
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <Navigation />
        
        <main className="relative pt-20 px-4 lg:pl-24 lg:pr-8 pb-16">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <header className="text-center mb-20">
              <h1 className="text-5xl lg:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
                What is the International Association for the Defense of Flowers?
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                The digital garden where nature meets technology
              </p>
            </header>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-12 gap-8 mb-20">
            {/* Left Column - Mission and Purpose */}
            <div className="lg:col-span-8 space-y-8">
              {/* Mission and Purpose Card */}
              <div className="group bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500 hover:scale-[1.01]">
                <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
                  Mission & Purpose
                </h2>
                <div className="space-y-6">
                  <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                    Our association is the <span className="font-semibold text-blue-600">digital garden of the planet</span>, where flowers and pollinators become ambassadors of Earth&apos;s biological and cultural diversity.
                  </p>
                  <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                    We preserve the floral and pollinator memory of all nations, bringing together <span className="font-semibold text-purple-600">science, art, and education</span> in one digital space.
                  </p>
                  <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                    It&apos;s a platform that unites communities, institutions, and individuals through <span className="font-semibold text-indigo-600">the beauty and fragility of nature</span>.
                  </p>
                </div>
              </div>

              {/* Mission Card */}
              <div className="group bg-gradient-to-br from-blue-50/80 to-blue-100/40 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-blue-200/30 hover:shadow-3xl transition-all duration-500 hover:scale-[1.01]">
                <h3 className="text-2xl lg:text-3xl font-bold text-blue-700 mb-6">Mission</h3>
                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                  Connect communities, institutions, and individuals through the beauty and knowledge of flowers and pollinators, inspiring environmental awareness and fostering international cooperation to protect our natural heritage.
                </p>
              </div>
            </div>

            {/* Right Column - Purpose Details */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <div className="group bg-gradient-to-br from-purple-50/80 to-purple-100/40 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl border border-purple-200/30 hover:shadow-3xl transition-all duration-500 hover:scale-[1.01]">
                  <h3 className="text-2xl lg:text-3xl font-bold text-purple-700 mb-8">Purpose</h3>
                  <div className="space-y-6">
                    <div className="flex items-start group/item">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-3 mr-4 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300"></div>
                      <span className="text-lg text-gray-700 leading-relaxed">
                        Build a universal floral and pollinator archive for everyone
                      </span>
                    </div>
                    <div className="flex items-start group/item">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-3 mr-4 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300"></div>
                      <span className="text-lg text-gray-700 leading-relaxed">
                        Share environmental education through digital, artistic, and learning tools
                      </span>
                    </div>
                    <div className="flex items-start group/item">
                      <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full mt-3 mr-4 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300"></div>
                      <span className="text-lg text-gray-700 leading-relaxed">
                        Create a global community of guardians for biodiversity
                      </span>
                    </div>
                    <div className="flex items-start group/item">
                      <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full mt-3 mr-4 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300"></div>
                      <span className="text-lg text-gray-700 leading-relaxed">
                        Support transparency and positive impact, helping vulnerable communities
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Bottom Section - Full Width */}
            <section className="text-center">
              <div className="bg-gradient-to-r from-white/80 via-purple-50/80 to-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500 hover:scale-[1.01] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
                <div className="relative">
                  <blockquote className="text-xl lg:text-2xl text-gray-700 leading-relaxed italic font-medium">
                    &ldquo;AquaMundi is not just a website: it is a <span className="font-bold text-purple-600">living mantle</span> that unites science, culture, and hope, where each flower and pollinator remind us that the Earth blossoms in <span className="font-bold text-cyan-600">diversity</span>.&rdquo;
                  </blockquote>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
