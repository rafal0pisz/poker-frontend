import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Drawmaha — zasady gry i split pot',
  description: 'Zasady Drawmaha: 5 kart, wymiana po flopie, split pot między Omaha i Draw. Unikalny wariant pokera dostępny w Pokero. Jak działa split pot i faza wymiany.',
  alternates: { canonical: 'https://pokero.pl/zasady/drawmaha/' },
};

export default function DrawmahaPage() {
  return (
    <>
      <Nav />
      <main style={{ padding: '3rem 0 4rem' }}>
        <div className="container">
          <div style={{ marginBottom: '0.5rem' }}>
            <Link href="/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Strona główna</Link>
            <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
            <Link href="/zasady/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Zasady gry</Link>
            <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
            <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Drawmaha</span>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span className="badge">5 kart + wymiana</span>
              <span className="badge" style={{ background: 'rgba(139,26,26,0.2)', borderColor: 'rgba(139,26,26,0.4)', color: '#e07070' }}>Split pot</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>Drawmaha — zasady gry</h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(245,230,192,0.65)', maxWidth: 600 }}>
              Drawmaha to unikalny wariant stworzony przez twórców Pokero. Łączy elementy Omaha Poker i Five-Card Draw — pula jest dzielona między dwóch zwycięzców.
            </p>
          </div>

          <div className="prose">
            <h2>Koncepcja gry</h2>
            <p>
              W Drawmaha każda ręka ma dwóch potencjalnych zwycięzców. Pula dzielona jest 50/50 między:
            </p>
            <ul>
              <li><strong>Zwycięzca Omaha</strong> — najlepsza ręka Omaha (2 karty z ręki + 3 ze stołu)</li>
              <li><strong>Zwycięzca Draw</strong> — najlepsza ręka Five-Card Draw (5 kart z własnej ręki)</li>
            </ul>
            <p>
              Jeden gracz może wygrać obie połowy — wtedy "scoopuje" całą pulę.
            </p>

            <h2>Przebieg rundy</h2>
            <table>
              <thead><tr><th>Etap</th><th>Co się dzieje</th></tr></thead>
              <tbody>
                <tr><td>Preflop</td><td>Każdy dostaje 5 kart. Licytacja od UTG.</td></tr>
                <tr><td>Flop</td><td>3 karty na stół. Licytacja.</td></tr>
                <tr><td>Faza wymiany</td><td>Każdy gracz może wymienić 0-5 kart z własnej ręki.</td></tr>
                <tr><td>Turn</td><td>4. karta na stół. Licytacja.</td></tr>
                <tr><td>River</td><td>5. karta na stół. Finalna licytacja.</td></tr>
                <tr><td>Showdown</td><td>Ocena obu rąk, podział puli 50/50.</td></tr>
              </tbody>
            </table>

            <h2>Faza wymiany (Draw Phase)</h2>
            <p>
              Po flopie każdy gracz może wymienić od 0 do 5 kart ze swojej ręki. Wymiana 1 karty ma specjalną mechanikę:
            </p>
            <ul>
              <li>Odkrywa się karta "open" — gracz widzi co losuje</li>
              <li>Gracz może <strong>zaakceptować</strong> kartę (wchodzi do ręki) lub <strong>odrzucić</strong></li>
              <li>Przy odrzuceniu: karta open jest wyrzucona, gracz losuje jedną nową (blind — nie widzi jej z góry)</li>
            </ul>

            <h2>Split pot — podział puli</h2>
            <p>
              Gdy ręka dobiegnie końca, system ocenia dwie niezależne ręce:
            </p>
            <ul>
              <li><strong>Ręka Omaha</strong>: najlepsza kombinacja z dokładnie 2 kart własnych + 3 kart ze stołu</li>
              <li><strong>Ręka Draw</strong>: najlepsza kombinacja 5-kartowa z własnych kart (bez stołu)</li>
            </ul>
            <p>
              Pula dzielona jest po połowie. Jeśli jeden gracz wygrywa obie — dostaje całość (scoop).
            </p>

            <h2>Strategia</h2>
            <p>
              Drawmaha wymaga myślenia w dwóch trybach jednocześnie. Dobra ręka do Omaha (dwie wysokie pary, konektor kolorowy) niekoniecznie jest dobra do Drawa (szukasz prostych zestawów: trójki, kwiaty, strity z 5 kart).
            </p>
            <p>
              Klasyczna strategia: buduj rękę która ma szansę na obie połowy puli — "scoopowanie" to klucz do dużych wygranych.
            </p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/zasady/crazy-pineapple/" className="btn-outline">← Crazy Pineapple</Link>
            <Link href="/zasady/uklady-kart/" className="btn-outline">Układy kart →</Link>
            <Link href="/graj/" className="btn-primary">🎰 Zagraj teraz</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
