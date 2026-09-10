'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function SetupGuard({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Database is now completely optional. 
    // We just wait a tick for stability.
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-background)', color: 'var(--color-primary)' }}>
        Loading System...
      </div>
    );
  }

  return children;
}
