import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Poker na telefonie ze znajomymi — jak grać na iOS i Android',
  description: 'Jak grać w pokera na telefonie ze znajomymi. Aplikacje, przeglądarki, prywatne pokoje online. Porównanie opcji na iPhone i Android.',
  alternates: { canonical: 'https://pokero.pl/blog/poker-na-telefonie/' },
  openGraph: { type: 'article', publishedTime: '2026-05-28' },
};

export default function Post9() {
  return (
    <div className="container">
      <div style={{ marginBottom: '0.5rem' }}>
        <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Strona główna</Link>
        <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
        <Link href="/blog/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Blog</Link>
        <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.6)' }}>Poker na telefonie</span>
      </div>
      <div style={{ maxWidth: 720, marginTop: '1.5rem' }}>
        <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Poradniki</span>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Poker na telefonie ze znajomymi — jak grać na iOS i Android
        </h1>
        <p style={{ color: 'rgba(var(--pk-cream-rgb),0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>28 maja 2026 · 6 min czytania</p>
        <div className="prose">
          <p>Chcesz zagrać w pokera ze znajomymi z telefonu, szybko i bez instalowania niczego? W 2026 roku to prostsze niż kiedykolwiek. Oto wszystko co musisz wiedzieć.</p>

          <h2>Czy Pokero działa na telefonie?</h2>
          <p>Tak — Pokero jest w pełni zoptymalizowane pod urządzenia mobilne. Działa w przeglądarce Safari na iPhone i Chrome na Androidzie. Nie trzeba niczego instalować — wchodzisz na pokero.pl i grasz.</p>
          <p>Interfejs jest zaprojektowany specjalnie z myślą o małych ekranach: przyciski akcji są odpowiednio duże, karty czytelne, timer widoczny. Możesz trzymać telefon w pionie przez cały czas gry.</p>

          <h2>Jak zacząć w 30 sekund</h2>
          <ol>
            <li>Otwórz Safari lub Chrome na telefonie</li>
            <li>Wejdź na <strong>pokero.pl</strong></li>
            <li>Wpisz nick i kliknij "Create room"</li>
            <li>Wyślij kod pokoju znajomym przez iMessage/WhatsApp</li>
            <li>Grasz</li>
          </ol>

          <h2>iOS Safari — kilka wskazówek</h2>
          <p>Na iPhonie Safari blokuje dźwięk do pierwszego dotknięcia ekranu. W Pokero jest przycisk 🔊 który odblokuje dźwięki kart i żetonów — warto go kliknąć przed pierwszą ręką.</p>
          <p>Jeśli chcesz mieć szybki dostęp — dodaj Pokero do ekranu głównego: w Safari kliknij ikonę udostępniania i wybierz "Dodaj do ekranu głównego". Ikona pojawi się jak aplikacja, będzie działać jak pełnoekranowa gra.</p>

          <h2>Android Chrome</h2>
          <p>Na Androidzie działa bez żadnych ograniczeń. Podobnie jak na iOS — możesz dodać do ekranu głównego przez menu Chrome "Dodaj do ekranu głównego". Dźwięki działają od razu bez dodatkowych kroków.</p>

          <h2>Grasz razem w jednym pokoju?</h2>
          <p>Jeśli spotykasz się ze znajomymi fizycznie ale chcesz grać online (np. ktoś nie ma kart i żetonów) — każdy łączy się ze swojego telefonu do tego samego pokoju. Każdy widzi swoje karty tylko na swoim ekranie.</p>

          <h2>Kamera i mikrofon</h2>
          <p>Pokero nie wymaga dostępu do kamery ani mikrofonu — gra jest czysto tekstowo-graficzna. Dla rozmów głosowych użyj dowolnego komunikatora równolegle: FaceTime, WhatsApp, Discord.</p>
        </div>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary">🎰 Zagraj teraz na telefonie</Link>
          <Link href="/blog/poker-ze-znajomymi-online/" className="btn-outline">Poker ze znajomymi online →</Link>
        </div>
        <hr className="divider" style={{ marginTop: '2.5rem' }} />
        <p style={{ color: 'rgba(var(--pk-cream-rgb),0.35)', fontSize: '0.85rem' }}>
          Powiązane: <Link href="/blog/poker-ze-znajomymi-online/">Jak grać ze znajomymi online</Link> · <Link href="/blog/gry-online-ze-znajomymi/">Gry online ze znajomymi</Link>
        </p>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "Poker na telefonie ze znajomymi — jak grać na iOS i Android",
              "datePublished": "2026-05-28",
              "publisher": {
                "@type": "Organization",
                "name": "Pokero",
                "url": "https://pokero.pl"
              },
              "mainEntityOfPage": "https://pokero.pl/blog/poker-na-telefonie/"
            }),
          }}
        />
      </div>
    </div>
  );
}
