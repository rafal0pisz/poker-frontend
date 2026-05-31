import '../seo-globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://pokero.pl'),
};

export default function PlLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
