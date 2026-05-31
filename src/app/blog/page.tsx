import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Blog o pokerze — zasady, strategia, organizacja gier',
  description: 'Artykuły o pokerze: zasady gier, strategie, jak organizować domowe turnieje, poker ze znajomymi online. Praktyczne poradniki dla każdego poziomu.',
  alternates: { canonical: 'https://pokero.pl/blog/' },
};

const posts = [
  {
    href: '/blog/zasady-pokera-texas-holdem/',
    tag: 'Zasady',
    title: "Jak grać w pokera Texas Hold'em — zasady dla początkujących",
    desc: "Kompletny przewodnik po Texas Hold'em: od rozdania kart po showdown. Jeśli nigdy nie grałeś w pokera — zacznij tutaj.",
    date: '2026-05-01',
  },
  {
    href: '/blog/poker-ze-znajomymi-online/',
    tag: 'Poradniki',
    title: 'Poker ze znajomymi online — jak to zorganizować krok po kroku',
    desc: 'Jak szybko i bezproblemowo zorganizować wieczór pokerowy z przyjaciółmi przez internet. Bez instalacji, bez rejestracji.',
    date: '2026-05-08',
  },
  {
    href: '/blog/uklady-kart-poker/',
    tag: 'Zasady',
    title: 'Układy kart w pokerze — pełna tabela z przykładami',
    desc: 'Wszystkie 10 układów pokerowych wyjaśnionych prosto. Od Royal Flush po Wysoką kartę — z przykładami i często zadawanymi pytaniami.',
    date: '2026-05-15',
  },
];

export default function BlogPage() {
  return (
    <>
      <Nav />
      <main style={{ padding: '3rem 0 4rem' }}>
        <div className="container">
          <div style={{ marginBottom: '0.5rem' }}>
            <Link href="/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Strona główna</Link>
            <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
            <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Blog</span>
          </div>
          <h1 style={{ fontSize: '2rem', margin: '1.5rem 0 0.5rem' }}>Blog</h1>
          <p style={{ color: 'rgba(245,230,192,0.5)', marginBottom: '2.5rem' }}>Zasady, strategie i wszystko o pokerze ze znajomymi</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {posts.map((p) => (
              <Link key={p.href} href={p.href} style={{ textDecoration: 'none' }}>
                <div className="card card-hover"
>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                    <span className="badge">{p.tag}</span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(245,230,192,0.3)' }}>{new Date(p.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <h2 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', lineHeight: 1.35 }}>{p.title}</h2>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(245,230,192,0.55)', margin: 0 }}>{p.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
