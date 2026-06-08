import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Zasady gry w pokera — Texas Hold\'em, Omaha, Drawmaha, Pot Limit i więcej',
  description: 'Zasady wszystkich wariantów pokera w Pokero: Texas, Omaha, Omaha Pot Limit, Drawmaha, Crazy Pineapple i więcej. Układy kart, strategia, porównania.',
  alternates: { canonical: 'https://pokero.pl/zasady/' },
};

const variants = [
  { href: '/zasady/texas-holdem/', icon: '♠', name: "Texas Hold'em", sub: '2 karty na rękę', desc: 'Najпопуларniejszy wariant pokera na świecie. Dwie karty zakryte, pięć wspólnych. Klasyk obowiązkowy na każdym stole.' },
  { href: '/zasady/omaha/', icon: '♦', name: 'Omaha', sub: '4 karty na rękę', desc: 'Cztery karty na ręce — musisz użyć dokładnie 2 z nich. Więcej kombinacji, więcej emocji.' },
  { href: '/zasady/crazy-pineapple/', icon: '🍍', name: 'Crazy Pineapple', sub: '3 karty na rękę', desc: 'Texas Hold\'em z 3 kartami na ręce. Więcej opcji, więcej kombinacji — te same zasady ewaluacji.' },
  { href: '/zasady/drawmaha/', icon: '🃏', name: 'Drawmaha', sub: '5 kart + wymiana', desc: 'Unikalny wariant z wymianą kart i split potem. Łączy Omahę z Five-Card Draw — pula dzielona między dwóch zwycięzców.' },
  { href: '/zasady/omaha-pot-limit/', icon: '♦', name: 'Omaha Pot Limit', sub: 'PLO · limit puli', desc: 'Omaha z ograniczeniem raise do rozmiaru puli. Bardziej strategiczna niż No Limit — pozycja i głęboka gra mają kluczowe znaczenie.' },
  { href: '/zasady/drawmaha-pot-limit/', icon: '🃏', name: 'Drawmaha Pot Limit', sub: 'Split pot · limit puli', desc: 'Drawmaha z Pot Limit. Wymiana kart, dwie połowy puli i ograniczony raise — najbardziej wymagający wariant w Pokero.' },
  { href: '/zasady/pineapple-klasyczny/', icon: '🍍', name: 'Pineapple Classic', sub: '3 karty → wyrzut', desc: '3 karty na rękę, po licytacji na flopie wyrzucasz jedną. Od turn grasz jak w Texas z 2 kartami.' },
  { href: '/zasady/uklady-kart/', icon: '🏆', name: 'Układy kart', sub: 'Od Royal Flush do Wysokiej karty', desc: 'Kompletna tabela układów pokerowych od najsilniejszego do najsłabszego. Z przykładami dla każdego.' },
];

export default function ZasadyPage() {
  return (
    <>
      <Nav />
      <main style={{ padding: '3rem 0 4rem' }}>
        <div className="container">
          <div style={{ marginBottom: '0.5rem' }}>
            <Link href="/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Strona główna</Link>
            <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
            <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Zasady gry</span>
          </div>

          <h1 style={{ fontSize: '2rem', margin: '1.5rem 0 0.75rem' }}>Zasady gry w pokera</h1>
          <p style={{ color: 'rgba(245,230,192,0.6)', fontSize: '1.05rem', maxWidth: 580, marginBottom: '2.5rem' }}>
            Wszystko co musisz wiedzieć żeby zacząć grać. Wybierz wariant który Cię interesuje lub zacznij od układów kart.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {variants.map((v) => (
              <Link key={v.href} href={v.href} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', cursor: 'pointer', transition: 'border-color 0.15s' }}
>
                  <div style={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0, marginTop: '0.1rem' }}>{v.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <h2 style={{ fontSize: '1.05rem', margin: 0, color: '#d4af37' }}>{v.name}</h2>
                      <span className="badge">{v.sub}</span>
                    </div>
                    <p style={{ margin: '0.4rem 0 0', fontSize: '0.9rem', color: 'rgba(245,230,192,0.55)' }}>{v.desc}</p>
                  </div>
                  <span style={{ color: '#d4af37', flexShrink: 0, alignSelf: 'center' }}>→</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="card" style={{ marginTop: '2.5rem', textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'rgba(245,230,192,0.6)', marginBottom: '1.25rem' }}>Znasz zasady? Czas zagrać.</p>
            <Link href="/" className="btn-primary">🎰 Zagraj teraz — za darmo</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
