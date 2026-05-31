import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Poker ze znajomymi online — jak to zorganizować krok po kroku',
  description: 'Poradnik: jak zorganizować wieczór pokerowy ze znajomymi przez internet. Aplikacja, ustalenie zasad, żetony, warianty. Bez rejestracji, bez pieniędzy.',
  alternates: { canonical: 'https://pokero.pl/blog/poker-ze-znajomymi-online/' },
  openGraph: {
    title: 'Poker ze znajomymi online — jak to zorganizować',
    description: 'Poradnik organizacji wieczoru pokerowego online.',
    type: 'article',
    publishedTime: '2026-05-08',
  },
};

export default function Post2() {
  return (
    <div className="container">
      <div style={{ marginBottom: '0.5rem' }}>
        <Link href="/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Strona główna</Link>
        <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
        <Link href="/blog/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Blog</Link>
        <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Poker ze znajomymi online</span>
      </div>

      <div style={{ maxWidth: 720, marginTop: '1.5rem' }}>
        <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Poradniki</span>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Poker ze znajomymi online — jak to zorganizować krok po kroku
        </h1>
        <p style={{ color: 'rgba(245,230,192,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>8 maja 2026 · 6 min czytania</p>

        <div className="prose">
          <p>
            Znajomi są rozrzuceni po różnych miastach, a Ty chcesz zorganizować wieczór pokerowy? Dobrze trafiłeś. W tym artykule pokażę Ci jak w kilka minut uruchomić prywatny stół pokerowy online — zupełnie za darmo i bez żadnej rejestracji.
          </p>

          <h2>Czego potrzebujesz?</h2>
          <ul>
            <li>Telefon lub komputer z przeglądarką (Chrome, Safari, Firefox)</li>
            <li>Znajomi z dostępem do internetu</li>
            <li>Komunikator do rozmowy (Discord, Zoom, Messenger — dowolny)</li>
          </ul>
          <p>
            Nic więcej. Żadnych pobrań, żadnych kont, żadnych płatności.
          </p>

          <h2>Krok 1 — Stwórz pokój</h2>
          <p>
            Wejdź na <Link href="/graj/">pokero.pl/graj</Link>, wpisz swój nick i kliknij „Create room". Zajmuje to dosłownie 20 sekund. Zostaniesz adminem — masz pełną kontrolę nad grą.
          </p>
          <p>
            Jako admin ustawiasz:
          </p>
          <ul>
            <li>Wysokość blindów (domyślnie 5/10, możesz zmienić)</li>
            <li>Liczbę żetonów startowych dla każdego gracza</li>
            <li>Czas na decyzję (15, 30 lub 60 sekund)</li>
          </ul>

          <h2>Krok 2 — Zaproś znajomych</h2>
          <p>
            Po stworzeniu pokoju otrzymujesz <strong>krótki kod</strong> (np. "XKPQ71"). Wyślij go znajomym — przez SMS, Messengera, WhatsApp czy cokolwiek innego. Żeby dołączyć, wystarczy że wejdą na pokero.pl i wpiszą kod.
          </p>
          <p>
            Możesz zaprosić do 9 graczy przy jednym stole.
          </p>

          <h2>Krok 3 — Dodaj żetony i startuj</h2>
          <p>
            Kiedy wszyscy są w pokoju, admin (czyli Ty) dodaje żetony każdemu graczowi przez panel admina. Ustal z góry ile każdy "wchodzi" — np. 1000 żetonów startowych.
          </p>
          <p>
            Kliknij "Start game" i grasz. Karty są rozdawane automatycznie.
          </p>

          <h2>Wskazówki dla dobrego wieczoru</h2>

          <h3>Uruchomcie rozmowę głosową</h3>
          <p>
            Poker to gra towarzyska. Najlepiej gra się kiedy słyszysz znajomych — blefowanie i czytanie przeciwników staje się dużo ciekawsze. Discord, Zoom albo zwykły telefon działają świetnie.
          </p>

          <h3>Ustalcie zasady przed grą</h3>
          <p>
            Nawet na wirtualne żetony warto ustalić kilka rzeczy:
          </p>
          <ul>
            <li>Jak długo gracie? (np. 2 godziny albo do wyczyszczenia stołu)</li>
            <li>Czy można "dokupić" żetony? (rebuy)</li>
            <li>Jaki wariant gry — Texas Hold&apos;em czy Dealer&apos;s Choice?</li>
          </ul>

          <h3>Dealer&apos;s Choice — niech każda ręka będzie inna</h3>
          <p>
            W Pokero możesz włączyć tryb Dealer&apos;s Choice — wtedy każdy gracz ustawia swój ulubiony wariant (Texas, Omaha, Crazy Pineapple, Drawmaha) i gdy zostaje dealerem, gra swój wariant. To świetny sposób na urozmaicenie wieczoru.
          </p>

          <h3>Daj czas na naukę</h3>
          <p>
            Jeśli ktoś ze znajomych nie grał wcześniej w pokera — zajrzyj razem do <Link href="/zasady/texas-holdem/">zasad Texas Hold&apos;em</Link>. Podstawy można ogarnąć w 5 minut, a pierwsze rozdanie będzie najlepszą nauką.
          </p>

          <h2>Poker towarzyski a prawo polskie</h2>
          <p>
            Granie w pokera na wirtualne żetony bez wartości pieniężnej jest w Polsce całkowicie legalne. Pokero nie umożliwia żadnych wypłat — to gra rekreacyjna, nie hazard. Możesz grać bez żadnych obaw.
          </p>
        </div>

        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 14 }}>
          <p style={{ fontWeight: 600, color: '#d4af37', marginBottom: '0.5rem' }}>Gotowy na wieczór pokerowy?</p>
          <p style={{ color: 'rgba(245,230,192,0.6)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>Stwórz pokój w 30 sekund i zaproś znajomych. Działa na telefonie.</p>
          <Link href="/graj/" className="btn-primary">🎰 Zagraj teraz — za darmo</Link>
        </div>

        <hr className="divider" style={{ marginTop: '2.5rem' }} />
        <p style={{ color: 'rgba(245,230,192,0.35)', fontSize: '0.85rem' }}>
          Powiązane: <Link href="/blog/zasady-pokera-texas-holdem/">Zasady Texas Hold&apos;em</Link> · <Link href="/zasady/">Wszystkie zasady gry</Link>
        </p>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: 'Poker ze znajomymi online — jak to zorganizować krok po kroku',
              datePublished: '2026-05-08',
              publisher: { '@type': 'Organization', name: 'Pokero', url: 'https://pokero.pl' },
              mainEntityOfPage: 'https://pokero.pl/blog/poker-ze-znajomymi-online/',
            }),
          }}
        />
      </div>
    </div>
  );
}
