"use client";
import { useState, useEffect } from 'react';
import { X, Shield, Cookie } from 'lucide-react';
import { updateGDPRConsent } from '../lib/session';
import Link from 'next/link';

export default function GDPRConsentBanner() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user has already consented (client-side only)
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('nahiara_gdpr_consent');
      if (!consent) {
        // Show banner after a short delay
        const timer = setTimeout(() => {
          setShow(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await updateGDPRConsent(true, true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('nahiara_gdpr_consent', 'true');
      }
      setShow(false);
    } catch (error) {
      console.error('Error updating consent:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await updateGDPRConsent(false, false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('nahiara_gdpr_consent', 'false');
      }
      setShow(false);
    } catch (error) {
      console.error('Error updating consent:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    // Don't set consent, just hide banner
    if (typeof window !== 'undefined') {
      localStorage.setItem('nahiara_gdpr_consent', 'dismissed');
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[10000] bg-white border-t-2 border-green-200 shadow-2xl animate-slide-in">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Cookie className="w-4 h-4" />
                Cookie & Privacy Notice
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                We use cookies and session tracking to improve your experience, analyze site usage, 
                and assist in our marketing efforts. By clicking &quot;Accept All&quot;, you consent to our use of cookies 
                and session tracking. You can manage your preferences at any time.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                <Link href="/privacy" className="text-green-600 hover:text-green-700 underline">
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link href="/cookies" className="text-green-600 hover:text-green-700 underline">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleReject}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Reject All
            </button>
            <button
              onClick={handleAccept}
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Accept All'}
            </button>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}






