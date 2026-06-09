import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Zainstaluj Pokero — aplikacja na telefonie bez App Store',
  description: 'Dodaj Pokero do ekranu głównego iPhone lub Android. Działa jak aplikacja — bez paska adresu, z ikonką na home screenie. Instrukcja krok po kroku.',
  alternates: { canonical: 'https://pokero.pl/zainstaluj/' },
};

export default function InstallPage() {
  return (
    <>
      <Nav />
      <main style={{ padding: '3rem 0 4rem' }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <div style={{ marginBottom: '2rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>PWA · Bez App Store · Działa offline</span>
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', marginBottom: '0.75rem' }}>
              Zainstaluj Pokero na telefonie
            </h1>
            <p style={{ color: 'rgba(245,230,192,0.65)', lineHeight: 1.7 }}>
              Pokero działa jako aplikacja (PWA) — dodaj ją do ekranu głównego i uruchamiaj jak normalną appkę, bez paska przeglądarki i bez pobierania czegokolwiek z App Store.
            </p>
          </div>

          <div className="prose">

            {/* iOS */}
            <div style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
              <h2 style={{ marginTop: 0 }}>iPhone / iPad (Safari)</h2>
              <ol style={{ paddingLeft: '1.25rem' }}>
                <li>Otwórz <strong>pokero.pl</strong> w przeglądarce <strong>Safari</strong> (inne przeglądarki na iOS nie obsługują PWA)</li>
                <li>Kliknij ikonę <strong>Udostępnij</strong> na dole ekranu — kwadrat ze strzałką w górę</li>
                <li>Przewiń listę i kliknij <strong>&quot;Dodaj do ekranu głównego&quot;</strong></li>
                <li>Wpisz nazwę (domyślnie &quot;Pokero&quot;) i kliknij <strong>&quot;Dodaj&quot;</strong></li>
                <li>Ikona pojawi się na ekranie głównym — uruchamiaj jak normalną aplikację</li>
              </ol>
              <p style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.45)', marginBottom: 0 }}>
                Wymagany iOS 14+ i Safari. Chrome/Firefox na iOS nie obsługują instalacji PWA.
              </p>
            </div>

            {/* Android */}
            <div style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
              <h2 style={{ marginTop: 0 }}>Android (Chrome)</h2>
              <ol style={{ paddingLeft: '1.25rem' }}>
                <li>Otwórz <strong>pokero.pl</strong> w przeglądarce <strong>Chrome</strong></li>
                <li>Kliknij menu z trzema kropkami w prawym górnym rogu</li>
                <li>Wybierz <strong>&quot;Dodaj do ekranu głównego&quot;</strong> lub <strong>&quot;Zainstaluj aplikację&quot;</strong></li>
                <li>Potwierdź klikając <strong>&quot;Zainstaluj&quot;</strong></li>
                <li>Pokero pojawi się na ekranie głównym i w szufladzie aplikacji</li>
              </ol>
              <p style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.45)', marginBottom: 0 }}>
                Na niektórych Androidach pojawia się automatyczny baner &quot;Zainstaluj Pokero&quot; po odwiedzeniu strony.
              </p>
            </div>

            {/* Desktop */}
            <div style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12, padding: '1.25rem', marginBottom: '2rem' }}>
              <h2 style={{ marginTop: 0 }}>Komputer (Chrome / Edge)</h2>
              <ol style={{ paddingLeft: '1.25rem' }}>
                <li>Otwórz <strong>pokero.pl</strong> w Chrome lub Edge</li>
                <li>W prawym górnym rogu paska adresu pojawi się ikona instalacji (monitor ze strzałką) — kliknij ją</li>
                <li>Alternatywnie: menu (⋮) → <strong>&quot;Zainstaluj Pokero&quot;</strong></li>
                <li>Po zainstalowaniu Pokero otwiera się w osobnym oknie bez paska przeglądarki</li>
              </ol>
            </div>

            <h2>Po co instalować?</h2>
            <ul>
              <li><strong>Pełny ekran</strong> — bez paska adresu i zakładek, więcej miejsca na stół pokerowy</li>
              <li><strong>Szybki dostęp</strong> — ikona na ekranie głównym, otwierasz jednym kliknięciem</li>
              <li><strong>Działa jak aplikacja</strong> — na iOS pojawia się w multitaskingu jak natywna appka</li>
              <li><strong>Tryb ciemny</strong> — automatycznie dostosowany do ustawień systemu</li>
            </ul>

          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/" className="btn-primary">Zagraj teraz →</Link>
            <Link href="/zasady/" className="btn-outline">Zasady gry</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
