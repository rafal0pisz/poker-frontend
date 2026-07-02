import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Poker online z przyjaciółmi — darmowa gra bez rejestracji',
  description: 'Zagraj w pokera online z przyjaciółmi bez rejestracji i pobierania. Stwórz pokój, wyślij link, grajcie razem. Texas Hold\'em, Omaha, Crazy Pineapple i więcej.',
  alternates: { canonical: 'https://pokero.pl/poker-online-z-przyjaciolmi/' },
};

export default function PokerOnlinePage() {
  return (
    <>
      <Nav />
      <main style={{ padding: '3rem 0 4rem' }}>
        <div className="container">
          <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Darmowe · Bez rejestracji · Działa w przeglądarce</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.8rem)', marginBottom: '1rem' }}>Poker online z przyjaciółmi</h1>
            <p style={{ fontSize: '1.1rem', color: 'rgba(var(--pk-cream-rgb),0.65)', maxWidth: 640, lineHeight: 1.7 }}>
              Wirtualny stół pokerowy dla znajomych — otwórz pokój, wyślij link i zacznijcie grać w minutę. Żadnej rejestracji, żadnego pobierania, żadnych prawdziwych pieniędzy.
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/" className="btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>Stwórz pokój →</Link>
              <Link href="/zasady/" className="btn-outline">Zasady gry</Link>
            </div>
          </div>

          <div className="prose">
            <h2>Jak zacząć grę w 60 sekund</h2>
            <ol>
              <li><strong>Wejdź na pokero.pl</strong> — nie potrzebujesz konta ani emaila</li>
              <li><strong>Kliknij &quot;Create Room&quot;</strong> i ustaw blindy oraz liczbę miejsc</li>
              <li><strong>Wyślij link znajomym</strong> — każdy dołącza klikając w URL</li>
              <li><strong>Admin rozdaje żetony i zaczyna grę</strong> — to wszystko</li>
            </ol>

            <h2>Dlaczego Pokero, nie aplikacja?</h2>
            <p>Większość aplikacji do pokera wymaga rejestracji, pobierania, tworzenia kont przez wszystkich graczy i często płacenia za funkcje premium. Pokero działa inaczej:</p>
            <ul>
              <li><strong>Bez rejestracji</strong> — wpisujesz tylko nick i dołączasz do pokoju</li>
              <li><strong>Działa na telefonie</strong> — otwórz link w Safari lub Chrome, bez instalowania</li>
              <li><strong>Wirtualne żetony</strong> — gram o stawki ustalane przez graczy, bez prawdziwych pieniędzy</li>
              <li><strong>Dealer&apos;s Choice</strong> — każdy gracz wybiera wariant na swoją turę jako dealer</li>
            </ul>

            <h2>Do czego używa się Pokero</h2>

            <h3>Wieczór gier u znajomych</h3>
            <p>Klasyczne zastosowanie — zbierasz się z grupą znajomych, ktoś otwiera pokój na laptopie lub telefonie, pozostali dołączają z własnych urządzeń. Żetony są wirtualne, więc możesz grać o symboliczne stawki ustalone wcześniej lub po prostu dla zabawy.</p>

            <h3>Zdalna integracja zespołu</h3>
            <p>Praca zdalna nie wyklucza pokerowego wieczoru. Każdy ze swojego domu, wspólny pokój Pokero — łączy się to dobrze z rozmową na Zoomie czy Google Meet w tle.</p>

            <h3>Nauka pokera</h3>
            <p>Nowi gracze mogą ćwiczyć zasady bez ryzyka finansowego. Możliwość grania różnymi wariantami (Texas, Omaha, Drawmaha) w jednej sesji przez Dealer&apos;s Choice ułatwia porównanie stylów gry.</p>

            <h2>Dostępne warianty</h2>
            <p>Pokero oferuje 6 wariantów pokera w jednym pokoju:</p>
            <ul>
              <li><Link href="/zasady/texas-holdem/">Texas Hold&apos;em</Link> — klasyk, 2 karty na rękę</li>
              <li><Link href="/zasady/omaha/">Omaha</Link> — 4 karty, zasada 2+3</li>
              <li><Link href="/zasady/omaha-pot-limit/">Omaha Pot Limit</Link> — PLO z limitem raise</li>
              <li><Link href="/zasady/crazy-pineapple/">Crazy Pineapple</Link> — 3 karty, Texas-style</li>
              <li><Link href="/zasady/drawmaha/">Drawmaha</Link> — wymiana kart, split pot</li>
              <li><Link href="/zasady/drawmaha-pot-limit/">Drawmaha Pot Limit</Link> — jak wyżej z pot limit</li>
            </ul>

            <h2>Dealer&apos;s Choice — każdy gra w co chce</h2>
            <p>W trybie Dealer&apos;s Choice każdy gracz gdy jest dilerem może wybrać wariant na tę rękę. To oznacza że w jednej sesji można zagrać kilka rąk Texas, potem Omahę, potem Drawmahę — bez przerywania gry. Idealne dla grup gdzie gracze mają różne preferencje.</p>

            <h2>Bezpieczeństwo i prywatność</h2>
            <p>Pokero nie zbiera danych osobowych. Nie wymagamy emaila, nazwiska ani żadnych danych kontaktowych. Pokój istnieje tylko w pamięci serwera przez czas trwania sesji — po zamknięciu znika. Link do pokoju jest unikalny i nie jest publicznie indeksowany.</p>

            <h2>Wymagania techniczne</h2>
            <p>Jedyne co potrzebujesz to przeglądarka internetowa. Pokero działa w Chrome, Safari, Firefox i Edge — na komputerze, tablecie i telefonie. Nie wymaga żadnych wtyczek ani dodatkowego oprogramowania.</p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/" className="btn-primary">Zagraj teraz →</Link>
            <Link href="/zasady/" className="btn-outline">Zasady gry</Link>
            <Link href="/kalkulatory/texas-holdem/" className="btn-outline">Kalkulator odds</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
