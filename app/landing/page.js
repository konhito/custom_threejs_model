"use client";
import { useState, useEffect, Suspense } from "react";
import { Download, Mail, MessageCircle, ExternalLink, Globe, BookOpen, Gamepad2, Flower, Bot, ArrowRight, Shield, X, Info, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

// Simple Logo Component (replaced 3D version to fix build issues)
function Logo3D() {
  return (
    <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto relative flex items-center justify-center">
      <Image
        src="/logo.png"
        alt="Nahiara Association Logo"
        width={192}
        height={192}
        className="object-contain"
        priority
      />
    </div>
  );
}

// Landing Content Component
function LandingContent() {
  const [language, setLanguage] = useState('en');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
    subject: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showContactModal) {
        setShowContactModal(false);
      }
    };

    if (showContactModal) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [showContactModal]);

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(contactForm.subject || (language === 'en' ? 'Contact from International Association for the Defense of Flowers Website' : 'Contacto desde el sitio web de la Asociación Internacional para la Defensa de las Flores'));
      const body = encodeURIComponent(
        `${language === 'en' ? 'Name' : 'Nombre'}: ${contactForm.name}\n` +
        `${language === 'en' ? 'Email' : 'Correo'}: ${contactForm.email}\n\n` +
        `${language === 'en' ? 'Message' : 'Mensaje'}: ${contactForm.message}`
      );
      
      // Open email client
      window.location.href = `mailto:${currentContent.contact.email}?subject=${subject}&body=${body}`;
      
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowContactModal(false);
      }, 2000);
      
      // Reset form
      setContactForm({ name: '', email: '', message: '', subject: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-detect language based on browser settings
  useEffect(() => {
    const detectLanguage = () => {
      try {
        // Get browser language
        const browserLang = navigator.language || navigator.languages?.[0] || 'en';
        
        // Extract primary language code (e.g., 'es' from 'es-ES')
        const primaryLang = browserLang.split('-')[0].toLowerCase();
        
        // Check if Spanish is detected
        if (primaryLang === 'es') {
          setLanguage('es');
        } else {
          // Default to English for all other languages
          setLanguage('en');
        }
        
        // Store language preference in localStorage
        localStorage.setItem('nahiara_language', primaryLang === 'es' ? 'es' : 'en');
      } catch (error) {
        console.error('Language detection failed:', error);
        // Fallback to English if detection fails
        setLanguage('en');
      }
    };

    // Check if language is already stored in localStorage
    const storedLanguage = localStorage.getItem('nahiara_language');
    if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'es')) {
      setLanguage(storedLanguage);
    } else {
      // Auto-detect if no stored preference
      detectLanguage();
    }
  }, []);

  const content = {
    en: {
      hero: {
        title: "International Association for the Defense of Flowers",
        subtitle: "Proveneya & Nahiara",
        tagline: "\"Where humanity blooms, nature is reborn.\" 🌸",
        cta: "Contact us"
      },
      description: "A literary saga and transmedia ecosystem that unites 195 national flowers and their pollinators through innovative formats: an illustrated book, an engaging card game, a comprehensive 3D floral archive, and interactive robotic exhibitions.",
      formats: {
        title: "Our Formats",
        book: {
          title: "Nahiara & the Guardians of the Flowers",
          description: "An illustrated literary journey through the world's most beautiful flowers"
        },
        game: {
          title: "Illustrated Card Game",
          description: "Interactive gameplay celebrating global floral diversity"
        },
        archive: {
          title: "3D Floral Archive",
          description: "National flowers in high-quality glTF/STL formats"
        },
        exhibition: {
          title: "Robotic Pollinators & Exhibitions",
          description: "Museographic experiences bringing flowers to life"
        }
      },
      vision: {
        title: "International Vision",
        text: "Connecting cultures through the universal language of flowers, raising awareness about biodiversity, and fostering institutional and editorial collaborations worldwide."
      },
      contact: {
        title: "Get in Touch",
        email: "partnerships@asociacionnahiara.org",
        phone: "+34 625 50 18 67",
        location: "FLOR_∞ - 28.1235° N, 15.4363° W - Gran Canaria"
      },
      footer: {
        copyright: "© 2025 International Association for the Defense of Flowers Proveneya & Nahiara",
        association: "International Association for the defence of flowers Proveneya & Nahiara"
      }
    },
    es: {
      hero: {
        title: "Asociación Internacional para la Defensa de las Flores",
        subtitle: "Proveneya & Nahiara",
        tagline: "\"Donde florece la humanidad, renace la naturaleza.\" 🌸",
        cta: "Contáctanos"
      },
      description: "Una saga literaria y ecosistema transmedia que une 195 flores nacionales y sus polinizadores a través de formatos innovadores: un libro ilustrado, un juego de cartas envolvente, un archivo floral 3D integral y exposiciones robóticas interactivas.",
      formats: {
        title: "Nuestros Formatos",
        book: {
          title: "Nahiara y los Guardianes de las Flores",
          description: "Un viaje literario ilustrado por las flores más hermosas del mundo"
        },
        game: {
          title: "Juego de Cartas Ilustrado",
          description: "Jugabilidad interactiva celebrando la diversidad floral global"
        },
        archive: {
          title: "Archivo Floral 3D",
          description: "Flores nacionales en formatos glTF/STL de alta calidad"
        },
        exhibition: {
          title: "Polinizadores Robóticos y Exposiciones",
          description: "Experiencias museográficas que dan vida a las flores"
        }
      },
      vision: {
        title: "Visión Internacional",
        text: "Conectando culturas a través del lenguaje universal de las flores, creando conciencia sobre la biodiversidad y fomentando colaboraciones institucionales y editoriales en todo el mundo."
      },
      contact: {
        title: "Ponte en Contacto",
        email: "partnerships@asociacionnahiara.org",
        phone: "+34 625 50 18 67",
        location: "FLOR_∞ - 28.1235° N, 15.4363° W - Gran Canaria"
      },
      footer: {
        copyright: "© 2025 Asociación Internacional para la Defensa de las Flores Proveneya & Nahiara",
        association: "Asociación Internacional para la defensa de las flores Proveneya & Nahiara"
      }
    }
  };

  const currentContent = content[language];


  const handlePressKitDownload = () => {
    // Create a simple press kit content
    const pressKitContent = `
# International Association for the Defense of Flowers - Press Kit
## Proveneya & Nahiara

### Project Overview
${currentContent.description}

### Formats
- 📖 ${currentContent.formats.book.title}
- 🃏 ${currentContent.formats.game.title}
- 🌸 ${currentContent.formats.archive.title}
- 🤖 ${currentContent.formats.exhibition.title}

### Contact
Email: ${currentContent.contact.email}
WhatsApp: ${currentContent.contact.phone}
Location: ${currentContent.contact.location}

### Vision
${currentContent.vision.text}
    `;
    
    const blob = new Blob([pressKitContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AquaMundi_PressKit_${language.toUpperCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Exo+2:wght@300;400;500;600;700;800&family=Josefin+Sans:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=Comfortaa:wght@300;400;500;600;700&family=Fredoka+One:wght@400&family=Righteous:wght@400&family=Bangers:wght@400&family=Creepster:wght@400&family=Rubik:wght@300;400;500;600;700;800&family=Karla:wght@300;400;500;600;700&family=Archivo:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div className="min-h-screen bg-white text-gray-900 relative" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Organic Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 bg-green-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-200 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-teal-200 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      {/* Header / Hero Section - Mobile First */}
      <section className="relative py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-4xl mx-auto">
          {/* Mobile-First Single Column Layout */}
          <div className="text-center">
            {/* 3D Logo - Centered */}
            <div className="mb-1 flex justify-center">
              <Logo3D key="main-logo" />
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight" style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.02em' }}>
              {currentContent.hero.title}
            </h1>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl text-green-700 mb-3 md:mb-4 font-medium" style={{ fontFamily: 'Exo 2, sans-serif', letterSpacing: '0.05em' }}>
              {currentContent.hero.subtitle}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed max-w-2xl mx-auto px-2" style={{ fontFamily: 'Crimson Text, serif', fontWeight: '400', fontStyle: 'italic' }}>
              {currentContent.hero.tagline}
            </p>
            
            {/* Mobile-First Buttons */}
            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              <a
                href="https://www.aquamundi.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 text-center"
                style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.05em', fontWeight: '400' }}
              >
                {language === 'en' ? 'Explore 3D Archive' : 'Explorar Archivo 3D'}
              </a>
              <button
                onClick={() => setShowContactModal(true)}
                className="px-6 py-3 border border-green-600 text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors duration-200"
                style={{ fontFamily: 'Comfortaa, cursive', letterSpacing: '0.02em', fontWeight: '500' }}
              >
                {currentContent.hero.cta}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Book Story Section - Mobile Optimized */}
      <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.05em' }}>
              {language === 'en' ? 'The Story Behind the Book' : 'La Historia Detrás del Libro'}
            </h2>
            <div className="w-16 h-1 bg-green-500 mx-auto"></div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 sm:p-6 border border-green-200">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto mb-4" style={{ fontFamily: 'Rubik, sans-serif', lineHeight: '1.7' }}>
              {language === 'en' 
                ? 'Nahiara & the Guardians of the Flowers is more than just a book—it\'s a gateway to a magical world where every national flower tells a story. Through this interactive digital experience, you can explore the 195 flowers that inspired the tale and discover the real-world connections between cultures, nature, and conservation.'
                : 'Nahiara y los Guardianes de las Flores es más que un libro—es una puerta de entrada a un mundo mágico donde cada flor nacional cuenta una historia. A través de esta experiencia digital interactiva, puedes explorar las 195 flores que inspiraron el cuento y descubrir las conexiones del mundo real entre culturas, naturaleza y conservación.'
              }
            </p>
            <div className="text-center">
              <div className="flex flex-wrap justify-center gap-2">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium" style={{ fontFamily: 'Fredoka One, cursive', fontWeight: '400' }}>
                  {language === 'en' ? '📚 Literary Saga' : '📚 Saga Literaria'}
                </span>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium" style={{ fontFamily: 'Fredoka One, cursive', fontWeight: '400' }}>
                  {language === 'en' ? '🌍 Global Impact' : '🌍 Impacto Global'}
                </span>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium" style={{ fontFamily: 'Fredoka One, cursive', fontWeight: '400' }}>
                  {language === 'en' ? '🌸 195 Flowers' : '🌸 195 Flores'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Experience Section - Mobile Optimized */}
      <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4" style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.05em' }}>
              {language === 'en' ? 'Continue Your Journey' : 'Continúa Tu Viaje'}
            </h2>
            <div className="w-16 h-1 bg-green-500 mx-auto"></div>
            <p className="text-base sm:text-lg text-gray-600 mt-4 max-w-2xl mx-auto" style={{ fontFamily: 'Karla, sans-serif' }}>
              {language === 'en' 
                ? 'The book is just the beginning. Explore the complete digital ecosystem of Nahiara\'s world.'
                : 'El libro es solo el comienzo. Explora el ecosistema digital completo del mundo de Nahiara.'
              }
            </p>
          </div>
          
          <div className="space-y-6">
            {/* 3D Archive - Primary Focus */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Archivo, sans-serif', letterSpacing: '0.02em' }}>
                    {language === 'en' ? 'Interactive 3D Archive' : 'Archivo 3D Interactivo'}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4" style={{ fontFamily: 'Manrope, sans-serif', lineHeight: '1.6' }}>
                    {language === 'en' 
                      ? 'Explore all 195 national flowers in stunning 3D detail. Click on any flower to learn about its cultural significance, conservation status, and role in Nahiara\'s story.'
                      : 'Explora las 195 flores nacionales en detalle 3D impresionante. Haz clic en cualquier flor para aprender sobre su significado cultural, estado de conservación y papel en la historia de Nahiara.'
                    }
                  </p>
                  <a
                    href="https://www.aquamundi.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                    style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.05em', fontWeight: '400' }}
                  >
                    {language === 'en' ? 'Start Exploring' : 'Comenzar a Explorar'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Book Details */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Archivo, sans-serif', letterSpacing: '0.02em' }}>
                    {language === 'en' ? 'The Complete Saga' : 'La Saga Completa'}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4" style={{ fontFamily: 'Manrope, sans-serif', lineHeight: '1.6' }}>
                    {language === 'en' 
                      ? 'Discover the full literary universe including the illustrated card game, robotic exhibitions, and educational resources that bring Nahiara\'s world to life.'
                      : 'Descubre el universo literario completo incluyendo el juego de cartas ilustrado, exhibiciones robóticas y recursos educativos que dan vida al mundo de Nahiara.'
                    }
                  </p>
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200"
                    style={{ fontFamily: 'Comfortaa, cursive', letterSpacing: '0.02em', fontWeight: '500' }}
                  >
                    {language === 'en' ? 'Learn More' : 'Saber Más'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              {language === 'en' ? 'Join the Global Community' : 'Únete a la Comunidad Global'}
            </h2>
            <div className="w-24 h-1 bg-green-500 mx-auto"></div>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 sm:p-6 md:p-8 border border-green-200">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto mb-4 md:mb-6 px-2" style={{ fontFamily: 'Source Sans Pro, sans-serif', lineHeight: '1.7' }}>
              {language === 'en' 
                ? 'You\'re now part of a growing community of readers, educators, and conservationists who believe in the power of storytelling to connect cultures and protect biodiversity. Share your experience, connect with other flower guardians, and help us spread Nahiara\'s message around the world.'
                : 'Ahora eres parte de una comunidad creciente de lectores, educadores y conservacionistas que creen en el poder de la narración para conectar culturas y proteger la biodiversidad. Comparte tu experiencia, conéctate con otros guardianes de flores y ayúdanos a difundir el mensaje de Nahiara por todo el mundo.'
              }
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                🌍 {language === 'en' ? 'Global Community' : 'Comunidad Global'}
              </span>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                📚 {language === 'en' ? 'Educational Impact' : 'Impacto Educativo'}
              </span>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                🌸 {language === 'en' ? 'Conservation Focus' : 'Enfoque en Conservación'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Share & Connect Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {language === 'en' ? 'Share Your Experience' : 'Comparte Tu Experiencia'}
          </h2>
          <div className="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
          <p className="text-base sm:text-lg text-gray-700 mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto px-2" style={{ fontFamily: 'Source Sans Pro, sans-serif', lineHeight: '1.7' }}>
            {language === 'en' 
              ? 'Help us spread Nahiara\'s message! Share your thoughts about the book, tag us in your posts, and connect with other readers around the world.'
              : '¡Ayúdanos a difundir el mensaje de Nahiara! Comparte tus pensamientos sobre el libro, etiquétanos en tus publicaciones y conéctate con otros lectores alrededor del mundo.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowContactModal(true)}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              {language === 'en' ? 'Get in Touch' : 'Ponte en Contacto'}
            </button>
            <button
              onClick={handlePressKitDownload}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <Download className="mr-2 w-5 h-5" />
              {language === 'en' ? 'Download Resources' : 'Descargar Recursos'}
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              {currentContent.contact.title}
            </h2>
            <div className="w-24 h-1 bg-green-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 shadow-sm border border-gray-200 text-center">
              <Mail className="w-8 h-8 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Email</h3>
              <a 
                href={`mailto:${currentContent.contact.email}`}
                className="text-gray-600 hover:text-gray-800 transition-colors text-sm notranslate"
                translate="no"
              >
                {currentContent.contact.email}
              </a>
            </div>
            
            <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 shadow-sm border border-gray-200 text-center">
              <svg className="w-8 h-8 mx-auto mb-4 text-green-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>WhatsApp</h3>
              <a 
                href={`https://wa.me/${currentContent.contact.phone.replace(/\s+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-green-600 transition-colors text-sm flex items-center justify-center gap-1 notranslate"
                translate="no"
              >
                {currentContent.contact.phone}
              </a>
            </div>
            
            <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 shadow-sm border border-gray-200 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Location</h3>
              <p className="text-gray-600 text-sm">
                {currentContent.contact.location}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6">
            <Image 
              src="/NahiaraLogo.png" 
              alt="International Association for the Defense of Flowers Proveneya & Nahiara Logo" 
              width={64}
              height={64}
              className="w-16 h-16 object-contain"
            />
          </div>
          <p className="text-gray-300 text-sm" style={{ fontFamily: 'Source Sans Pro, sans-serif' }}>{currentContent.footer.copyright}</p>
        </div>
      </footer>

      {/* Contact Modal */}
      {showContactModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowContactModal(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {language === 'en' ? 'Get in Touch' : 'Ponte en Contacto'}
              </h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-600 mb-6 text-center">
                {language === 'en' 
                  ? 'We\'d love to hear from you! Choose how you\'d like to get in touch:'
                  : '¡Nos encantaría saber de ti! Elige cómo te gustaría ponerte en contacto:'
                }
              </p>

              {/* Contact Form */}
              <form onSubmit={handleContactSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4 text-center">
                  {language === 'en' ? 'Send us a message' : 'Envíanos un mensaje'}
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'en' ? 'Name' : 'Nombre'} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={language === 'en' ? 'Your name' : 'Tu nombre'}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'en' ? 'Email' : 'Correo'} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={language === 'en' ? 'your@email.com' : 'tu@correo.com'}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'en' ? 'Subject' : 'Asunto'}
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={language === 'en' ? 'What is this about?' : '¿De qué se trata?'}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'en' ? 'Message' : 'Mensaje'} *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder={language === 'en' ? 'Tell us about your interest in the Association...' : 'Cuéntanos sobre tu interés en la Asociación...'}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting 
                      ? (language === 'en' ? 'Opening email...' : 'Abriendo correo...')
                      : (language === 'en' ? 'Send Message' : 'Enviar Mensaje')
                    }
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {language === 'en' ? 'OR' : 'O'}
                  </span>
                </div>
              </div>

              {/* Contact Options */}
              <div className="space-y-4">
                {/* Email Option */}
                <a
                  href={`mailto:${currentContent.contact.email}?subject=${encodeURIComponent(language === 'en' ? 'Contact from International Association for the Defense of Flowers Website' : 'Contacto desde el sitio web de la Asociación Internacional para la Defensa de las Flores')}&body=${encodeURIComponent(language === 'en' ? 'Hello,\n\nI\'m interested in learning more about the Association and the Nahiara project.\n\nBest regards,' : 'Hola,\n\nEstoy interesado en conocer más sobre la Asociación y el proyecto Nahiara.\n\nSaludos cordiales,')}`}
                  className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Mail className="w-6 h-6 text-green-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {language === 'en' ? 'Send Email' : 'Enviar Correo'}
                    </h4>
                    <p className="text-sm text-gray-600 notranslate" translate="no">{currentContent.contact.email}</p>
                  </div>
                </a>

                {/* WhatsApp Option */}
                <a
                  href={`https://wa.me/${currentContent.contact.phone.replace(/\s+/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <svg className="w-6 h-6 mr-4 text-green-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {language === 'en' ? 'WhatsApp' : 'WhatsApp'}
                    </h4>
                    <p className="text-sm text-gray-600 notranslate" translate="no">{currentContent.contact.phone}</p>
                  </div>
                </a>
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  {language === 'en' 
                    ? 'We typically respond within 24 hours. Thank you for your interest in International Association for the Defense of Flowers!'
                    : 'Normalmente respondemos en 24 horas. ¡Gracias por tu interés en la Asociación Internacional para la Defensa de las Flores!'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === 'en' ? 'Email Opened!' : '¡Correo Abierto!'}
            </h3>
            <p className="text-gray-600 text-sm">
              {language === 'en' 
                ? 'Your email client should now be open with a pre-filled message. Just hit send!'
                : 'Tu cliente de correo debería estar abierto con un mensaje pre-llenado. ¡Solo presiona enviar!'
              }
            </p>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

// Loading fallback component
function LandingLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          Loading...
        </h2>
        <p className="text-gray-600">Please wait while we prepare your experience.</p>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function Landing() {
  return (
    <Suspense fallback={<LandingLoading />}>
      <LandingContent />
    </Suspense>
  );
}
