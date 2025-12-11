export async function GET() {
  const manifest = {
    name: "International Association for the Defense of Flowers Proveneya & Nahiara",
    short_name: "Defense of Flowers",
    description: "A cosmic journey through the world's most sacred flowers, connecting humanity with nature's wisdom and the pollinators that sustain life on Earth.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4a90e2",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    icons: [
      {
        src: "/logo1.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/logo1.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/logo1.png",
        sizes: "180x180",
        type: "image/png"
      },
      {
        src: "/logo1.png",
        sizes: "any",
        type: "image/png"
      }
    ],
    categories: ["education", "nature", "environment", "science"],
    screenshots: [
      {
        src: "/screenshot-mobile.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow"
      },
      {
        src: "/screenshot-desktop.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide"
      }
    ]
  };

  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}


