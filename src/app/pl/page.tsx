import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Pokero — Poker ze znajomymi online | Bez rejestracji',
  description: 'Zagraj w pokera ze znajomymi przez internet. Stwórz prywatny stół w 30 sekund — bez rejestracji, bez pieniędzy. Texas Hold\'em, Omaha, Crazy Pineapple i Drawmaha.',
  alternates: { canonical: 'https://pokero.pl' },
};

const features = [
  { icon: '⚡', title: 'Gotowy w 30 sekund', desc: 'Stwórz pokój, wyślij link znajomym — i grasz. Żadnych kont, żadnych formularzy.' },
  { icon: '🔒', title: 'Bez rejestracji', desc: 'Wejdź, podaj nick i zaproś znajomych. Tyle wystarczy.' },
  { icon: '📱', title: 'Działa na telefonie', desc: 'Pełna obsługa iOS i Android. Zagraj ze znajomymi z kanapy.' },
  { icon: '💰', title: 'Wirtualne żetony', desc: 'Gra towarzyska na żetony bez wartości. Legalnie, bez hazardu.' },
  { icon: '🃏', title: '4 warianty gry', desc: 'Texas Hold\'em, Omaha, Crazy Pineapple i unikatowa Drawmaha.' },
  { icon: '👑', title: 'Panel admina', desc: 'Zarządzaj grą, dodawaj żetony, zmieniaj wariant — pełna kontrola.' },
];

const variants = [
  { name: "Texas Hold'em", icon: '♠', href: '/zasady/texas-holdem/', desc: '2 karty na rękę, najlepsze 5 z 7. Klasyk klasycznych.' },
  { name: 'Omaha', icon: '♦', href: '/zasady/omaha/', desc: '4 karty na rękę, musisz użyć dokładnie 2. Więcej kombinacji.' },
  { name: 'Crazy Pineapple', icon: '🍍', href: '/zasady/crazy-pineapple/', desc: '3 karty na rękę, używasz 1 lub 2. Twist na Texas.' },
  { name: 'Drawmaha', icon: '🃏', href: '/zasady/drawmaha/', desc: 'Wymiana kart + split pot. Nasz autorski wariant.' },
];

const steps = [
  { n: '1', title: 'Stwórz pokój', desc: 'Kliknij "Zagraj teraz", wpisz nick i stwórz prywatny stół.' },
  { n: '2', title: 'Zaproś znajomych', desc: 'Podziel się krótkim kodem lub linkiem. Dołączenie to 10 sekund.' },
  { n: '3', title: 'Grasz', desc: 'Admin ustawia żetony, wybiera wariant i startuje. Gotowe.' },
];

const faqs = [
  {
    q: 'Czy poker online ze znajomymi jest legalny w Polsce?',
    a: 'Tak — poker towarzyski na wirtualne żetony bez wartości pieniężnej jest w Polsce legalny. Pokero używa wyłącznie fikcyjnych żetonów i nie umożliwia żadnych wypłat. Jest to gra rekreacyjna, nie hazard.',
  },
  {
    q: 'Czy trzeba się rejestrować lub tworzyć konto?',
    a: 'Nie. Wystarczy wejść na pokero.pl, wpisać nick i stworzyć lub dołączyć do pokoju. Żadnych emaili, haseł ani kont.',
  },
  {
    q: 'Ile osób może grać jednocześnie?',
    a: 'Od 2 do 9 graczy przy jednym stole. Możesz też grać w trybie heads-up (1 vs 1).',
  },
  {
    q: 'Czy aplikacja działa na telefonie?',
    a: 'Tak, w pełni. Pokero jest zoptymalizowane pod iOS i Android. Działa w przeglądarce — nie musisz nic instalować.',
  },
  {
    q: 'Co to są Dealer\'s Choice i warianty gry?',
    a: 'W każdej ręce dealer może wybrać wariant: Texas Hold\'em, Omaha, Crazy Pineapple lub Drawmaha. Każdy gracz może ustawić swój preferowany wariant — aktywuje się kiedy zostaje dealerem.',
  },
  {
    q: 'Czy mogę grać bez znajomych — solo?',
    a: 'Do rozgrywki potrzeba minimum 2 graczy. Możesz jednak wejść solo żeby poznać interfejs, przetestować ustawienia albo poczekać aż dołączą znajomi.',
  },
];

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section style={{ padding: '5rem 0 4rem', textAlign: 'center', background: 'radial-gradient(ellipse at 50% 0%, rgba(139,26,26,0.15) 0%, transparent 60%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 20, padding: '4px 14px', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#d4af37' }}>
            🎴 Poker towarzyski · Bez rejestracji · Bez pieniędzy
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Zagraj w pokera<br />
            <span style={{ color: '#d4af37' }}>ze znajomymi online</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'rgba(245,230,192,0.65)', maxWidth: 520, margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            Prywatny stół pokerowy gotowy w 30 sekund. Zaproś znajomych linkiem — nie potrzeba konta, nie potrzeba kasy.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/graj/" className="btn-primary" style={{ fontSize: '1.05rem', padding: '0.9rem 2.25rem' }}>
              🎰 Zagraj teraz — za darmo
            </Link>
            <Link href="/zasady/" className="btn-outline">
              Zasady gry →
            </Link>
          </div>

          <p style={{ marginTop: '1.25rem', fontSize: '0.82rem', color: 'rgba(245,230,192,0.3)' }}>
            Wirtualne żetony · Gra towarzyska · Legalnie w Polsce
          </p>
        </div>
      </section>

      {/* JAK TO DZIAŁA */}
      <section style={{ padding: '4rem 0', background: 'rgba(212,175,55,0.03)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Jak to działa?</h2>
          <p style={{ textAlign: 'center', color: 'rgba(245,230,192,0.5)', marginBottom: '2.5rem' }}>Trzy kroki i siedzisz przy stole</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {steps.map((s) => (
              <div key={s.n} className="card" style={{ textAlign: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.1rem', fontWeight: 700, color: '#d4af37' }}>{s.n}</div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>{s.title}</h3>
                <p style={{ color: 'rgba(245,230,192,0.55)', fontSize: '0.9rem', margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WARIANTY GRY */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '1.75rem', marginBottom: '0.5rem' }}>4 warianty gry</h2>
          <p style={{ textAlign: 'center', color: 'rgba(245,230,192,0.5)', marginBottom: '2.5rem' }}>Dealer wybiera wariant — każda ręka może być inna</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {variants.map((v) => (
              <Link key={v.href} href={v.href} style={{ textDecoration: 'none' }}>
                <div className="card card-hover" style={{ height: '100%' }}
>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{v.icon}</div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem', color: '#d4af37' }}>{v.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.55)', margin: 0 }}>{v.desc}</p>
                  <p style={{ fontSize: '0.8rem', color: '#d4af37', marginTop: '0.75rem', marginBottom: 0 }}>Zasady →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FUNKCJE */}
      <section style={{ padding: '4rem 0', background: 'rgba(212,175,55,0.03)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Co oferuje Pokero?</h2>
          <p style={{ textAlign: 'center', color: 'rgba(245,230,192,0.5)', marginBottom: '2.5rem' }}>Wszystko czego potrzeba do dobrego wieczoru pokerowego</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {features.map((f) => (
              <div key={f.title} className="card">
                <div style={{ fontSize: '1.5rem', marginBottom: '0.6rem' }}>{f.icon}</div>
                <h3 style={{ fontSize: '0.95rem', marginBottom: '0.3rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.55)', margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA MID */}
      <section style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ background: 'radial-gradient(ellipse at center, rgba(139,26,26,0.2) 0%, transparent 70%)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 20, padding: '3rem 2rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Gotowy na wieczór pokerowy?</h2>
            <p style={{ color: 'rgba(245,230,192,0.6)', marginBottom: '2rem', maxWidth: 480, margin: '0 auto 2rem' }}>
              Stwórz pokój w 30 sekund i zaproś znajomych. Działa na każdym telefonie.
            </p>
            <Link href="/graj/" className="btn-primary" style={{ fontSize: '1.05rem' }}>
              🎰 Zagraj teraz — za darmo
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '4rem 0', background: 'rgba(212,175,55,0.03)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '1.75rem', marginBottom: '2.5rem' }}>Najczęstsze pytania</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 680, margin: '0 auto' }}>
            {faqs.map((faq) => (
              <div key={faq.q} className="card">
                <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: '#d4af37' }}>{faq.q}</h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(245,230,192,0.6)', margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>

          {/* FAQ Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map((f) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
              }),
            }}
          />
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Z naszego bloga</h2>
            <Link href="/blog/" style={{ color: '#d4af37', fontSize: '0.9rem' }}>Wszystkie artykuły →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
            {[
              { href: '/blog/zasady-pokera-texas-holdem/', title: 'Jak grać w pokera Texas Hold\'em — zasady dla początkujących', tag: 'Zasady' },
              { href: '/blog/poker-ze-znajomymi-online/', title: 'Poker ze znajomymi online — jak to zorganizować krok po kroku', tag: 'Poradniki' },
              { href: '/blog/uklady-kart-poker/', title: 'Układy kart w pokerze — pełna tabela z przykładami', tag: 'Zasady' },
            ].map((a) => (
              <Link key={a.href} href={a.href} style={{ textDecoration: 'none' }}>
                <div className="card card-hover" style={{ height: '100%' }}
>
                  <span className="badge" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>{a.tag}</span>
                  <h3 style={{ fontSize: '0.95rem', lineHeight: 1.4, color: 'rgba(245,230,192,0.9)' }}>{a.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
