import '../seo-globals.css';

export const metadata = {
  metadataBase: new URL('https://pokero.pl'),
};

export default function PlLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
