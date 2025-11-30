# Language System Documentation

## Current Status: English Only

The website is currently operating in **English only** mode. All multi-locale routes (`/en`, `/es`) have been removed and the site runs on direct paths (`/`, `/about`, `/shop`, etc.).

## Architecture Overview

### 1. **Current Implementation (Phase 1)**
- ✅ Website serves content in English only
- ✅ IP-based country detection is active
- ✅ System prepared for future multi-language expansion
- ✅ No locale prefixes in URLs (clean paths)

### 2. **Country Detection System**

The system detects user's country via IP address for analytics and future language suggestions:

#### Frontend Detection
```javascript
import { useLanguageDetection } from '../hooks/useLanguageDetection';

function MyComponent() {
  const { country, suggestedLanguage, shouldSuggestLanguage } = useLanguageDetection();
  
  // country: User's country code (e.g., 'ES', 'MX')
  // suggestedLanguage: Recommended language (e.g., 'es' for Spain)
  // shouldSuggestLanguage: true if user might want non-English content
}
```

#### Backend API
```bash
GET /api/detect-country
```

Returns:
```json
{
  "country": "ES",
  "detected": true,
  "suggestedLanguage": "es"
}
```

### 3. **Files Structure**

```
frontend/
├── lib/
│   └── languageDetection.js          # Core language detection logic
├── hooks/
│   └── useLanguageDetection.js       # React hook for components
└── middleware.js                      # Passes country headers

backed/
└── routes/
    └── detect-country.js              # Country detection API
```

## Future Multi-Language System (Phase 2)

When the backend translation system is ready, the architecture supports:

### Country-to-Language Mapping

The system already maps countries to languages:

- **Spanish**: ES, MX, AR, CO, CL, PE, VE, EC, GT, CU, BO, DO, HN, PY, SV, NI, CR, PA, UY
- **English**: All other countries (default)

More languages can be added to the mapping in `lib/languageDetection.js`.

### Translation System Integration

The existing backend translation infrastructure is ready:

1. **PostgreSQL** - Stores all translations
2. **Redis** - Caches translations for fast access
3. **S3** - Hosts static translation files
4. **CloudFront** - CDN for global distribution

See `backed/TRANSLATION_SYSTEM_GUIDE.md` for full details.

### How to Activate Multi-Language

When ready to enable other languages:

1. **Seed translations into database**:
   ```bash
   cd backed
   node scripts/seed-translations.js
   ```

2. **Update available languages**:
   ```javascript
   // In lib/languageDetection.js
   export function isLanguageAvailable(languageCode) {
     const availableLanguages = ['en', 'es', 'fr', 'de']; // Add new languages
     return availableLanguages.includes(languageCode);
   }
   ```

3. **Load translations on pages**:
   ```javascript
   import { getTranslations } from '../lib/translationClient-optimized';
   
   // In page components
   const translations = await getTranslations(languageCode, ['common', 'navigation']);
   ```

4. **Update language preference logic**:
   ```javascript
   // In lib/languageDetection.js > getLanguagePreference()
   // Change from:
   return 'en';
   
   // To:
   return suggestedLanguage; // Will return appropriate language based on IP
   ```

## Benefits of Current Architecture

### ✅ Clean URLs
- No `/en` prefix cluttering URLs
- All pages at their natural paths (`/about`, `/shop`)
- Better for SEO and user experience

### ✅ Performance
- No unnecessary locale detection overhead
- Direct routing without locale middleware
- Faster page loads

### ✅ Future-Ready
- IP detection infrastructure already in place
- Backend translation system fully built
- Easy to activate when needed

### ✅ User Experience
- Consistent navigation
- No language switchers to confuse users
- Content loads immediately (no translation fetching)

## Migration Notes

### What Was Removed
- ❌ `/app/[locale]` folder and all locale-specific routes
- ❌ Spanish translation files (`es.json`)
- ❌ `useLocalePath` hook dependencies in components
- ❌ Locale prefixing in middleware
- ❌ Language switcher UI components

### What Was Preserved
- ✅ IP-based country detection
- ✅ Backend translation infrastructure
- ✅ Language preference storage system
- ✅ Translation API routes (ready for future use)

## Testing

### Test Country Detection
```bash
# From frontend
curl http://localhost:3000/api/detect-country

# Should return:
# { "country": "US", "detected": true, "suggestedLanguage": "en" }
```

### Test in Components
```jsx
import { useLanguageDetection } from '../hooks/useLanguageDetection';

export default function TestPage() {
  const { country, suggestedLanguage, isDetecting } = useLanguageDetection();
  
  if (isDetecting) return <div>Detecting location...</div>;
  
  return (
    <div>
      <p>Your country: {country || 'Unknown'}</p>
      <p>Suggested language: {suggestedLanguage}</p>
      <p>Current language: EN (only available language)</p>
    </div>
  );
}
```

## Support

For questions or issues:
1. Check backend logs for country detection issues
2. Verify Vercel geo headers are working in production
3. Test API endpoint manually
4. Review `languageDetection.js` for country-language mapping

## Next Steps

When ready to add more languages:
1. Review `backed/TRANSLATION_SYSTEM_GUIDE.md`
2. Seed translations into PostgreSQL
3. Configure Redis caching
4. Set up S3/CloudFront for translation files
5. Update `isLanguageAvailable()` function
6. Test with different country IPs
7. Deploy and monitor performance


