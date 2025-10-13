"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { Download, Mail, MessageCircle, ExternalLink, Globe, BookOpen, Gamepad2, Flower, Bot, ArrowRight, Shield, QrCode, X, Info } from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
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

// QR Code Scan Page Component
function QRCodeScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  const handleScan = async () => {
    setIsScanning(true);
    setError(null);
    
    try {
      // Dynamically import QR scanner
      const QrScanner = (await import('qr-scanner')).default;
      
      if (!videoRef.current) {
        setError('Video element not found');
        setIsScanning(false);
        return;
      }

      // Create QR scanner instance
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR Code detected:', result);
          setScanResult(result.data);
          qrScanner.stop();
          setIsScanning(false);
          
          // Check if the QR code is valid
          const validQrCodes = [
            'nahiara-qr-2024',
            'guardians-qr',
            'flowers-qr',
            'aquamundi-qr',
            'https://www.asociacionnahiara.org/landing?auth=flowers',
            'asociacionnahiara.org/landing?auth=flowers'
          ];
          
          const isValid = validQrCodes.some(validCode => 
            result.data.includes(validCode) || result.data === validCode
          );
          
          if (isValid) {
            // Redirect to authenticated version
            window.location.href = '/landing?auth=flowers';
          } else {
            setError('Invalid QR code. Please scan the QR code from the book.');
            setIsScanning(false);
          }
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
      
      qrScannerRef.current = qrScanner;
      await qrScanner.start();
      
    } catch (err) {
      console.error('QR Scanner error:', err);
      setError('Failed to start camera. Please check permissions and try again.');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleManualAuth = () => {
    // Allow manual authentication for testing
    window.location.href = '/landing?auth=flowers';
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* QR Code Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <QrCode className="w-12 h-12 text-green-600" />
        </div>
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          Scan QR Code
        </h1>
        
        {/* Description */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          To access the exclusive digital world of Nahiara, please scan the QR code from your copy of 
          <span className="font-semibold text-green-600"> &ldquo;Nahiara & the Guardians of the Flowers&rdquo;</span>
        </p>

        {/* Scanning Area */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6 border-2 border-dashed border-gray-300">
          {isScanning ? (
            <div className="text-center">
              <div className="relative w-full max-w-sm mx-auto mb-4">
                <video 
                  ref={videoRef}
                  className="w-full h-48 object-cover rounded-lg border-2 border-green-500"
                  playsInline
                />
                <div className="absolute inset-0 border-2 border-green-500 rounded-lg pointer-events-none">
                  <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-green-500"></div>
                  <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-green-500"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-green-500"></div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-green-500"></div>
                </div>
              </div>
              <p className="text-green-600 font-medium">Scanning QR Code...</p>
              <p className="text-sm text-gray-500 mt-2">Please position the QR code within the camera view</p>
              <button 
                onClick={stopScanning}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
              >
                Stop Scanning
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center border-2 border-gray-200">
                <QrCode className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">Position QR code here</p>
              <p className="text-sm text-gray-500 mt-1">Use your device camera to scan</p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <X className="w-5 h-5 text-red-600" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={handleScan}
            disabled={isScanning}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScanning ? 'Scanning...' : 'Start Scanning'}
          </button>
          
          <button 
            onClick={handleManualAuth}
            className="w-full bg-gray-100 text-gray-700 py-2 px-6 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 text-sm"
          >
            I have the book but can&apos;t scan
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-medium text-blue-800 mb-1">Need Help?</p>
              <p className="text-xs text-blue-600">
                Make sure you have good lighting and the QR code is clearly visible. 
                The QR code should be found in the back cover of your book.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-4 text-xs text-gray-500">
          <p>Don&apos;t have the book? <a href="mailto:asociacionnahiara@gmail.com" className="text-green-600 hover:underline">Contact us</a> for access.</p>
        </div>
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
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
    subject: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

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
      const subject = encodeURIComponent(contactForm.subject || (language === 'en' ? 'Contact from AquaMundi Website' : 'Contacto desde el sitio web de AquaMundi'));
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
        email: "asociacionnahiara@gmail.com",
        whatsapp: "+34 641 67 75 15",
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
        email: "asociacionnahiara@gmail.com",
        whatsapp: "+34 641 67 75 15",
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
        
        console.log('Auth check:', { authParam, qrCode, token, isAuthValid });
        
        if (isAuthValid) {
          setIsAuthenticated(true);
          // Store authentication in sessionStorage for this session
          sessionStorage.setItem('nahiara_authenticated', 'true');
          sessionStorage.setItem('auth_timestamp', Date.now().toString());
          console.log('Authentication successful');
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
              console.log('Session authentication successful');
            } else {
              // Session expired, clear storage
              sessionStorage.removeItem('nahiara_authenticated');
              sessionStorage.removeItem('auth_timestamp');
              setIsAuthenticated(false);
              console.log('Session expired');
            }
          } else {
            setIsAuthenticated(false);
            console.log('No authentication found');
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
      } finally {
        console.log('Setting isLoading to false');
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

  // Show QR code scan page if not authenticated
  if (!isAuthenticated) {
    return <QRCodeScanPage />;
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
            <Image 
              src="/logo1.png" 
              alt="Aqua Mundi Logo" 
              width={64}
              height={64}
              className="w-16 h-16 object-contain"
            />
          </div>
          <p className="text-gray-300 text-sm mb-2" style={{ fontFamily: 'Source Sans Pro, sans-serif' }}>{currentContent.footer.copyright}</p>
          <p className="text-gray-400 text-xs" style={{ fontFamily: 'Source Sans Pro, sans-serif' }}>{currentContent.footer.association}</p>
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
                      placeholder={language === 'en' ? 'Tell us about your interest in AquaMundi...' : 'Cuéntanos sobre tu interés en AquaMundi...'}
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
                  href={`mailto:${currentContent.contact.email}?subject=${encodeURIComponent(language === 'en' ? 'Contact from AquaMundi Website' : 'Contacto desde el sitio web de AquaMundi')}&body=${encodeURIComponent(language === 'en' ? 'Hello,\n\nI\'m interested in learning more about AquaMundi and the Nahiara project.\n\nBest regards,' : 'Hola,\n\nEstoy interesado en conocer más sobre AquaMundi y el proyecto Nahiara.\n\nSaludos cordiales,')}`}
                  className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Mail className="w-6 h-6 text-green-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {language === 'en' ? 'Send Email' : 'Enviar Correo'}
                    </h4>
                    <p className="text-sm text-gray-600">{currentContent.contact.email}</p>
                  </div>
                </a>

                {/* WhatsApp Option */}
                <a
                  href={`https://wa.me/${currentContent.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(language === 'en' ? 'Hello! I\'m interested in learning more about AquaMundi and the Nahiara project.' : '¡Hola! Estoy interesado en conocer más sobre AquaMundi y el proyecto Nahiara.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <MessageCircle className="w-6 h-6 text-green-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {language === 'en' ? 'WhatsApp' : 'WhatsApp'}
                    </h4>
                    <p className="text-sm text-gray-600">{currentContent.contact.whatsapp}</p>
                  </div>
                </a>

                {/* Social Media Option */}
                <a
                  href={`https://instagram.com/${currentContent.contact.social.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-pink-50 border border-pink-200 rounded-lg hover:bg-pink-100 transition-colors"
                >
                  <ExternalLink className="w-6 h-6 text-pink-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {language === 'en' ? 'Follow Us' : 'Síguenos'}
                    </h4>
                    <p className="text-sm text-gray-600">{currentContent.contact.social}</p>
                  </div>
                </a>
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  {language === 'en' 
                    ? 'We typically respond within 24 hours. Thank you for your interest in AquaMundi!'
                    : 'Normalmente respondemos en 24 horas. ¡Gracias por tu interés en AquaMundi!'
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
