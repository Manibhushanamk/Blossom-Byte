'use client';

import { ReactLenis } from '@studio-freight/react-lenis';

export default function SmoothScrollWrapper({ children }) {
  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothTouch: true }}>
      {children}
    </ReactLenis>
  );
}
