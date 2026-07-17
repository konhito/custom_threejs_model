"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { Download, Mail, MessageCircle, ExternalLink, Globe, BookOpen, Gamepad2, Flower, Bot, ArrowRight, Shield, X, Info, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "../../lib/useTranslation";
// Footer removed from landing page - ends at Get in Touch section

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
          "/logo.glb",
          (gltf) => {
            const logo = gltf.scene;
            
            // Center and scale the logo around the origin using a wrapper group
            logo.updateMatrixWorld(true);
            const box = new THREE.Box3().setFromObject(logo);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const desiredSize = 2.2; // target size for the longest axis after scaling

            // Shift model so its geometric center sits at the origin (0,0,0)
            logo.position.sub(center);

            // Wrap in a group so rotation occurs around origin (after recentering)
            const logoGroup = new THREE.Group();
            logoGroup.add(logo);

            // Compute uniform scale and apply to the group (not the logo itself)
            const scale = desiredSize / maxDim;
            logoGroup.scale.setScalar(scale);

            // Enhance materials and enable shadows
            logo.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                if (child.material) {
                  child.material.metalness = 0.1;
                  child.material.roughness = 0.3;
                  child.material.envMapIntensity = 1.0;
                  if (child.material.color) {
                    child.material.color.multiplyScalar(1.5);
                  }
                  child.material.needsUpdate = true;
                }
              }
            });

            // Add to scene
            scene.add(logoGroup);

            // Position camera based on object size to keep it framed nicely
            const fov = camera.fov * (Math.PI / 180);
            const distance = (desiredSize * 0.5) / Math.tan(fov / 2) * 1.3; // add a little padding
            camera.position.set(0, 0, distance);
            camera.lookAt(0, 0, 0);

            // Store references
            sceneRef.current = scene;
            rendererRef.current = renderer;

            // Hide loading and show 3D logo
            setIsLoading(false);

            // Animation loop - rotate the group so it spins around the true center
            const animate = () => {
              animationRef.current = requestAnimationFrame(animate);
              logoGroup.rotation.y += 0.01;
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

// Landing Content Component
function LandingContent() {
  const { t, locale, isLoading } = useTranslation();
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
    subject: '',
    privacyAccepted: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Contact info (static, not translated)
  const contactInfo = {
    email: "partnerships@asociacionnahiara.org",
    phone: "+34 625 50 18 67",
    location: "FLOR_∞ - 28.1235° N, 15.4363° W - Gran Canaria"
  };

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
      const subject = encodeURIComponent(contactForm.subject || t('footer.contactSubject'));
      const body = encodeURIComponent(
        `${t('landing.name')}: ${contactForm.name}\n` +
        `${t('landing.email')}: ${contactForm.email}\n\n` +
        `${t('landing.message')}: ${contactForm.message}`
      );
      
      // Open email client
      window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`;
      
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowContactModal(false);
      }, 2000);
      
      // Reset form
      setContactForm({ name: '', email: '', message: '', subject: '', privacyAccepted: false });
    } catch (error) {
      console.error('Error submitting contact form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while translations are loading
  if (isLoading) {
    return <LandingLoading />;
  }


  const handlePressKitDownload = () => {
    // Create a simple press kit content
    const pressKitContent = `
# ${t('landing.heroTitle')} - Press Kit
## ${t('landing.heroSubtitle')}

### Project Overview
${t('landing.description')}

### Formats
- 📖 ${t('landing.bookTitle')}
- 🃏 ${t('landing.gameTitle')}
- 🌸 ${t('landing.archiveTitle')}
- 🤖 ${t('landing.exhibitionTitle')}

### Contact
Email: ${contactInfo.email}
WhatsApp: ${contactInfo.phone}
Location: ${contactInfo.location}

### Vision
${t('landing.visionText')}
    `;
    
    const blob = new Blob([pressKitContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AquaMundi_PressKit_${locale.toUpperCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Fonts are loaded via layout.js or should be added to layout */}
      <div className="min-h-screen bg-white text-gray-900 relative" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Organic Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 bg-green-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-200 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-teal-200 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
      {/* Language Toggle removed - now in footer */}

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
              {t('landing.heroTitle')}
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl text-green-700 mb-4 font-medium" style={{ fontFamily: 'Exo 2, sans-serif', letterSpacing: '0.05em' }}>
              {t('landing.heroSubtitle')}
            </h2>
            <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: 'Crimson Text, serif', fontWeight: '400', fontStyle: 'italic' }}>
              {t('landing.heroTagline')}
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
                {t('landing.explore3DArchive')}
              </a>
              <button
                onClick={() => setShowContactModal(true)}
                className="px-6 py-3 border border-green-600 text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors duration-200"
                style={{ fontFamily: 'Comfortaa, cursive', letterSpacing: '0.02em', fontWeight: '500' }}
              >
                {t('landing.contactUs')}
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
              {t('landing.storyBehindBook')}
            </h2>
            <div className="w-16 h-1 bg-green-500 mx-auto"></div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 sm:p-6 border border-green-200">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto mb-4" style={{ fontFamily: 'Rubik, sans-serif', lineHeight: '1.7' }}>
              {t('landing.storyText')}
            </p>
            <div className="text-center">
              <div className="flex flex-wrap justify-center gap-2">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium" style={{ fontFamily: 'Fredoka One, cursive', fontWeight: '400' }}>
                  {t('landing.literarySaga')}
                </span>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium" style={{ fontFamily: 'Fredoka One, cursive', fontWeight: '400' }}>
                  {t('landing.globalImpact')}
                </span>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium" style={{ fontFamily: 'Fredoka One, cursive', fontWeight: '400' }}>
                  {t('landing.flowers195')}
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
              {t('landing.continueJourney')}
            </h2>
            <div className="w-16 h-1 bg-green-500 mx-auto"></div>
            <p className="text-base sm:text-lg text-gray-600 mt-4 max-w-2xl mx-auto" style={{ fontFamily: 'Karla, sans-serif' }}>
              {t('landing.journeyText')}
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
                    {t('landing.interactive3DArchive')}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4" style={{ fontFamily: 'Manrope, sans-serif', lineHeight: '1.6' }}>
                    {t('landing.archiveDesc2')}
                  </p>
                  <a
                    href="https://www.aquamundi.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                    style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.05em', fontWeight: '400' }}
                  >
                    {t('landing.startExploring')}
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
                    {t('landing.completeSaga')}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4" style={{ fontFamily: 'Manrope, sans-serif', lineHeight: '1.6' }}>
                    {t('landing.sagaDesc')}
                  </p>
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200"
                    style={{ fontFamily: 'Comfortaa, cursive', letterSpacing: '0.02em', fontWeight: '500' }}
                  >
                    {t('landing.learnMore')}
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
              {t('landing.joinGlobalCommunity')}
            </h2>
            <div className="w-24 h-1 bg-green-500 mx-auto"></div>
          </div>
          <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
            <p className="text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto mb-6" style={{ fontFamily: 'Source Sans Pro, sans-serif', lineHeight: '1.7' }}>
              {t('landing.communityText')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {t('landing.globalCommunity')}
              </span>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {t('landing.educationalImpact')}
              </span>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {t('landing.conservationFocus')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Share & Connect Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t('landing.shareExperience')}
          </h2>
          <div className="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: 'Source Sans Pro, sans-serif', lineHeight: '1.7' }}>
            {t('landing.shareText')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowContactModal(true)}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              {t('landing.getInTouch')}
            </button>
            <button
              onClick={handlePressKitDownload}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <Download className="mr-2 w-5 h-5" />
              {t('landing.downloadResources')}
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              {t('landing.getInTouch')}
            </h2>
            <div className="w-24 h-1 bg-green-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
              <Mail className="w-8 h-8 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Email</h3>
              <a 
                href={`mailto:${contactInfo.email}`}
                className="text-gray-600 hover:text-gray-800 transition-colors text-sm notranslate"
                translate="no"
              >
                {contactInfo.email}
              </a>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
              <svg className="w-8 h-8 mx-auto mb-4 text-green-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>WhatsApp</h3>
              <a 
                href={`https://wa.me/${contactInfo.phone.replace(/\s+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-green-600 transition-colors text-sm flex items-center justify-center gap-1 notranslate"
                translate="no"
              >
                {contactInfo.phone}
              </a>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Location</h3>
              <p className="text-gray-600 text-sm">
                {contactInfo.location}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer removed - landing page ends at Get in Touch section */}

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
                {t('landing.getInTouch')}
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
                {t('landing.responseTime')}
              </p>

              {/* Contact Form */}
              <form onSubmit={handleContactSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4 text-center">
                  {t('landing.sendMessage')}
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('landing.name')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={t('landing.yourName')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('landing.email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={t('landing.yourEmail')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('landing.subject')}
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={t('landing.whatIsThisAbout')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('landing.message')} *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder={t('landing.tellUsAbout')}
                    />
                  </div>

                  <label className="flex items-start gap-2 text-sm text-gray-700">
                    <input type="checkbox" required checked={contactForm.privacyAccepted} onChange={(e) => setContactForm({ ...contactForm, privacyAccepted: e.target.checked })} className="mt-1 h-4 w-4" />
                    <span>I have read and accept the <Link href="/privacy" className="underline">Privacy Policy</Link>. *</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting 
                      ? t('landing.openingEmail')
                      : t('landing.sendMessageBtn')
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
                    {t('landing.or')}
                  </span>
                </div>
              </div>

              {/* Contact Options */}
              <div className="space-y-4">
                {/* Email Option */}
                <a
                  href={`mailto:${contactInfo.email}?subject=${encodeURIComponent(t('footer.contactSubject'))}`}
                  className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Mail className="w-6 h-6 text-green-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {t('landing.sendEmail')}
                    </h4>
                    <p className="text-sm text-gray-600 notranslate" translate="no">{contactInfo.email}</p>
                  </div>
                </a>

                {/* WhatsApp Option */}
                <a
                  href={`https://wa.me/${contactInfo.phone.replace(/\s+/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <svg className="w-6 h-6 mr-4 text-green-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {t('landing.whatsapp')}
                    </h4>
                    <p className="text-sm text-gray-600 notranslate" translate="no">{contactInfo.phone}</p>
                  </div>
                </a>
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
              {t('landing.emailOpened')}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('landing.emailOpenedText')}
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

// Loading with locale placeholder to avoid hydration mismatch
function TranslatedLandingLoading() {
  const { t, isLoading } = useTranslation();
  
  if (isLoading) {
    return <LandingLoading />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          {t('landing.loading')}
        </h2>
        <p className="text-gray-600">{t('landing.pleaseWait')}</p>
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
