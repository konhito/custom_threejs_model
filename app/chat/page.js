import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import AraihanChat from "../../components/AraihanChat";

export const metadata = {
  title: "Talk with Araihan",
  description: "Meet Araihan, Nahiara's faithful squire and guide to the world of flowers and pollinators.",
};

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-[#f6f8f4] text-[#1e3428]">
      <Navigation />
      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <header className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold text-[#2f6b4f]">A companion for the Nahiara Universe</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Talk with Araihan</h1>
          <p className="mt-4 text-lg leading-relaxed text-[#496352]">Ask about flowers, pollinators, the Flower Archive, the book, or the game. Araihan will guide you through the world he protects.</p>
        </header>
        <div className="max-w-3xl">
          <AraihanChat />
        </div>
      </main>
      <Footer />
    </div>
  );
}
