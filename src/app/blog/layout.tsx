import '../seo-globals.css';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main style={{ padding: '3rem 0 4rem' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
