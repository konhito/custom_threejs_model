import Navigation from "../../components/Navigation";

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
          </div>
        </div>
      </div>
    </div>
  );
}
