"use client";
import { useEffect, useRef, useState } from "react";

export default function GlobeComponent() {
  const globeRef = useRef();
  const containerRef = useRef();
  const [Globe, setGlobe] = useState(null);

  useEffect(() => {
    // Dynamically import globe.gl only on the client side
    const loadGlobe = async () => {
      if (typeof window !== "undefined") {
        try {
          const GlobeGL = (await import("globe.gl")).default;
          setGlobe(() => GlobeGL);
        } catch (error) {
          console.error("Failed to load globe.gl:", error);
        }
      }
    };

    loadGlobe();
  }, []);

  useEffect(() => {
    if (!Globe || !containerRef.current) return;

    // Initialize the globe with higher quality settings
    const globe = Globe()
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-day.jpg")
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .backgroundColor("rgba(0,0,0,0)")
      .width(containerRef.current.clientWidth)
      .height(containerRef.current.clientHeight)
      .showGlobe(true)
      .showAtmosphere(true)
      .atmosphereColor("#69b7ff")
      .atmosphereAltitude(0.2);

    // Mount the globe
    globe(containerRef.current);
    globeRef.current = globe;

    // Wait for globe to initialize, then enhance lighting and quality
    setTimeout(() => {
      const scene = globe.scene();
      const renderer = globe.renderer();

      if (scene && renderer) {
        // Enhance renderer quality settings
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.antialias = true;
        renderer.shadowMap.enabled = true;

        // Import Three.js and add lighting
        import("three").then((THREE) => {
          // Remove default lights
          const lightsToRemove = [];
          scene.traverse((child) => {
            if (child.isLight) {
              lightsToRemove.push(child);
            }
          });
          lightsToRemove.forEach((light) => scene.remove(light));

          // Add bright ambient light
          const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
          scene.add(ambientLight);

          // Add main directional light (sun)
          const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
          sunLight.position.set(1, 1, 1);
          scene.add(sunLight);

          // Add secondary light from opposite side
          const fillLight = new THREE.DirectionalLight(0xadd8e6, 0.8);
          fillLight.position.set(-1, -0.5, -1);
          scene.add(fillLight);

          // Enhance renderer settings
          renderer.toneMappingExposure = 1.5;
        });
      }
    }, 100);

    // Auto rotate with smoother settings
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 120;
    controls.maxDistance = 600;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Handle resize
    const handleResize = () => {
      if (globe && containerRef.current) {
        globe
          .width(containerRef.current.clientWidth)
          .height(containerRef.current.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    // Enhanced sample data with special countries
    const sampleData = [
      // Regular points

      // Special bigger pins for India, Brazil, and Japan
      {
        lat: 20.5937,
        lng: 78.9629,
        name: "India",
        size: 1.2,
        color: "#00ff88",
        special: true,
      },
      {
        lat: -14.235,
        lng: -51.9253,
        name: "Brazil",
        size: 1.2,
        color: "#ff3366",
        special: true,
      },
      {
        lat: 36.2048,
        lng: 138.2529,
        name: "Japan",
        size: 1.2,
        color: "#3366ff",
        special: true,
      },
    ];

    // Add points to the globe with dynamic sizing and coloring
    globe
      .pointsData(sampleData)
      .pointColor((d) => d.color)
      .pointAltitude((d) => (d.special ? 0.04 : 0.02))
      .pointRadius((d) => d.size)
      .pointLabel(
        (d) =>
          `<div style="background: rgba(0,0,0,0.8); padding: 8px; border-radius: 4px; color: white; font-weight: bold; ${
            d.special ? "border: 2px solid " + d.color + ";" : ""
          }">${d.name}${d.special ? " ⭐" : ""}</div>`
      )
      .pointResolution(16) // Higher resolution for smoother points
      .onPointClick((point) => {
        console.log(`Clicked on ${point.name}`);
        // You can add click interactions here
      });

    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && globe) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [Globe]);

  return (
    <div
      className="w-full h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: 'url("/bg_image.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {!Globe ? (
        <div className="flex items-center justify-center text-white">
          <div className="bg-black bg-opacity-50 p-4 rounded-lg">
            <p className="text-lg">Loading High-Quality Globe...</p>
            <div className="mt-2 w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="w-full h-full"
          style={{ cursor: "grab" }}
        />
      )}
    </div>
  );
}
