'use client';
import Link from 'next/link';
import { useState } from 'react';

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{ borderBottom: '1px solid rgba(212,175,55,0.1)', background: 'rgba(13,13,20,0.95)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container-wide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <Link href="/pl/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <svg width="110" height="28" viewBox="0 0 186 46" xmlns="http://www.w3.org/2000/svg">
            <text x="4" y="38" fontFamily="Rajdhani,'Arial Narrow',sans-serif" fontWeight="700" fontSize="40" fill="#d4af37" textLength="140" lengthAdjust="spacingAndGlyphs">POKER</text>
            <circle cx="159" cy="24" r="14.5" fill="#0d0d14" stroke="#d4af37" strokeWidth="2.3"/>
            <circle cx="159" cy="24" r="9.5" fill="#7a1414"/>
            <circle cx="159" cy="24" r="12.2" fill="none" stroke="#f5d76e" strokeWidth="0.8" strokeDasharray="2.2 1.9" opacity="0.75"/>
            <circle cx="159" cy="24" r="6.2" fill="none" stroke="#d4af37" strokeWidth="1"/>
          </svg>
        </Link>

        {/* Desktop menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          <Link href="/pl/" style={{ color: 'rgba(245,230,192,0.7)', fontSize: '0.9rem', textDecoration: 'none' }}>Strona główna</Link>
          <Link href="/zasady/" style={{ color: 'rgba(245,230,192,0.7)', fontSize: '0.9rem', textDecoration: 'none' }}>Zasady gry</Link>
          <Link href="/blog/" style={{ color: 'rgba(245,230,192,0.7)', fontSize: '0.9rem', textDecoration: 'none' }}>Blog</Link>
          <Link href="/kontakt/" style={{ color: 'rgba(245,230,192,0.7)', fontSize: '0.9rem', textDecoration: 'none' }}>Kontakt</Link>
          <Link href="/" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Zagraj teraz</Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} style={{ display: 'none', background: 'none', border: 'none', color: '#d4af37', fontSize: '1.5rem', cursor: 'pointer' }} className="mobile-menu-btn" aria-label="Menu">
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <div style={{ background: '#13131f', borderTop: '1px solid rgba(212,175,55,0.1)', padding: '1rem 1.25rem' }}>
          {[['/pl/', 'Strona główna'], ['/zasady/', 'Zasady gry'], ['/blog/', 'Blog'], ['/kontakt/', 'Kontakt']].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              style={{ display: 'block', padding: '0.65rem 0', color: 'rgba(245,230,192,0.8)', borderBottom: '1px solid rgba(212,175,55,0.06)', textDecoration: 'none' }}>
              {label}
            </Link>
          ))}
          <Link href="/" className="btn-primary" onClick={() => setOpen(false)}
            style={{ display: 'inline-flex', marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
            🎰 Zagraj teraz
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
