import type { Metadata } from 'next';

// Overrides the root layout's manifest link so installing the "app" from
// anywhere under /pasjonaci points at the Pasjonaci-specific manifest
// (start_url: /pasjonaci) instead of the main site's.
export const metadata: Metadata = {
  manifest: '/pasjonaci/manifest.webmanifest',
};

export default function PasjonaciLayout({ children }: { children: React.ReactNode }) {
  return children;
}
