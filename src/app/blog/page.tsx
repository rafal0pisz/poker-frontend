import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog o pokerze — zasady, strategia, organizacja gier',
  description: 'Artykuły o pokerze: zasady gier, strategie, jak organizować domowe turnieje, poker ze znajomymi online. Praktyczne poradniki dla każdego poziomu.',
  alternates: { canonical: 'https://pokero.pl/blog/' },
};

const posts = [
  { href: '/blog/dealer-choice-poker/', tag: 'Zasady', title: "Dealer's Choice Poker — co to jest i jak grać", desc: 'Każda ręka to inny wariant pokera. Jak działa Dealer\'s Choice i dlaczego to świetny format na domowe turnieje.', date: '2026-05-31' },
  { href: '/blog/poker-zasady-blind/', tag: 'Zasady', title: 'Blind w pokerze — co to jest mały i duży blind', desc: 'Small Blind i Big Blind wyjaśnione prosto. Po co są blindy, ile wynoszą i jak wpływają na Twoją strategię.', date: '2026-05-31' },
  { href: '/blog/gry-online-ze-znajomymi/', tag: 'Poradniki', title: 'Gry online ze znajomymi przez internet — top 5 pomysłów', desc: 'Poker, quizy, rysowanie i więcej. Najlepsze gry online na wieczór ze znajomymi bez wychodzenia z domu.', date: '2026-05-30' },
  { href: '/blog/omaha-strategia/', tag: 'Strategia', title: 'Strategia Omaha Poker — jak grać kiedy masz 4 karty na ręce', desc: 'Najczęstsze błędy graczy przechodzących z Texas do Omaha. Jakie ręce startowe grać i kiedy szukać nuts.', date: '2026-05-29' },
  { href: '/blog/poker-na-telefonie/', tag: 'Poradniki', title: 'Poker na telefonie ze znajomymi — jak grać na iOS i Android', desc: 'Pokero działa na każdym telefonie bez instalacji. Jak zacząć w 30 sekund i kilka wskazówek dla Safari.', date: '2026-05-28' },
  { href: '/blog/side-pot-poker/', tag: 'Zasady', title: 'Side pot w pokerze — co to jest i jak działa', desc: 'Pula boczna w pokerze — kiedy powstaje, przykład z all-in trzech graczy, jak Pokero liczy to automatycznie.', date: '2026-05-27' },
  { href: '/blog/poker-domowy-turniej/', tag: 'Poradniki', title: 'Domowy turniej pokerowy — jak zorganizować krok po kroku', desc: 'Struktura blindów, żetony startowe, rebuy czy nie, ile osób i ile czasu. Kompletny poradnik organizatora.', date: '2026-05-26' },
  { href: '/blog/pozycja-w-pokerze/', tag: 'Strategia', title: 'Pozycja w pokerze — dlaczego dealer ma przewagę', desc: 'Dealer, Cutoff, Under the Gun — co oznaczają pozycje i jak je wykorzystać. Jedna z najważniejszych lekcji.', date: '2026-05-24' },
  { href: '/blog/jak-blefowac-w-pokerze/', tag: 'Strategia', title: 'Jak blefować w pokerze — kiedy warto i jak robić to skutecznie', desc: 'Blef to kalkulacja, nie kłamstwo. Kiedy blefować, semi-blef, rozmiar betu i najczęstsze błędy.', date: '2026-05-22' },
  { href: '/blog/poker-wieczor-kawalerski/', tag: 'Poradniki', title: 'Poker na wieczór kawalerski i panieński — jak zorganizować turniej', desc: 'Poker jako atrakcja wieczoru kawalerskiego. Specjalne zasady, format turnieju, jak grać online z całą ekipą.', date: '2026-05-20' },
  { href: '/blog/uklady-kart-poker/', tag: 'Zasady', title: 'Układy kart w pokerze — pełna tabela z przykładami i FAQ', desc: 'Wszystkie 10 układów pokerowych z przykładami. Tabela, FAQ i najczęstsze pytania o remisy i kickery.', date: '2026-05-15' },
  { href: '/blog/poker-ze-znajomymi-online/', tag: 'Poradniki', title: 'Poker ze znajomymi online — jak to zorganizować krok po kroku', desc: 'Jak szybko i bezproblemowo zorganizować wieczór pokerowy z przyjaciółmi przez internet.', date: '2026-05-08' },
  { href: '/blog/zasady-pokera-texas-holdem/', tag: 'Zasady', title: "Jak grać w pokera Texas Hold'em — zasady dla początkujących", desc: "Kompletny przewodnik po Texas Hold'em krok po kroku. Dla osób które nigdy nie grały w pokera.", date: '2026-05-01' },
];

export default function BlogPage() {
  return (
    <div className="container">
      <div style={{ marginBottom: '0.5rem' }}>
        <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Strona główna</Link>
        <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Blog</span>
      </div>
      <h1 style={{ fontSize: '2rem', margin: '1.5rem 0 0.5rem' }}>Blog</h1>
      <p style={{ color: 'rgba(245,230,192,0.5)', marginBottom: '2.5rem' }}>Zasady, strategie i wszystko o pokerze ze znajomymi — {posts.length} artykułów</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {posts.map((p) => (
          <Link key={p.href} href={p.href} style={{ textDecoration: 'none' }}>
            <div className="card card-hover">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                <span className="badge">{p.tag}</span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(245,230,192,0.3)' }}>{new Date(p.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', lineHeight: 1.35 }}>{p.title}</h2>
              <p style={{ fontSize: '0.9rem', color: 'rgba(245,230,192,0.55)', margin: 0 }}>{p.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
