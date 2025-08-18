import Navigation from "../../components/Navigation";

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <Navigation />
      
      <div className="pt-20 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Locked Portal */}
          <div className="mb-16">
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-6">
              Sacred Portal
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
