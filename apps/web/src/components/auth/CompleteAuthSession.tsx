'use client';

import { useEffect, useState } from 'react';
import { createAuthBrowserClient } from '../../lib/auth/browser';

export function CompleteAuthSession() {
  const [message, setMessage] = useState('Completing sign-in…');

  useEffect(() => {
    async function completeSession() {
      const client = createAuthBrowserClient();
      if (!client) {
        setMessage('Supabase auth env vars are not configured.');
        return;
      }

      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (!accessToken || !refreshToken) {
        setMessage('Missing auth session tokens in callback URL.');
        return;
      }

      const { error } = await client.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      window.location.href = '/login';
    }

    completeSession();
  }, []);

  return <p>{message}</p>;
}
