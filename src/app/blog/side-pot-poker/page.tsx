import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Side pot w pokerze — co to jest i jak działa',
  description: 'Side pot (pula boczna) w pokerze — kiedy powstaje, jak jest dzielona, przykłady z all-in. Wszystko wyjaśnione krok po kroku.',
  alternates: { canonical: 'https://pokero.pl/blog/side-pot-poker/' },
  openGraph: { type: 'article', publishedTime: '2026-05-27' },
};

export default function Post8() {
  return (
    <div className="container">
      <div style={{ marginBottom: '0.5rem' }}>
        <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Strona główna</Link>
        <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
        <Link href="/blog/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Blog</Link>
        <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Side pot w pokerze</span>
      </div>
      <div style={{ maxWidth: 720, marginTop: '1.5rem' }}>
        <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Zasady</span>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Side pot w pokerze — co to jest i jak działa
        </h1>
        <p style={{ color: 'rgba(245,230,192,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>27 maja 2026 · 6 min czytania</p>
        <div className="prose">
          <p>Side pot to jeden z aspektów pokera który często dezorientuje początkujących. Kiedy gracz idzie all-in za mniej niż inni postawili — powstaje pula boczna. Na szczęście w Pokero wszystko jest liczone automatycznie.</p>

          <h2>Kiedy powstaje side pot?</h2>
          <p>Side pot powstaje gdy gracz idzie all-in za kwotę mniejszą niż aktualny bet. Wtedy:</p>
          <ul>
            <li>Gracz all-in może wygrać tylko tyle ile sam wpłacił od każdego z graczy (main pot)</li>
            <li>Pozostałe żetony trafiają do puli bocznej (side pot) — o którą walczą tylko gracze z wystarczającą ilością żetonów</li>
          </ul>

          <h2>Przykład — 3 graczy, wszystkie in</h2>
          <p>Gracz A ma 100 żetonów, Gracz B ma 300, Gracz C ma 500. Wszyscy idą all-in:</p>
          <ul>
            <li><strong>Main pot:</strong> 100 × 3 = 300 żetonów (o to może walczyć A, B i C)</li>
            <li><strong>Side pot 1:</strong> (300-100) × 2 = 400 żetonów (tylko B i C)</li>
            <li><strong>Side pot 2:</strong> (500-300) × 1 = 200 żetonów (tylko C)</li>
          </ul>
          <p>Jeśli A ma najlepszą rękę — wygrywa main pot (300). Side poty rozdziela osobno między B i C.</p>

          <h2>Dlaczego gracz all-in nie może wygrać więcej?</h2>
          <p>Prosta zasada: nikt nie może wygrać więcej niż wpłacił od każdego z graczy. Gdybyś mógł wpłacić 100 i wygrać 2000 — byłoby to niesprawiedliwe względem graczy którzy wpłacili więcej.</p>

          <h2>Jak to działa w Pokero?</h2>
          <p>W Pokero side poty są tworzone i rozliczane automatycznie — nie musisz nic liczyć ręcznie. Gdy kilku graczy jest all-in, system tworzy odpowiednie pule i przydziela wygrane prawidłowo. To samo dotyczy bardziej złożonych sytuacji z wieloma all-inami różnych wysokości.</p>

          <h2>Ciekawa sytuacja — all-in za mniej niż minimalny raise</h2>
          <p>Co gdy gracz chce all-in ale ma za mało żetonów na minimalny raise? Nadal może to zrobić — wpłaca wszystko co ma. Ważne: taki all-in nie "otwiera" licytacji ponownie, więc gracze którzy już wyrównali nie muszą podbijać. Ale mogą jeśli chcą.</p>
          <p>W Pokero przycisk All-in jest zawsze dostępny niezależnie od stanu żetonów — właśnie po to żeby ta sytuacja działała prawidłowo.</p>
        </div>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary">🎰 Zagraj teraz</Link>
          <Link href="/zasady/texas-holdem/" className="btn-outline">Zasady Texas Hold'em →</Link>
        </div>
        <hr className="divider" style={{ marginTop: '2.5rem' }} />
        <p style={{ color: 'rgba(245,230,192,0.35)', fontSize: '0.85rem' }}>
          Powiązane: <Link href="/blog/uklady-kart-poker/">Układy kart w pokerze</Link> · <Link href="/zasady/drawmaha/">Zasady Drawmaha</Link>
        </p>
      </div>
    </div>
  );
}
