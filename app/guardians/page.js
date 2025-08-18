import Navigation from "../../components/Navigation";

export default function GuardiansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
      <Navigation />
      
      <div className="pt-20 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Guardians
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
