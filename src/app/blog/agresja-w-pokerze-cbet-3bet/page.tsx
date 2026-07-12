import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Agresja w pokerze — c-bet, 3-bet i budowanie puli krok po kroku',
  description: 'Dlaczego agresja opłaca się matematycznie. Continuation bet, 3-bet preflop, double barrel, kiedy odpuścić — kompletny przewodnik po agresywnej grze.',
  alternates: { canonical: 'https://pokero.pl/blog/agresja-w-pokerze-cbet-3bet/' },
  openGraph: { type: 'article', publishedTime: '2026-06-19' },
};

export default function PostAgresjaWPokerze() {
  return (
    <div className="container">
      <div style={{ marginBottom: '0.5rem' }}>
        <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Strona główna</Link>
        <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
        <Link href="/blog/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Blog</Link>
        <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.6)' }}>Agresja w pokerze — c-bet i 3-bet</span>
      </div>
      <div style={{ maxWidth: 720, marginTop: '1.5rem' }}>
        <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Strategia</span>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Agresja w pokerze — c-bet, 3-bet i budowanie puli krok po kroku
        </h1>
        <p style={{ color: 'rgba(var(--pk-cream-rgb),0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>19 czerwca 2026 · 17 min czytania</p>
        <div className="prose">

          <p>„Bet or fold" — to hasło które słyszysz od doświadczonych graczy. Pasywne granie (sprawdzanie, call'owanie bez inicjatywy) to strategia która długoterminowo traci. Agresywna gra — raise, continuation bet, double barrel — jest matematycznie opłacalna. Nie dlatego że „wygrywa", ale dlatego że stwarza dwie drogi do wygranej: fold equity i wygranie showdown. Ten artykuł tłumaczy każdy element agresji — od c-betu przez 3-bet po wiedzę kiedy się zatrzymać.</p>

          <h2>Dlaczego agresja jest matematycznie opłacalna?</h2>
          <p>Zanim wejdziemy w techniki, zrozummy fundament. Gdy zakładasz, masz dwie drogi do wygranej:</p>
          <ol>
            <li><strong>Fold equity</strong> — przeciwnik pasuje i przegrywasz pulę bez showdown</li>
            <li><strong>Wygranie showdown</strong> — ktoś sprawdza, porównują się ręce, Twoja jest lepsza</li>
          </ol>
          <p>Gdy sprawdzasz (check), masz tylko jedną drogę: wygranie showdown. Rezygnujesz z fold equity za darmo. W pokerze fold equity ma konkretną wartość — jeśli zakład 60 złotych do puli 100 złotych sprawia że przeciwnik foluje w 40% przypadków, to tylko z tej 40% szansy zarabiasz 100 złotych × 40% = 40 złotych ekstra, bez względu na Twoje karty.</p>
          <p>Innymi słowy: agresja zarabia nawet bez kart.</p>

          <h2>Continuation Bet (C-bet) — fundament agresji poflop</h2>
          <p>C-bet to zakład postawiony na flopie przez gracza który podniósł preflop. Nazywa się „continuation" bo kontynuuje agresję z rundy preflop.</p>

          <h3>Dlaczego c-bet jest standardem?</h3>
          <p>Statystycznie, flop pomaga (trafia parę lub lepiej) każdemu graczowi w mniej niż 1/3 przypadków. Gdy podniosłeś preflop, Twój range jest silny — przeciwnik zazwyczaj trafił mniej niż Ty. C-bet zgarnia pulę w dużej liczbie przypadków gdy wszyscy nic nie trafili.</p>

          <h3>Kiedy c-betować?</h3>
          <ul>
            <li><strong>Zawsze (prawie) heads-up</strong> — przy jednym przeciwniku c-bet na suchym boardzie zarabia długoterminowo niemal zawsze</li>
            <li><strong>Dry board</strong> — K72 rainbow, Q83, A52 — mało draws, nikt zazwyczaj nic nie trafił</li>
            <li><strong>Board który pasuje do Twojego range'u</strong> — jeśli podniosłeś z pozycji late, Twój range ma dużo overcards. Flop A73 pasuje do Twojego range (masz wiele rąk z Asem)</li>
            <li><strong>Heads up po 3-becie</strong> — twój range jest bardzo silny, c-bet zawsze sensowny</li>
          </ul>

          <h3>Kiedy NIE c-betować?</h3>
          <ul>
            <li><strong>Wiele przeciwników (3+)</strong> — szansa że ktoś z nich trafił jest wysoka. C-bet jest droższy, fold equity mniejszy</li>
            <li><strong>Board który pomaga callerzowi, nie Tobie</strong> — np. T97 rainbow gdy Twój opener range ma dużo overcards, a caller range ma wiele connectors</li>
            <li><strong>Masz nut draw</strong> — check-raise jest często lepszy niż c-bet gdy masz flush draw (zbierasz więcej pieniędzy)</li>
            <li><strong>Z absolute position disadvantage</strong> — grasz z blindów bez pozycji, flop trafił zakres BBa (niska karta) — check ma sens</li>
          </ul>

          <h3>Rozmiar c-betu</h3>
          <ul>
            <li><strong>50-60% puli</strong> — standard, dobry stosunek ryzyka do nagrody. Zmusza przeciwnika do decyzji bez przepłacania.</li>
            <li><strong>25-33% puli</strong> — małe c-bety na dry boardach gdy masz range advantage. Tanie zabranie puli, mniejsze ryzyko.</li>
            <li><strong>75-100% puli</strong> — wet board, chcesz chronić rękę przed draws, lub masz bardzo silną rękę i chcesz budować pulę.</li>
          </ul>

          <h2>3-Bet — agresja preflop</h2>
          <p>3-bet to podbicie cudzego raise'u preflop. Pierwotny raise to „2-bet", podbicie go to „3-bet". Jest to jeden z najsilniejszych sygnałów siły w pokerze.</p>

          <h3>Dlaczego 3-betować?</h3>
          <ul>
            <li><strong>Wartość z silnych rąk</strong> — KK, QQ, AK chcą grać dużą pulę. 3-bet buduje tę pulę preflop.</li>
            <li><strong>Fold equity preflop</strong> — wielu graczy foluje na 3-bet nawet z umiarkowanymi rękami. Zbierasz pulę preflop bez showdown.</li>
            <li><strong>Inicjatywa na flopie</strong> — gracz który 3-betował ma inicjatywę. C-bet jest oczekiwany i rzadziej kwestionowany.</li>
            <li><strong>Budowanie wizerunku agresywnego</strong> — po kilku 3-betach, gdy masz potwora, zostaniesz sprawdzony szerzej.</li>
          </ul>

          <h3>3-bet dla wartości vs 3-bet blef</h3>
          <p>Profesjonalna strategia uwzględnia obydwa:</p>
          <ul>
            <li><strong>Value 3-bet</strong>: QQ+, AK, niekiedy JJ i AQ z pozycji</li>
            <li><strong>Blef 3-bet</strong>: ręce z blockerami (Ax suited hands jak A5s, A4s — blokujesz Asa przeciwnika) lub suited connectors z pozycji</li>
          </ul>
          <p>Dlaczego blef 3-bety? Po pierwsze fold equity (duża część rąk foluje na 3-bet). Po drugie, bez blef 3-betów Twój range jest przewidywalny — zawsze masz QQ+ gdy 3-betujesz.</p>

          <h3>Sizing 3-betu</h3>
          <ul>
            <li><strong>Z pozycji</strong>: 2.5-3x raise contra</li>
            <li><strong>Poza pozycją</strong>: 3-3.5x (większy bo masz dezawantaż pozycji przez resztę ręki)</li>
          </ul>

          <h2>Double Barrel — kontynuacja agresji na turnie</h2>
          <p>Double barrel to c-bet na turnie po c-becie na flopie. To eskalacja agresji przez dwie ulice.</p>

          <h3>Kiedy double barrel ma sens?</h3>
          <ul>
            <li><strong>Karta turnu pomaga Twojemu range'owi</strong> — np. As pojawia się na turnie gdy Twój preflop range ma wiele Asów</li>
            <li><strong>Karta turnu niszczy draw przeciwnika</strong> — na flopie 9♥ T♥ J♣ gracz może mieć draw. Na turnie wylatuje 2♦ — brak poprawy. Double barrel ma sens bo draw nadal nie trafił i może nie trafić.</li>
            <li><strong>Masz silny blef (semi-blef)</strong> — masz draw który może trafić na riverze. Stawiasz zakład z opcją poprawy.</li>
            <li><strong>Przeciwnik wygląda na słabego</strong> — sprawdził flop szybko, nie wykazał oporu. Może mieć słabą rękę lub draw który czeka.</li>
          </ul>

          <h3>Kiedy NIE double barrelować?</h3>
          <ul>
            <li><strong>Grasz na dry boardzie bez poprawy</strong> — K72 na flopie, 4 na turnie. Jeśli ktoś sprawdził tu flop, często ma coś. Double barrel bez sensu.</li>
            <li><strong>Masz show-down value</strong> — masz słabą parę która może wygrać showdown jeśli rywal też jest słaby. Bet tylko wyrzuca go z gry. Check ma sens.</li>
            <li><strong>Rywal sprawdzał zwoływanie agresywnie</strong> — sugeruje silną rękę lub trap. Zatrzymaj agresję.</li>
          </ul>

          <h2>Triple Barrel — agresja do końca</h2>
          <p>Triple barrel to bet na wszystkich trzech ulicach po flopie (flop, turn, river). Najtrudniejszy element agresji, bo wymaga spójnej narracji przez całą rękę.</p>

          <h3>Kiedy triple barrel blef ma sens?</h3>
          <ul>
            <li>Twoja historia przez całą rękę jest spójna i logiczna</li>
            <li>River karta jest „scary" dla przeciwnika — As, karta która kompletuje draw na planszy</li>
            <li>Masz blockers — karty które zmniejszają prawdopodobieństwo że rywal ma najlepszą rękę</li>
            <li>Rywal jest zdolny do folda na riverze (nie jest calling station)</li>
          </ul>
          <p>Triple barrel blef to ryzykowna i zaawansowana taktyka. Należy stosować rzadko i selektywnie. Przeciętny gracz rzadko powinien triple barrelować bez ręki.</p>

          <h2>Check-raise — agresja defensywna</h2>
          <p>Check-raise to sprawdzenie a następnie podbicie gdy przeciwnik zakłada. To forma agresji która wygląda jak słabość, a jest siłą.</p>

          <h3>Kiedy stosować?</h3>
          <ul>
            <li><strong>Z silną ręką poza pozycją</strong> — check-raise pozwala Ci zbudować pulę gdy jesteś bez pozycji (musisz działać przed rywalem)</li>
            <li><strong>Z nut draw</strong> — masz flush draw lub straight draw, check-raise daje Ci fold equity + opcję trafienia</li>
            <li><strong>Gdy chcesz chronić rękę</strong> — masz silną rękę na wet boardzie. Check-raise zmusza draws do płacenia premium za swoje szanse</li>
          </ul>

          <h2>Kiedy zatrzymać agresję — trip to znów nie działa</h2>
          <p>Agresja jest narzędziem, nie dogmatem. Są sytuacje gdzie zatrzymanie agresji jest optymalną strategią:</p>
          <ul>
            <li><strong>Rywal pokazał siłę</strong> — check-raise, raise Twojego betu, call na wszystkich ulicach bez oporu. Te sygnały mówią: zatrzymaj się.</li>
            <li><strong>Masz show-down value ale nie value-bet value</strong> — masz drugą parę. Możesz wygrać showdown ale bet tylko odstraszy słabsze ręce i zostaniesz przy silnych. Check jest lepszy.</li>
            <li><strong>Board jest wyjątkowo zły dla Twojego range'u</strong> — grałeś agresywnie z pozycji late z szerokim range, a flop to J98 — idealny dla BB caller range.</li>
            <li><strong>Calling station przy stole</strong> — jeśli ktoś nigdy nie foluje na bet, Twój blef jest bezwartościowy. Nie blefuj calling stacji. Value-betuj je za to mocno.</li>
          </ul>

          <h2>Dostosowanie agresji do wariantu</h2>

          <h3>Texas Hold'em</h3>
          <p>Standardowe zasady c-betu, 3-betu i double barrel opisane wyżej. Agresja jest szerzej akceptowana i mniej zaskakuje.</p>

          <h3>Omaha</h3>
          <p>W Omaha każdy ma 4 karty — range są szersze, draw są silniejsze, equity jest bardziej wyrównana. Agresja jest bardziej ryzykowna bo trudniej wymusić fold gdy każdy może mieć mocny draw. C-bet jest mniej efektywny na wet boardach w Omaha.</p>

          <h3>Pineapple</h3>
          <p>Trzy karty na ręce = szerszy range = trudniej wymusić fold. Agresja powinna być ostrożniejsza i oparta bardziej na wartości niż na blefie.</p>

          <h2>Mierzenie efektywności agresji — wskaźniki</h2>
          <p>Jeśli chcesz ocenić swoją agresję numerycznie:</p>
          <ul>
            <li><strong>AF (Aggression Factor)</strong> = (raise + bet) / call. AF &gt; 2 to agresywny gracz, &lt; 1 to pasywny. Cel: 2-4 dla TAG, wyżej dla LAG.</li>
            <li><strong>C-bet %</strong> — ile procent flopów c-betujesz po preflop raise. Cel: 50-70%. Mniej = za pasywny, więcej = za przewidywalny.</li>
            <li><strong>Fold to c-bet %</strong> — jak często rywal foluje na Twój c-bet. Jeśli wysoko (&gt;60%) — c-betuj częściej. Jeśli nisko (&lt;40%) — blef-c-bety są mniej wartościowe, skupiaj się na value.</li>
          </ul>

          <h2>Praktyczne ćwiczenia — jak rozwijać agresję</h2>
          <p>Kilka konkretnych ćwiczeń na następną sesję:</p>
          <ul>
            <li><strong>Ćwiczenie 1</strong>: Przez jedną sesję c-betuj każdy flop heads-up. Obserwuj jak często wygrywasz bez showdown. Zbuduj intuicję co do fold equity.</li>
            <li><strong>Ćwiczenie 2</strong>: Ustal że w tej sesji zrobisz 3-bet co najmniej 3 razy z pozycji z rękoma które normalnie byś call'ował. Obserwuj reakcje.</li>
            <li><strong>Ćwiczenie 3</strong>: Skup się na rozpoznaniu calling stations przy stole. Przestań blefować te osoby — value-betuj je zamiast tego.</li>
          </ul>

          <h2>Podsumowanie</h2>
          <p>Agresja w pokerze to nie chaotyczne stawianie zakładów — to precyzyjne narzędzie które maximalizuje zysk z dobrych rąk i generuje dodatkowy zysk przez fold equity z rąk marginalnych. C-bet, 3-bet i double barrel to fundament TAG (tight-aggressive) stylu który jest najlepszym punktem startowym dla każdego gracza chcącego regularnie wygrywać.</p>
          <p>Wdróż te narzędzia stopniowo: zacznij od systematycznego c-betu, potem dodaj 3-bet z wartości, potem naucz się kiedy double barrelować. Każdy krok to kolejna warstwa zysku dodana do Twojej gry.</p>

        </div>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary">🎰 Ćwicz agresję w Pokero</Link>
          <Link href="/blog/jak-blefowac-w-pokerze/" className="btn-outline">Jak blefować →</Link>
        </div>
        <hr className="divider" style={{ marginTop: '2.5rem' }} />
        <p style={{ color: 'rgba(var(--pk-cream-rgb),0.35)', fontSize: '0.85rem' }}>
          Powiązane: <Link href="/blog/jak-blefowac-w-pokerze/">Jak blefować w pokerze</Link> · <Link href="/blog/pozycja-w-pokerze/">Pozycja w pokerze</Link> · <Link href="/blog/pot-odds-poker/">Pot Odds</Link>
        </p>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "Agresja w pokerze — c-bet, 3-bet i budowanie puli krok po kroku",
              "datePublished": "2026-06-19",
              "publisher": {
                "@type": "Organization",
                "name": "Pokero",
                "url": "https://pokero.pl"
              },
              "mainEntityOfPage": "https://pokero.pl/blog/agresja-w-pokerze-cbet-3bet/"
            }),
          }}
        />
      </div>
    </div>
  );
}
