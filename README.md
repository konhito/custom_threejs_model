# Nahiara & AquaMundi Frontend

Frontend application for the International Association for the Defense of Flowers - Nahiara Universe and AquaMundi platforms.

## Overview

This is a Next.js 15 application featuring:
- Interactive 3D model viewer (Three.js)
- E-commerce platform for books and card games
- Multi-language support (English/Spanish)
- Session tracking and GDPR compliance
- Stripe payment integration
- Responsive design with Tailwind CSS

## Tech Stack

- **Next.js 15** - React framework
- **React 19** - UI library
- **Three.js** - 3D graphics
- **Stripe.js** - Payment processing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

```bash
npm run build
npm start
```

## Authentication Tokens & Access Codes

### QR Code Access - Contact the Author

**Page:** `/contact-the-author`

**QR Code Token:** `QR_AUTHOR_2025`

**QR Code URL Format:**
```
https://asociacionnahiara.org/contact-the-author?token=QR_AUTHOR_2025
```

Or for aquamundi.org:
```
https://aquamundi.org/contact-the-author?token=QR_AUTHOR_2025
```

**Manual Access Code (Fallback):**
- Code: `AUTHOR2025`

**Location:** `frontend/components/QRCodeAccessGate.js`

**Usage:**
- The QR code on business cards should link to the URL above
- Access is automatically granted when the token matches
- Session is stored in `sessionStorage` as `author_contact_access`

### Professional Access

**Page:** `/professionals`

**Access Code:** `5X3JR`

**Location:** `frontend/components/AccessGate.js`

**Usage:**
- Enter the access code to gain entry to the professional area
- Session is stored in `sessionStorage` as `professionals_access`

## Project Structure

```
frontend/
├── app/                    # Next.js app router pages
│   ├── alone-with-the-author/  # Author personal page
│   ├── contact-the-author/    # QR code restricted contact page
│   ├── professionals/          # Professional access area
│   ├── shop/                   # E-commerce shop
│   ├── cart/                   # Shopping cart
│   ├── checkout/               # Checkout process
│   └── ...
├── components/             # React components
│   ├── Navigation.js          # Main navigation
│   ├── AccessGate.js          # Professional access gate
│   ├── QRCodeAccessGate.js    # QR code access gate
│   ├── GDPRConsentBanner.js   # GDPR compliance
│   └── ...
├── lib/                   # Utility libraries
│   ├── api.js                # API client functions
│   ├── session.js            # Session management
│   ├── geolocation.js        # Location services
│   └── seo.js                # SEO utilities
└── public/                # Static assets
    ├── logo.glb            # 3D logo model
    ├── Globe.glb           # Globe 3D model
    └── ...
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## Key Features

### 3D Model Viewer
- GLB/GLTF model loading
- Interactive camera controls
- Custom lighting setup
- Responsive rendering

### E-commerce
- Product catalog
- Shopping cart (localStorage)
- Stripe payment integration
- Multi-currency support (EUR/USD)
- Order management

### Session Tracking
- Device fingerprinting
- Activity tracking
- Preference storage
- GDPR compliance

### Access Control
- QR code-based access for author contact
- Access code system for professionals
- Session-based authentication

## Important Notes

### QR Code Setup
When creating QR codes for business cards:
1. Use the URL format: `/contact-the-author?token=QR_AUTHOR_2025`
2. The token must match exactly (case-sensitive)
3. Access is automatically granted on successful token match

### Security
- Access tokens are stored in component files (should be moved to environment variables in production)
- Session storage is used for client-side access management
- Consider implementing server-side token validation for production

## Support

For issues or questions:
- Email: partnerships@asociacionnahiara.org
- Phone: +34 625 50 18 67

## License

Copyright © 2025 International Association for the Defense of Flowers Proveneya & Nahiara
