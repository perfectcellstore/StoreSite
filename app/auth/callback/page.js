'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';

/**
 * Google OAuth Callback Page
 * 
 * This page handles the callback from Emergent Auth after Google OAuth.
 * It extracts the session_id from the URL fragment and processes it.
 * 
 * REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const { processGoogleCallback } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processCallback = async () => {
      try {
        // Extract session_id from URL fragment (hash)
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1)); // Remove the '#'
        const sessionId = params.get('session_id');

        if (!sessionId) {
          console.error('No session_id found in URL');
          router.push('/account?error=no_session');
          return;
        }

        console.log('Processing Google OAuth callback...');
        
        // Process the session_id
        const result = await processGoogleCallback(sessionId);

        if (result.success) {
          console.log('Google OAuth successful, redirecting to account...');
          // Clear the URL fragment and redirect
          window.history.replaceState({}, document.title, '/auth/callback');
          router.push('/account');
        } else {
          console.error('Google OAuth failed:', result.error);
          router.push('/account?error=' + encodeURIComponent(result.error || 'auth_failed'));
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/account?error=callback_failed');
      }
    };

    processCallback();
  }, [processGoogleCallback, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-bio-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
