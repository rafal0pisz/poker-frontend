import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ borderTop: '1px solid rgba(212,175,55,0.1)', background: '#0d0d14', marginTop: '4rem', padding: '2.5rem 0 2rem' }}>
      <div className="container-wide">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <p style={{ fontWeight: 700, color: '#d4af37', marginBottom: '0.75rem', fontSize: '0.95rem' }}>Pokero</p>
            <p style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.45)', lineHeight: 1.6 }}>
              Prywatny stół pokerowy online.<br />Bez rejestracji, bez pieniędzy.
            </p>
          </div>
          <div>
            <p style={{ fontWeight: 600, color: 'rgba(245,230,192,0.6)', marginBottom: '0.75rem', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Gra</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <Link href="/pl/" style={{ fontSize: '0.9rem', color: 'rgba(245,230,192,0.6)' }}>Homepage</Link>
              <Link href="/" style={{ fontSize: '0.9rem', color: 'rgba(245,230,192,0.6)' }}>Zagraj teraz</Link>
              <Link href="/zasady/" style={{ fontSize: '0.9rem', color: 'rgba(245,230,192,0.6)' }}>Zasady gry</Link>
            </div>
          </div>
          <div>
            <p style={{ fontWeight: 600, color: 'rgba(245,230,192,0.6)', marginBottom: '0.75rem', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Warianty</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[['Texas Hold\'em', '/zasady/texas-holdem/'], ['Omaha', '/zasady/omaha/'], ['Crazy Pineapple', '/zasady/crazy-pineapple/'], ['Drawmaha', '/zasady/drawmaha/']].map(([name, href]) => (
                <Link key={href} href={href} style={{ fontSize: '0.9rem', color: 'rgba(245,230,192,0.6)' }}>{name}</Link>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontWeight: 600, color: 'rgba(245,230,192,0.6)', marginBottom: '0.75rem', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Inne</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <Link href="/blog/" style={{ fontSize: '0.9rem', color: 'rgba(245,230,192,0.6)' }}>Blog</Link>
              <Link href="/kontakt/" style={{ fontSize: '0.9rem', color: 'rgba(245,230,192,0.6)' }}>Kontakt</Link>
              <Link href="https://pokero.eu" style={{ fontSize: '0.9rem', color: 'rgba(245,230,192,0.6)' }}>Pokero EN 🇬🇧</Link>
            </div>
          </div>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid rgba(212,175,55,0.08)', marginBottom: '1.25rem' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'rgba(245,230,192,0.3)', margin: 0 }}>© {year} Pokero. Aplikacja do pokera towarzyskiego — wirtualne żetony, bez pieniędzy.</p>
          <p style={{ fontSize: '0.8rem', color: 'rgba(245,230,192,0.3)', margin: 0 }}>Gra odpowiedzialna · 18+</p>
        </div>
      </div>
    </footer>
  );
}
