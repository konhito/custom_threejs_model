import Navigation from "../../components/Navigation";

export default function ImpactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      <Navigation />
      
      <div className="pt-20 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 bg-clip-text text-transparent mb-6">
              Impact & Transparency
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
