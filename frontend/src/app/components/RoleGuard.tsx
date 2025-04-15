'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ReactNode } from 'react';

interface RoleGuardProps {
  allowedRoles: string[];
  children: ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Lade Benutzerinfo...</div>;
  if (error) return <div>Fehler: {error.message}</div>;
  if (!user) return <div>Du bist nicht eingeloggt.</div>;

  const roles: string[] = user['https://candlewawi.com/roles'] || [];

  const hasAccess = roles.some((r) => allowedRoles.includes(r));

  if (!hasAccess) {
    return <div> Kein Zugriff – Diese Seite ist nur für: {allowedRoles.join(', ')}</div>;
  }

  return <>{children}</>;
}
