"use client";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, TrendingDown, AlertTriangle, Globe, Heart, Rotate3D } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Pollinator3D from "../../../components/Pollinator3D";

// Enhanced 3D Model Viewer Component
function Pollinator3DViewer({ pollinator, onClose }) {
  const [viewMode, setViewMode] = useState("3d"); // "3d" or "glb"

  // Determine if we should use GLB model or procedural 3D
  const hasGLBModel = pollinator.modelPath && pollinator.modelPath !== "/lotus.glb" && pollinator.modelPath !== "/Globe.glb" && pollinator.modelPath !== "/Globe1.glb";
  
  // Map pollinator types to our procedural 3D types
  const getPollinatorType = (name, scientificName) => {
    const lowerName = name.toLowerCase();
    const lowerScientific = scientificName.toLowerCase();
    
    if (lowerName.includes("bee") || lowerScientific.includes("apis") || lowerScientific.includes("bombus")) {
      return "bee";
    } else if (lowerName.includes("butterfly") || lowerName.includes("moth") || lowerScientific.includes("danaus") || lowerScientific.includes("papilionidae")) {
      return "butterfly";
    } else if (lowerName.includes("hummingbird") || lowerName.includes("sunbird") || lowerScientific.includes("archilochus") || lowerScientific.includes("nectariniidae")) {
      return "hummingbird";
    } else if (lowerName.includes("bat") || lowerScientific.includes("leptonycteris")) {
      return "bat";
    } else {
      return "bee"; // Default fallback
    }
  };

  const pollinatorType = getPollinatorType(pollinator.name, pollinator.scientificName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-white/20">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
          >
            <span className="text-xl">×</span>
          </button>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {pollinator.name} - 3D View
            </h2>
            <p className="text-gray-600 mb-4">{pollinator.scientificName}</p>
            
            {/* View Mode Toggle */}
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setViewMode("3d")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === "3d" 
                    ? "bg-amber-500 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Procedural 3D
              </button>
              {hasGLBModel && (
                <button
                  onClick={() => setViewMode("glb")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === "glb" 
                      ? "bg-amber-500 text-white" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  GLB Model
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3D Model Viewer */}
        <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 h-96">
          {viewMode === "3d" ? (
            <Pollinator3D 
              type={pollinatorType} 
              size={1.2} 
              autoRotate={true}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Rotate3D className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">
                  GLB Model Viewer
                </p>
                <p className="text-sm text-gray-500">
                  This pollinator uses a procedural 3D model for now.
                </p>
                <p className="text-sm text-gray-500">
                  GLB models will be added as they become available.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pollinator Information */}
        <div className="p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
              <p className="text-gray-700 text-sm">{pollinator.description}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Region</h4>
              <p className="text-gray-700 text-sm">{pollinator.region}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PollinatorsGalleryPage() {
  const [selected3DModel, setSelected3DModel] = useState(null);

  const pollinators = {
    bees: [
      {
        name: "Honeybee",
        scientificName: "Apis mellifera",
        region: "Global",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/bee-on-yellow-flower",
        description: "Essential pollinator responsible for pollinating many of the world's food crops."
      },
      {
        name: "Bumblebee",
        scientificName: "Bombus terrestris",
        region: "Europe, Asia, North America",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/bumblebee-on-purple-flower",
        description: "Large, fuzzy bees that are excellent pollinators for many wildflowers and crops."
      }
    ],
    birds: [
      {
        name: "Ruby-throated Hummingbird",
        scientificName: "Archilochus colubris",
        region: "North America",
        image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/hummingbird-in-flight",
        description: "Tiny, fast-flying birds that pollinate tubular flowers with their long beaks."
      },
      {
        name: "Sunbird",
        scientificName: "Nectariniidae",
        region: "Africa, Asia, Australia",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/sunbird-on-branch",
        description: "Colorful nectar-feeding birds that pollinate many tropical flowers."
      }
    ],
    butterflies: [
      {
        name: "Monarch Butterfly",
        scientificName: "Danaus plexippus",
        region: "North America",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/monarch-butterfly",
        description: "Famous migratory butterflies that pollinate milkweed and other wildflowers."
      },
      {
        name: "Swallowtail Butterfly",
        scientificName: "Papilionidae",
        region: "Global",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/swallowtail-butterfly",
        description: "Large, colorful butterflies with distinctive tail-like extensions on their wings."
      }
    ],
    bats: [
      {
        name: "Lesser Long-nosed Bat",
        scientificName: "Leptonycteris yerbabuenae",
        region: "Mexico, Southwestern US",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/bat-in-flight",
        description: "Nocturnal pollinators that feed on nectar and pollinate night-blooming flowers."
      }
    ],
    beetles: [
      {
        name: "Flower Beetle",
        scientificName: "Cetoniinae",
        region: "Global",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/flower-beetle",
        description: "Hard-shelled insects that pollinate many ancient flowering plants."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <Navigation />
      
      <div className="pt-20 px-4 lg:pr-24 lg:pl-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/pollinators"
              className="inline-flex items-center space-x-2 text-amber-600 hover:text-amber-700 transition-colors duration-200 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to pollinators</span>
            </Link>
            
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Pollinators gallery
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl">
              Discover the invisible guardians of life on Earth. This gallery showcases the diverse pollinators that keep our planet&apos;s biodiversity in balance, from tiny bees to magnificent hummingbirds.
            </p>
          </div>

          {/* Crisis Infographic - Condensed */}
          <section className="mb-16 bg-gradient-to-r from-red-50 to-orange-100 rounded-3xl p-8 border border-red-200">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-red-800 mb-4">
                Pollinator decline (2016–2025)
              </h2>
              <p className="text-lg text-red-700">
                The urgent reality we must address
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 2016 Stats */}
              <div className="bg-white/80 rounded-2xl p-6 border border-red-200 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-blue-800 mb-2">2016 IPBES report</h3>
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
                <h3 className="text-lg font-bold text-red-800 mb-2">2025 crisis</h3>
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
                <h3 className="text-lg font-bold text-orange-800 mb-2">US bee colonies</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <div className="text-2xl font-bold text-orange-600">60-70%</div>
                    <div className="text-orange-700">Annual colony losses</div>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-2">
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
                <h3 className="text-lg font-bold text-amber-800 mb-2">Urgent action</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-amber-100 rounded-lg p-2">
                    <div className="text-lg font-bold text-amber-600">Next decade</div>
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
                  <PollinatorCard key={index} pollinator={pollinator} onView3D={setSelected3DModel} />
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
                  <PollinatorCard key={index} pollinator={pollinator} onView3D={setSelected3DModel} />
                ))}
              </div>
            </section>

            {/* Butterflies Section */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-8 h-8 bg-purple-400 rounded-full mr-3 flex items-center justify-center text-purple-800 font-bold text-sm">🦋</span>
                Butterflies & moths
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pollinators.butterflies.map((pollinator, index) => (
                  <PollinatorCard key={index} pollinator={pollinator} onView3D={setSelected3DModel} />
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
                  <PollinatorCard key={index} pollinator={pollinator} onView3D={setSelected3DModel} />
                ))}
              </div>
            </section>

            {/* Beetles Section */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-8 h-8 bg-green-400 rounded-full mr-3 flex items-center justify-center text-green-800 font-bold text-sm">🪲</span>
                Beetles & other pollinators
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pollinators.beetles.map((pollinator, index) => (
                  <PollinatorCard key={index} pollinator={pollinator} onView3D={setSelected3DModel} />
                ))}
              </div>
            </section>
          </div>

          {/* Future Vision - Condensed */}
          <div className="mt-20 p-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border border-amber-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Future vision</h3>
            <p className="text-gray-700 mb-4">
              This gallery is the first step towards an interactive 3D pollinator experience. Soon, you&apos;ll be able to explore these magnificent creatures in three dimensions, discovering their connections with national flowers and understanding their vital role in our ecosystem.
            </p>
            <p className="text-sm text-gray-600">
              All images are sourced from free-to-use platforms and are properly attributed. This collection will continue to grow as we build our living archive of Earth&apos;s pollinators.
            </p>
          </div>
        </div>
      </div>

      {/* 3D Model Viewer Modal */}
      {selected3DModel && (
        <Pollinator3DViewer
          pollinator={selected3DModel}
          onClose={() => setSelected3DModel(null)}
        />
      )}
      
      <Footer />
    </div>
  );
}

function PollinatorCard({ pollinator, onView3D }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <Image 
          src={pollinator.image} 
          alt={pollinator.name}
          width={400}
          height={192}
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
        
        <p className="text-sm text-gray-600 mb-4">
          {pollinator.description}
        </p>
        
        <div className="flex items-center justify-between">
          <a 
            href={pollinator.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-amber-600 hover:text-amber-700 text-sm transition-colors duration-200"
          >
            <span>View source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          
          <button
            onClick={() => onView3D(pollinator)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <Rotate3D className="w-4 h-4" />
            <span>View 3D</span>
          </button>
        </div>
      </div>
    </div>
  );
}
