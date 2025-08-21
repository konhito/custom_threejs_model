import Navigation from "../../../components/Navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, TrendingDown, AlertTriangle, Globe, Heart } from "lucide-react";

// Simplified Chart Component for Gallery
function SimplePollinatorChart() {
  const data = [
    { label: "Wild flowering plants (2016)", percentage: 90, color: "from-blue-500 to-blue-600" },
    { label: "Food crops (2016)", percentage: 75, color: "from-blue-500 to-blue-600" },
    { label: "Insects threatened (2025)", percentage: 40, color: "from-red-500 to-red-600" },
    { label: "Annual decline (per decade)", percentage: 9, color: "from-red-500 to-red-600" },
    { label: "US bee losses (2025)", percentage: 65, color: "from-orange-500 to-orange-600" },
    { label: "Native pollinators at risk", percentage: 22, color: "from-orange-500 to-orange-600" }
  ];

  return (
    <div className="bg-white/90 rounded-2xl p-4 border border-gray-200 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
        Pollinator Decline - Key Figures
      </h3>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-32 text-xs text-gray-700 flex-shrink-0">
              {item.label}
            </div>
            <div className="flex-1 relative">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <div className="absolute -top-1 -right-2 w-6 h-4 bg-white border border-gray-300 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700">{item.percentage}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
            <span>2016</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-red-600 rounded"></div>
            <span>2025</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded"></div>
            <span>US</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PollinatorsGalleryPage() {
  const pollinators = {
    bees: [
      {
        name: "Honeybee",
        scientificName: "Apis mellifera",
        region: "Global",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/bee-on-yellow-flower"
      },
      {
        name: "Bumblebee",
        scientificName: "Bombus terrestris",
        region: "Europe, Asia, North America",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/bumblebee-on-purple-flower"
      }
    ],
    birds: [
      {
        name: "Ruby-throated Hummingbird",
        scientificName: "Archilochus colubris",
        region: "North America",
        image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/hummingbird-in-flight"
      },
      {
        name: "Sunbird",
        scientificName: "Nectariniidae",
        region: "Africa, Asia, Australia",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/sunbird-on-branch"
      }
    ],
    butterflies: [
      {
        name: "Monarch Butterfly",
        scientificName: "Danaus plexippus",
        region: "North America",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/monarch-butterfly"
      },
      {
        name: "Swallowtail Butterfly",
        scientificName: "Papilionidae",
        region: "Global",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/swallowtail-butterfly"
      }
    ],
    bats: [
      {
        name: "Lesser Long-nosed Bat",
        scientificName: "Leptonycteris yerbabuenae",
        region: "Mexico, Southwestern US",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/bat-in-flight"
      }
    ],
    beetles: [
      {
        name: "Flower Beetle",
        scientificName: "Cetoniinae",
        region: "Global",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/flower-beetle"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <Navigation />
      
      <div className="pt-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/pollinators"
              className="inline-flex items-center space-x-2 text-amber-600 hover:text-amber-700 transition-colors duration-200 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Pollinators</span>
            </Link>
            
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Pollinators Gallery
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl">
              Discover the invisible guardians of life on Earth. This gallery showcases the diverse pollinators that keep our planet's biodiversity in balance, from tiny bees to magnificent hummingbirds.
            </p>
          </div>

          {/* Crisis Infographic */}
          <section className="mb-16 bg-gradient-to-r from-red-50 to-orange-100 rounded-3xl p-8 border border-red-200">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-red-800 mb-4">
                Pollinator Decline (2016–2025)
              </h2>
              <p className="text-lg text-red-700">
                The Urgent Reality We Must Address
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 2016 Stats */}
              <div className="bg-white/80 rounded-2xl p-6 border border-red-200 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-blue-800 mb-2">2016 IPBES Report</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <div className="text-2xl font-bold text-blue-600">90%</div>
                    <div className="text-blue-700">Wild flowering plants depend on pollinators</div>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-2">
                    <div className="text-2xl font-bold text-blue-600">75%</div>
                    <div className="text-blue-700">Global food crops require pollination</div>
                  </div>
                </div>
              </div>

              {/* 2025 Crisis */}
              <div className="bg-white/80 rounded-2xl p-6 border border-red-300 text-center">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-red-800 mb-2">2025 Crisis</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-red-100 rounded-lg p-2">
                    <div className="text-2xl font-bold text-red-600">40%</div>
                    <div className="text-red-700">Pollinating insects highly threatened</div>
                  </div>
                  <div className="bg-red-100 rounded-lg p-2">
                    <div className="text-2xl font-bold text-red-600">9%</div>
                    <div className="text-red-700">Annual insect population decline</div>
                  </div>
                </div>
              </div>

              {/* US Bee Losses */}
              <div className="bg-white/80 rounded-2xl p-6 border border-orange-300 text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-orange-800 mb-2">US Bee Colonies</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-orange-100 rounded-lg p-2">
                    <div className="text-2xl font-bold text-orange-600">60-70%</div>
                    <div className="text-orange-700">Annual colony losses</div>
                  </div>
                  <div className="bg-orange-100 rounded-lg p-2">
                    <div className="text-2xl font-bold text-orange-600">22%</div>
                    <div className="text-orange-700">Native pollinators at risk</div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 border border-amber-300 text-center">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-amber-800 mb-2">Urgent Action</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-amber-100 rounded-lg p-2">
                    <div className="text-lg font-bold text-amber-600">Next Decade</div>
                    <div className="text-amber-700">Decides restoration or collapse</div>
                  </div>
                  <div className="bg-amber-100 rounded-lg p-2">
                    <div className="text-lg font-bold text-amber-600">Global</div>
                    <div className="text-amber-700">Coordination required</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Visual Chart Section */}
          <section className="mb-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-6 border border-gray-200">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  The Numbers Don't Lie
                </h2>
                <p className="text-gray-700 text-sm">
                  Visual representation of the pollinator crisis from 2016 to 2025
                </p>
              </div>
              
              <SimplePollinatorChart />
            </div>
          </section>

          {/* Gallery Grid */}
          <div className="space-y-16">
            {/* Bees Section */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-8 h-8 bg-yellow-400 rounded-full mr-3 flex items-center justify-center text-yellow-800 font-bold text-sm">🐝</span>
                Bees
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pollinators.bees.map((pollinator, index) => (
                  <PollinatorCard key={index} pollinator={pollinator} />
                ))}
              </div>
            </section>

            {/* Birds Section */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-8 h-8 bg-blue-400 rounded-full mr-3 flex items-center justify-center text-blue-800 font-bold text-sm">🐦</span>
                Birds
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pollinators.birds.map((pollinator, index) => (
                  <PollinatorCard key={index} pollinator={pollinator} />
                ))}
              </div>
            </section>

            {/* Butterflies Section */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-8 h-8 bg-purple-400 rounded-full mr-3 flex items-center justify-center text-purple-800 font-bold text-sm">🦋</span>
                Butterflies & Moths
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pollinators.butterflies.map((pollinator, index) => (
                  <PollinatorCard key={index} pollinator={pollinator} />
                ))}
              </div>
            </section>

            {/* Bats Section */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-8 h-8 bg-gray-400 rounded-full mr-3 flex items-center justify-center text-gray-800 font-bold text-sm">🦇</span>
                Bats
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pollinators.bats.map((pollinator, index) => (
                  <PollinatorCard key={index} pollinator={pollinator} />
                ))}
              </div>
            </section>

            {/* Beetles Section */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-8 h-8 bg-green-400 rounded-full mr-3 flex items-center justify-center text-green-800 font-bold text-sm">🪲</span>
                Beetles & Other Pollinators
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pollinators.beetles.map((pollinator, index) => (
                  <PollinatorCard key={index} pollinator={pollinator} />
                ))}
              </div>
            </section>
          </div>

          {/* Future Vision */}
          <div className="mt-20 p-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border border-amber-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Future Vision</h3>
            <p className="text-gray-700 mb-4">
              This gallery is the first step towards an interactive 3D pollinator experience. Soon, you'll be able to explore these magnificent creatures in three dimensions, discovering their connections with national flowers and understanding their vital role in our ecosystem.
            </p>
            <p className="text-sm text-gray-600">
              All images are sourced from free-to-use platforms and are properly attributed. This collection will continue to grow as we build our living archive of Earth's pollinators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PollinatorCard({ pollinator }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img 
          src={pollinator.image} 
          alt={pollinator.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {pollinator.imageAttribution}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{pollinator.name}</h3>
        <p className="text-sm text-gray-600 italic mb-2">{pollinator.scientificName}</p>
        <p className="text-sm text-gray-700 mb-4">{pollinator.region}</p>
        
        <div className="text-xs text-gray-500 italic mb-3">
          "Poetic caption coming soon..."
        </div>
        
        <a 
          href={pollinator.imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 text-amber-600 hover:text-amber-700 text-sm transition-colors duration-200"
        >
          <span>View source</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
