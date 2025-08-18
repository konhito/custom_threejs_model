import Navigation from "../../components/Navigation";

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <Navigation />
      
      <div className="pt-20 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Education & Community
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
