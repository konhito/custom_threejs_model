"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { Download, Mail, MessageCircle, ExternalLink, Globe, BookOpen, Gamepad2, Flower, Bot, ArrowRight, Shield, QrCode } from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import { useSearchParams, useRouter } from "next/navigation";

// Global flag to prevent multiple 3D logo instances
let logoInstanceCount = 0;

// 3D Logo Component
function Logo3D() {
  const canvasRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();
  const animationRef = useRef();
  const isLoadedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Prevent multiple initializations
    if (isLoadedRef.current || logoInstanceCount > 0) return;
    
    const load3DLogo = async () => {
      try {
        const THREE = await import("three");
        const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");

        if (!canvasRef.current || isLoadedRef.current || logoInstanceCount > 0) return;
        isLoadedRef.current = true;
        logoInstanceCount++;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = null; // Transparent background

        const camera = new THREE.PerspectiveCamera(
          60,
          canvasRef.current.clientWidth / canvasRef.current.clientHeight,
          0.1,
          1000
        );

        const renderer = new THREE.WebGLRenderer({ 
          antialias: true,
          alpha: true 
        });
        renderer.setSize(
          canvasRef.current.clientWidth,
          canvasRef.current.clientHeight
        );
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;

        canvasRef.current.appendChild(renderer.domElement);

        // Balanced Lighting Setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        // Main directional light - reduced white
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        // Bright pink light
        const fillLight = new THREE.DirectionalLight(0xff6b9d, 2.0);
        fillLight.position.set(-5, 5, -5);
        scene.add(fillLight);

        // Bright purple light
        const accentLight = new THREE.DirectionalLight(0x9d4edd, 1.5);
        accentLight.position.set(0, -5, 5);
        scene.add(accentLight);

        // Bright blue light
        const rimLight = new THREE.DirectionalLight(0x4dabf7, 1.5);
        rimLight.position.set(5, 0, -5);
        scene.add(rimLight);

        // Multiple point lights for extra brightness
        const pointLight1 = new THREE.PointLight(0xff6b9d, 2.0, 15);
        pointLight1.position.set(0, 0, 3);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xffffff, 0.8, 10);
        pointLight2.position.set(0, 0, -2);
        scene.add(pointLight2);

        const pointLight3 = new THREE.PointLight(0x9d4edd, 1.5, 12);
        pointLight3.position.set(3, 3, 0);
        scene.add(pointLight3);

        // Load 3D logo
        const loader = new GLTFLoader();
        loader.load(
          "/3dlogo.glb",
          (gltf) => {
            const logo = gltf.scene;
            
            // Center and scale the logo
            const box = new THREE.Box3().setFromObject(logo);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2.2 / maxDim;

            logo.scale.multiplyScalar(scale);
            logo.position.sub(center.multiplyScalar(scale));

            // Enhance materials and enable shadows
            logo.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                // Enhance material properties
                if (child.material) {
                  child.material.metalness = 0.1;
                  child.material.roughness = 0.3;
                  child.material.envMapIntensity = 1.0;
                  
                  // Make materials more vibrant
                  if (child.material.color) {
                    child.material.color.multiplyScalar(1.5);
                  }
                  
                  // Ensure material is visible
                  child.material.needsUpdate = true;
                }
              }
            });

            scene.add(logo);

            // Position camera further back
            camera.position.set(0, 0, 4);
            camera.lookAt(0, 0, 0);

            // Store references
            sceneRef.current = scene;
            rendererRef.current = renderer;

            // Hide loading and show 3D logo
            setIsLoading(false);

            // Animation loop
            const animate = () => {
              animationRef.current = requestAnimationFrame(animate);
              
              // Rotate the logo
              if (logo) {
                logo.rotation.y += 0.01;
              }
              
              renderer.render(scene, camera);
            };
            animate();
          },
          (progress) => {
            const percentComplete = (progress.loaded / progress.total) * 100;
            setLoadingProgress(percentComplete);
            console.log("Loading 3D logo:", percentComplete + "%");
          },
          (error) => {
            console.error("Error loading 3D logo:", error);
            setIsLoading(false);
          }
        );

        // Handle resize
        const handleResize = () => {
          if (!canvasRef.current) return;
          const width = canvasRef.current.clientWidth;
          const height = canvasRef.current.clientHeight;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };

        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
          if (canvasRef.current && renderer.domElement) {
            try {
              canvasRef.current.removeChild(renderer.domElement);
            } catch (e) {
              console.log("Canvas already cleaned up");
            }
          }
          isLoadedRef.current = false;
          logoInstanceCount = 0;
        };
      } catch (error) {
        console.error("Error loading Three.js:", error);
      }
    };

    load3DLogo();
  }, []);

  return (
    <div className="w-48 h-48 mx-auto relative" style={{ minHeight: '192px' }}>
      {/* Loading UI */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Clean spinning loader */}
          <div className="w-8 h-8 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* 3D Canvas */}
      <div 
        ref={canvasRef} 
        className={`w-full h-full transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
}

// Access Denied Component
function AccessDenied() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          Access Restricted
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          This page is only accessible via scanned QR code. Please scan the QR code from the book to access this exclusive content.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <QrCode className="w-5 h-5 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">QR Code Required</span>
          </div>
          <p className="text-xs text-gray-500">
            Look for the QR code in your copy of "Nahiara & the Guardians of the Flowers"
          </p>
        </div>
        <a
          href="https://www.aquamundi.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          <Globe className="mr-2 w-4 h-4" />
          Explore Public Archive
        </a>
      </div>
    </div>
  );
}

// Landing Content Component that uses useSearchParams
function LandingContent() {
  const [language, setLanguage] = useState('en');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

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
        title: "Aqua Mundi",
        subtitle: "Nahiara & the Guardians of the Flowers",
        tagline: "\"Where every flower tells a story, and every story blooms into hope\"",
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
        email: "hello@aquamundi.org",
        whatsapp: "+1 (555) 123-4567",
        social: "@Proveneya_and_nahiara"
      },
      footer: {
        copyright: "© 2024 Aqua Mundi - Nahiara & the Guardians of the Flowers",
        association: "Proveneya Foundation"
      }
    },
    es: {
      hero: {
        title: "Aqua Mundi",
        subtitle: "Nahiara y los Guardianes de las Flores",
        tagline: "\"Donde cada flor cuenta una historia, y cada historia florece en esperanza\"",
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
        email: "hola@aquamundi.org",
        whatsapp: "+1 (555) 123-4567",
        social: "@Proveneya_and_nahiara"
      },
      footer: {
        copyright: "© 2024 Aqua Mundi - Nahiara y los Guardianes de las Flores",
        association: "Fundación Proveneya"
      }
    }
  };

  const currentContent = content[language];

  // Authentication logic
  useEffect(() => {
    const checkAuthentication = () => {
      try {
        // Check for QR code authentication parameter
        const authParam = searchParams.get('auth');
        const qrCode = searchParams.get('qr');
        const token = searchParams.get('token');
        
        // Multiple authentication methods for flexibility
        const validAuthCodes = [
          'nahiara2024', // Primary QR code auth
          'guardians',   // Alternative auth
          'flowers',     // Another option
          'aquamundi'    // Project name auth
        ];
        
        const validQrCodes = [
          'nahiara-qr-2024',
          'guardians-qr',
          'flowers-qr',
          'aquamundi-qr'
        ];
        
        const validTokens = [
          'nahiara-token-2024',
          'guardians-token',
          'flowers-token',
          'aquamundi-token'
        ];
        
        // Check if any authentication method is valid
        const isAuthValid = validAuthCodes.includes(authParam) || 
                           validQrCodes.includes(qrCode) || 
                           validTokens.includes(token);
        
        if (isAuthValid) {
          setIsAuthenticated(true);
          // Store authentication in sessionStorage for this session
          sessionStorage.setItem('nahiara_authenticated', 'true');
          sessionStorage.setItem('auth_timestamp', Date.now().toString());
        } else {
          // Check if user was previously authenticated in this session
          const sessionAuth = sessionStorage.getItem('nahiara_authenticated');
          const authTimestamp = sessionStorage.getItem('auth_timestamp');
          
          if (sessionAuth === 'true' && authTimestamp) {
            // Check if session is still valid (24 hours)
            const timeDiff = Date.now() - parseInt(authTimestamp);
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            
            if (hoursDiff < 24) {
              setIsAuthenticated(true);
            } else {
              // Session expired, clear storage
              sessionStorage.removeItem('nahiara_authenticated');
              sessionStorage.removeItem('auth_timestamp');
              setIsAuthenticated(false);
            }
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [searchParams]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Verifying Access...
          </h2>
          <p className="text-gray-600">Please wait while we verify your QR code access.</p>
        </div>
      </div>
    );
  }

  // Show access denied if not authenticated
  if (!isAuthenticated) {
    return <AccessDenied />;
  }

  const handlePressKitDownload = () => {
    // Create a simple press kit content
    const pressKitContent = `
# Aqua Mundi - Press Kit
## Nahiara & the Guardians of the Flowers

### Project Overview
${currentContent.description}

### Formats
- 📖 ${currentContent.formats.book.title}
- 🃏 ${currentContent.formats.game.title}
- 🌸 ${currentContent.formats.archive.title}
- 🤖 ${currentContent.formats.exhibition.title}

### Contact
Email: ${currentContent.contact.email}
WhatsApp: ${currentContent.contact.whatsapp}
Social: ${currentContent.contact.social}

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
      {/* Language Toggle - Fixed Top Right */}
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

      {/* Header / Hero Section - Mobile First */}
      <section className="relative py-12 px-4 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-4xl mx-auto">
          {/* Mobile-First Single Column Layout */}
          <div className="text-center">
            {/* 3D Logo - Centered */}
            <div className="mb-1 flex justify-center">
              <Logo3D key="main-logo" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight" style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.02em' }}>
              {currentContent.hero.title}
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl text-green-700 mb-4 font-medium" style={{ fontFamily: 'Exo 2, sans-serif', letterSpacing: '0.05em' }}>
              {currentContent.hero.subtitle}
            </h2>
            <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: 'Crimson Text, serif', fontWeight: '400', fontStyle: 'italic' }}>
              {currentContent.hero.tagline}
            </p>
            
            {/* QR Code Access Success - Mobile Optimized */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 sm:p-6 shadow-sm border border-green-300 mb-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <QrCode className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900" style={{ fontFamily: 'Righteous, cursive', letterSpacing: '0.02em' }}>
                  {language === 'en' ? 'QR Code Access Verified!' : '¡Acceso QR Verificado!'}
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed text-center" style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '1.6' }}>
                {language === 'en' 
                  ? 'Welcome to the exclusive digital world of Nahiara! You\'ve successfully accessed this content via QR code. Explore the interactive 3D floral archive, learn about the story\'s ecosystem, and connect with the global community of flower guardians.'
                  : '¡Bienvenido al mundo digital exclusivo de Nahiara! Has accedido exitosamente a este contenido mediante código QR. Explora el archivo floral 3D interactivo, conoce el ecosistema de la historia y conéctate con la comunidad global de guardianes de flores.'
                }
              </p>
              {/* Language Auto-Detection Indicator */}
             
            </div>
            
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
      <section className="py-12 px-4 bg-white">
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
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.05em' }}>
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
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              {language === 'en' ? 'Join the Global Community' : 'Únete a la Comunidad Global'}
            </h2>
            <div className="w-24 h-1 bg-green-500 mx-auto"></div>
          </div>
          <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
            <p className="text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto mb-6" style={{ fontFamily: 'Source Sans Pro, sans-serif', lineHeight: '1.7' }}>
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
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {language === 'en' ? 'Share Your Experience' : 'Comparte Tu Experiencia'}
          </h2>
          <div className="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: 'Source Sans Pro, sans-serif', lineHeight: '1.7' }}>
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
      <section id="contact" className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              {currentContent.contact.title}
            </h2>
            <div className="w-24 h-1 bg-green-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
              <Mail className="w-8 h-8 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Email</h3>
              <a 
                href={`mailto:${currentContent.contact.email}`}
                className="text-gray-600 hover:text-gray-800 transition-colors text-sm"
              >
                {currentContent.contact.email}
              </a>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>WhatsApp</h3>
              <a 
                href={`https://wa.me/${currentContent.contact.whatsapp.replace(/\D/g, '')}`}
                className="text-gray-600 hover:text-gray-800 transition-colors text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                {currentContent.contact.whatsapp}
              </a>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
              <ExternalLink className="w-8 h-8 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Social Media</h3>
              <a 
                href={`https://instagram.com/${currentContent.contact.social.replace('@', '')}`}
                className="text-gray-600 hover:text-gray-800 transition-colors text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                {currentContent.contact.social}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6">
            <img 
              src="/logo1.png" 
              alt="Aqua Mundi Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <p className="text-gray-300 text-sm mb-2" style={{ fontFamily: 'Source Sans Pro, sans-serif' }}>{currentContent.footer.copyright}</p>
          <p className="text-gray-400 text-xs" style={{ fontFamily: 'Source Sans Pro, sans-serif' }}>{currentContent.footer.association}</p>
        </div>
      </footer>
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
