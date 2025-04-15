// src/app/components/AuthProviderWrapper.tsx
'use client';
import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
