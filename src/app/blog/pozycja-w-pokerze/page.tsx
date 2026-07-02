import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pozycja w pokerze — dlaczego dealer ma przewagę',
  description: 'Pozycja w pokerze — co to jest, dlaczego ma znaczenie i jak ją wykorzystać. Early, middle i late position. Dealer, cutoff, under the gun — wyjaśnione prosto.',
  alternates: { canonical: 'https://pokero.pl/blog/pozycja-w-pokerze/' },
  openGraph: { type: 'article', publishedTime: '2026-05-24' },
};

export default function Post6() {
  return (
    <div className="container">
      <div style={{ marginBottom: '0.5rem' }}>
        <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Strona główna</Link>
        <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
        <Link href="/blog/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Blog</Link>
        <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.6)' }}>Pozycja w pokerze</span>
      </div>
      <div style={{ maxWidth: 720, marginTop: '1.5rem' }}>
        <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Strategia</span>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Pozycja w pokerze — dlaczego dealer ma przewagę i jak to wykorzystać
        </h1>
        <p style={{ color: 'rgba(var(--pk-cream-rgb),0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>24 maja 2026 · 7 min czytania</p>
        <div className="prose">
          <p>Doświadczeni gracze pokerowi często mówią: "Gram kartami, nie pozycją." To nieprawda — pozycja przy stole to jedna z największych przewag w pokerze. Granie na pozycji (jako ostatni) daje Ci informacje których inni nie mają.</p>

          <h2>Co to jest "pozycja" w pokerze?</h2>
          <p>Pozycja to kolejność w której gracze podejmują decyzje w danej rundzie. W Texas Hold'em na flopie, turnie i riverze — dealer gra ostatni (lub prawie ostatni). To ogromna przewaga bo widzisz co zrobili wszyscy przed Tobą zanim sam zdecydujesz.</p>

          <h2>Nazwy pozycji przy stole</h2>
          <table>
            <thead><tr><th>Pozycja</th><th>Skrót</th><th>Kolejność</th><th>Ocena</th></tr></thead>
            <tbody>
              <tr><td>Under the Gun</td><td>UTG</td><td>Pierwszy po blindach</td><td>❌ Najgorsza</td></tr>
              <tr><td>Middle Position</td><td>MP</td><td>Środek stołu</td><td>⚠️ Średnia</td></tr>
              <tr><td>Hijack</td><td>HJ</td><td>Dwa przed dealerem</td><td>🟡 Dobra</td></tr>
              <tr><td>Cutoff</td><td>CO</td><td>Jeden przed dealerem</td><td>✅ Bardzo dobra</td></tr>
              <tr><td>Dealer (Button)</td><td>BTN</td><td>Ostatni po preflopie</td><td>✅✅ Najlepsza</td></tr>
              <tr><td>Small Blind</td><td>SB</td><td>Pierwszy po preflopie</td><td>❌ Zła</td></tr>
              <tr><td>Big Blind</td><td>BB</td><td>Drugi po preflopie</td><td>❌ Zła</td></tr>
            </tbody>
          </table>

          <h2>Dlaczego dealer (Button) ma największą przewagę?</h2>
          <p>Dealer gra ostatni na każdej ulicy (flop, turn, river). To oznacza że:</p>
          <ul>
            <li>Widzi czy inni checkują (słabość) czy betują (siła)</li>
            <li>Może ukraść pulę bet gdy wszyscy są słabi</li>
            <li>Może kontrolować rozmiar puli — check back lub bet po swojemu</li>
            <li>Ma więcej informacji przy każdej decyzji</li>
          </ul>
          <p>Prosta zasada: z Buttona możesz grać szerszy zakres rąk niż z UTG. Ręka która jest za słaba z wczesnej pozycji, może być całkiem grywalna z Buttona.</p>

          <h2>Jak to wygląda w Pokero?</h2>
          <p>W Pokero przy każdym siedzeniu widzisz badge "D" (dealer), "SB" i "BB". Dealer rotuje po każdej ręce zgodnie z ruchem wskazówek zegara. Warto zwrócić uwagę na swoją pozycję zanim zdecydujesz czy wejść do puli.</p>

          <h2>Praktyczne wskazówki dla każdej pozycji</h2>
          <h3>Z wczesnej pozycji (UTG, MP)</h3>
          <p>Graj tylko silne ręce — pary od 9+, asy z wysoką kartą, figury kolorowe. Unikaj spekulatywnych rąk bo za Tobą gra jeszcze wielu graczy którzy mogą podbić.</p>

          <h3>Z późnej pozycji (CO, Button)</h3>
          <p>Możesz grać szeroko. Spekulatywne ręce (małe pary, konektor kolorowy), próby kradzieży blindów gdy wszyscy pasują. To Twój czas żeby zarobić żetony.</p>

          <h3>Z blindów</h3>
          <p>Masz już część żetonów w puli — call jest tańszy. Ale grasz w złej pozycji przez całą rękę. Defend z dobrymi rękami, ale nie bądź zbyt przywiązany do żetonów które już wpłaciłeś.</p>
        </div>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary">🎰 Zagraj i ćwicz pozycję</Link>
          <Link href="/blog/jak-blefowac-w-pokerze/" className="btn-outline">Jak blefować →</Link>
        </div>
        <hr className="divider" style={{ marginTop: '2.5rem' }} />
        <p style={{ color: 'rgba(var(--pk-cream-rgb),0.35)', fontSize: '0.85rem' }}>
          Powiązane: <Link href="/blog/jak-blefowac-w-pokerze/">Jak blefować w pokerze</Link> · <Link href="/zasady/texas-holdem/">Zasady Texas Hold'em</Link>
        </p>
      </div>
    </div>
  );
}
