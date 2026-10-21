'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export type PortalRole = 'member' | 'service_center';

interface PortalRoleContextValue {
  role:    PortalRole;
  setRole: (r: PortalRole) => void;
}

const PortalRoleContext = createContext<PortalRoleContextValue>({
  role:    'member',
  setRole: () => {},
});

export function PortalRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<PortalRole>('member');

  // MOCK ONLY — BACKEND_REQUIRED_LATER
  useEffect(() => {
    const stored = localStorage.getItem('gl-role');
    if (stored === 'sc') setRole('service_center');
  }, []);

  return (
    <PortalRoleContext.Provider value={{ role, setRole }}>
      {children}
    </PortalRoleContext.Provider>
  );
}

export function usePortalRole() {
  return useContext(PortalRoleContext);
}
