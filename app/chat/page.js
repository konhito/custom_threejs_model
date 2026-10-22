import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import AraihanChat from "../../components/AraihanChat";
import enMessages from "../../messages/en.json";
import ChatPageContent from "./ChatPageContent";

export const metadata = {
  title: enMessages.chatPage.title,
  description: enMessages.chatPage.metadataDescription,
};

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-[#f6f8f4] text-[#1e3428]">
      <Navigation />
      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <ChatPageContent />
        <div className="max-w-3xl">
          <AraihanChat />
        </div>
      </main>
      <Footer />
    </div>
  );
}
