"use client";
import { useState, useEffect } from "react";
import Navigation from "../../components/Navigation";
import { generateStructuredData } from "../../lib/seo";
import { Mail, Heart, BookOpen, MapPin, GraduationCap, Sparkles, MessageCircle } from "lucide-react";

export default function AloneWithAuthorPage() {
  const [language, setLanguage] = useState('en');

  // Auto-detect language
  useEffect(() => {
    const storedLanguage = localStorage.getItem('nahiara_language');
    if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'es')) {
      setLanguage(storedLanguage);
    } else {
      const browserLang = navigator.language || navigator.languages?.[0] || 'en';
      const primaryLang = browserLang.split('-')[0].toLowerCase();
      setLanguage(primaryLang === 'es' ? 'es' : 'en');
    }
  }, []);

  const content = {
    en: {
      title: "Alone with the Author",
      subtitle: "A space for authentic connection",
      intro: {
        paragraph1: "There are moments when written words are not enough.",
        paragraph2: "This space was born for those who wish to look beyond the book, the game, or the flower.",
        paragraph3: "Here, you can speak directly with me — without intermediaries, without filters — about what inspired, moved, or even disturbed you within the Nahiara Universe.",
        paragraph4: "You may write to share an idea, a criticism, a doubt, or a simple curiosity.",
        paragraph5: "Every sincere voice is welcome, even those that question.",
        paragraph6: "Because Nahiara was never meant to be fully understood — it was meant to bloom in every authentic conversation.",
        closing: "Thank you for daring to step in.",
        signature: "– Matías González",
        role: "Creator of the Nahiara Universe"
      },
      sections: {
        birthplace: {
          title: "Where I Was Born",
          description: "The place that first shaped my perspective"
        },
        childhood: {
          title: "My Childhood",
          description: "The early moments that shaped my imagination"
        },
        education: {
          title: "My Education",
          description: "The journey of learning and discovery"
        },
        freeTime: {
          title: "How I Spent My Free Time",
          description: "The moments that fueled my creativity"
        },
        inspiration: {
          title: "What Inspired Me",
          description: "The sources of creativity behind Nahiara"
        }
      },
      contact: {
        title: "Write to Me",
        description: "Share your thoughts, questions, or simply connect",
        email: "partnerships@asociacionnahiara.org",
        button: "Send Message"
      }
    },
    es: {
      title: "Solo con el Autor",
      subtitle: "Un espacio para la conexión auténtica",
      intro: {
        paragraph1: "Hay momentos en los que las palabras escritas no son suficientes.",
        paragraph2: "Este espacio nació para aquellos que desean mirar más allá del libro, el juego o la flor.",
        paragraph3: "Aquí, puedes hablar directamente conmigo — sin intermediarios, sin filtros — sobre lo que te inspiró, conmovió o incluso perturbó dentro del Universo Nahiara.",
        paragraph4: "Puedes escribir para compartir una idea, una crítica, una duda o una simple curiosidad.",
        paragraph5: "Toda voz sincera es bienvenida, incluso aquellas que cuestionan.",
        paragraph6: "Porque Nahiara nunca fue pensado para ser completamente entendido — fue pensado para florecer en cada conversación auténtica.",
        closing: "Gracias por atreverte a entrar.",
        signature: "– Matías González",
        role: "Creador del Universo Nahiara"
      },
      sections: {
        birthplace: {
          title: "Donde Nací",
          description: "El lugar que primero moldeó mi perspectiva"
        },
        childhood: {
          title: "Mi Infancia",
          description: "Los primeros momentos que moldearon mi imaginación"
        },
        education: {
          title: "Mi Educación",
          description: "El viaje del aprendizaje y el descubrimiento"
        },
        freeTime: {
          title: "Cómo Pasaba Mi Tiempo Libre",
          description: "Los momentos que alimentaron mi creatividad"
        },
        inspiration: {
          title: "Lo Que Me Inspiró",
          description: "Las fuentes de creatividad detrás de Nahiara"
        }
      },
      contact: {
        title: "Escríbeme",
        description: "Comparte tus pensamientos, preguntas o simplemente conecta",
        email: "partnerships@asociacionnahiara.org",
        button: "Enviar Mensaje"
      }
    }
  };

  const currentContent = content[language];

  // Generate structured data
  const structuredData = generateStructuredData({
    type: "ProfilePage",
    name: "Alone with the Author - Matías González",
    description: currentContent.intro.paragraph3,
    url: "/alone-with-the-author",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: currentContent.title, url: "/alone-with-the-author" }
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

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-full blur-3xl"></div>
        </div>

        <Navigation />

        {/* Language Toggle */}
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg border border-green-200">
            <button
              onClick={() => {
                setLanguage('en');
                localStorage.setItem('nahiara_language', 'en');
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                language === 'en'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-500'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => {
                setLanguage('es');
                localStorage.setItem('nahiara_language', 'es');
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                language === 'es'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-500'
              }`}
            >
              ES
            </button>
          </div>
        </div>

        <main className="relative pt-20 px-4 lg:pr-24 lg:pl-8 pb-16">
          <div className="max-w-5xl mx-auto">
            {/* Hero Section */}
            <header className="text-center mb-16">
              <div className="inline-block mb-6">
                <span className="text-6xl">🌸</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 leading-tight" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {currentContent.title}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed italic" style={{ fontFamily: 'Crimson Text, serif' }}>
                {currentContent.subtitle}
              </p>
            </header>

            {/* Main Introduction Card */}
            <div className="bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/50 mb-12">
              <div className="space-y-6 text-lg lg:text-xl text-gray-700 leading-relaxed" style={{ fontFamily: 'Crimson Text, serif' }}>
                <p className="text-2xl lg:text-3xl font-semibold text-gray-800 italic">
                  {currentContent.intro.paragraph1}
                </p>
                <p>{currentContent.intro.paragraph2}</p>
                <p className="font-medium text-gray-800">
                  {currentContent.intro.paragraph3}
                </p>
                <p>{currentContent.intro.paragraph4}</p>
                <p className="italic text-gray-600">
                  {currentContent.intro.paragraph5}
                </p>
                <p className="text-xl font-semibold text-green-700">
                  {currentContent.intro.paragraph6}
                </p>
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-lg text-gray-600 mb-2">{currentContent.intro.closing}</p>
                  <p className="text-xl font-bold text-gray-900">{currentContent.intro.signature}</p>
                  <p className="text-sm text-gray-500 italic">{currentContent.intro.role}</p>
                </div>
              </div>
            </div>

            {/* Image Sections */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Birthplace */}
              <div className="bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-800">{currentContent.sections.birthplace.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">{currentContent.sections.birthplace.description}</p>
                <div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center border-2 border-dashed border-green-300">
                  <span className="text-gray-400 text-sm">Image placeholder</span>
                </div>
              </div>

              {/* Childhood */}
              <div className="bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-pink-600" />
                  <h3 className="text-xl font-bold text-gray-800">{currentContent.sections.childhood.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">{currentContent.sections.childhood.description}</p>
                <div className="aspect-video bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg flex items-center justify-center border-2 border-dashed border-pink-300">
                  <span className="text-gray-400 text-sm">Image placeholder</span>
                </div>
              </div>

              {/* Education */}
              <div className="bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-800">{currentContent.sections.education.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">{currentContent.sections.education.description}</p>
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300">
                  <span className="text-gray-400 text-sm">Image placeholder</span>
                </div>
              </div>

              {/* Free Time */}
              <div className="bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-800">{currentContent.sections.freeTime.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">{currentContent.sections.freeTime.description}</p>
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-300">
                  <span className="text-gray-400 text-sm">Image placeholder</span>
                </div>
              </div>
            </div>

            {/* Inspiration Section - Full Width */}
            <div className="bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl rounded-2xl p-8 lg:p-12 shadow-xl border border-white/50 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-yellow-600" />
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800">{currentContent.sections.inspiration.title}</h3>
              </div>
              <p className="text-lg text-gray-600 mb-6">{currentContent.sections.inspiration.description}</p>
              <div className="aspect-video bg-gradient-to-br from-yellow-100 to-amber-100 rounded-lg flex items-center justify-center border-2 border-dashed border-yellow-300">
                <span className="text-gray-400">Image placeholder</span>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-br from-green-50/90 to-emerald-50/60 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-green-200/50">
              <div className="text-center mb-8">
                <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentContent.contact.title}</h2>
                <p className="text-lg text-gray-600">{currentContent.contact.description}</p>
              </div>
              <div className="text-center">
                <a
                  href={`mailto:${currentContent.contact.email}?subject=${encodeURIComponent(language === 'en' ? 'Message to Matías González - Nahiara Universe' : 'Mensaje para Matías González - Universo Nahiara')}`}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Mail className="w-5 h-5" />
                  {currentContent.contact.button}
                </a>
                <p className="mt-4 text-sm text-gray-500">
                  {currentContent.contact.email}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

