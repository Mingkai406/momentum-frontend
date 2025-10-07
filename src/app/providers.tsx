'use client';
import { Amplify } from 'aws-amplify';
import { amplifyConfig } from '@/lib/amplifyConfig';
import { useEffect } from 'react';

Amplify.configure(amplifyConfig, { ssr: true });

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    Amplify.configure(amplifyConfig);
  }, []);

  return <>{children}</>;
}
