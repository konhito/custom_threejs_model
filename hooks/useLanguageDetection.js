/**
 * Language Detection Hook
 * Detects user's country and suggests language
 * Currently returns EN only, prepared for future multi-language
 */

import { useState, useEffect } from 'react';
import { detectUserCountry, getSuggestedLanguage, getLanguagePreference } from '../lib/languageDetection';

export function useLanguageDetection() {
  const [country, setCountry] = useState(null);
  const [suggestedLanguage, setSuggestedLanguage] = useState('en');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    async function detectLanguage() {
      try {
        // Get user's language preference
        const preferredLanguage = await getLanguagePreference();
        setCurrentLanguage(preferredLanguage);
        
        // Detect country for analytics/future use
        const detectedCountry = await detectUserCountry();
        setCountry(detectedCountry);
        
        // Get suggested language based on country
        const suggested = getSuggestedLanguage(detectedCountry);
        setSuggestedLanguage(suggested);
        
        // For now, always use EN regardless of suggestion
        // Future: Load appropriate translations when they're available
        setCurrentLanguage('en');
      } catch (error) {
        console.error('Language detection failed:', error);
        // Fallback to EN
        setCurrentLanguage('en');
        setSuggestedLanguage('en');
      } finally {
        setIsDetecting(false);
      }
    }

    detectLanguage();
  }, []);

  return {
    country,
    suggestedLanguage,
    currentLanguage,
    isDetecting,
    // Flag to show if user might want another language
    shouldSuggestLanguage: suggestedLanguage !== 'en' && currentLanguage === 'en'
  };
}


