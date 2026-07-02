import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Drawmaha — zasady i strategia wariantu split-pot z wymianą kart',
  description: 'Kompletny przewodnik po Drawmaha — zasady gry, split pot, faza wymiany kart, faza reveal i strategie wygrywające. Autorski wariant pokera dostępny w Pokero.',
  alternates: { canonical: 'https://pokero.pl/blog/drawmaha-zasady-strategia/' },
  openGraph: { type: 'article', publishedTime: '2026-06-17' },
};

export default function PostDrawmaha() {
  return (
    <div className="container">
      <div style={{ marginBottom: '0.5rem' }}>
        <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Strona główna</Link>
        <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
        <Link href="/blog/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Blog</Link>
        <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.6)' }}>Drawmaha — zasady i strategia</span>
      </div>
      <div style={{ maxWidth: 720, marginTop: '1.5rem' }}>
        <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Zasady</span>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Drawmaha — kompletny przewodnik po wariancie split-pot z wymianą kart
        </h1>
        <p style={{ color: 'rgba(var(--pk-cream-rgb),0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>17 czerwca 2026 · 16 min czytania</p>
        <div className="prose">

          <p>Drawmaha to jeden z najbardziej unikalnych wariantów pokera dostępnych w <Link href="/">Pokero</Link> — gra która łączy głębię Omahy z mechaniką wymiany kart rodem z Draw Pokera. Pula jest dzielona na pół: połowę wygrywa gracz z najlepszą ręką Omaha, drugą połowę gracz z najlepszą ręką po wymianie kart. To tworzy zupełnie inną dynamikę niż w jakimkolwiek innym wariancie. Oto wszystko co musisz wiedzieć — od zasad po zaawansowaną strategię.</p>

          <h2>Czym jest Drawmaha?</h2>
          <p>Drawmaha to wariant pokera oparty na Omaha Hold'em, rozszerzony o dwa unikalne elementy:</p>
          <ol>
            <li><strong>Faza wymiany kart</strong> — po flopie każdy gracz może wymienić dowolną liczbę swoich kart (lub żadnej — „stand pat")</li>
            <li><strong>Split pot</strong> — pula jest dzielona między najlepszą rękę Omaha (5 kart z 4 kart w ręce + 5 board) a najlepszą rękę Draw (5 kart z nowych kart po wymianie)</li>
          </ol>
          <p>W praktyce oznacza to, że możesz wygrać połowę puli grając na jeden cel, drugą połowę — na drugi cel. Albo możesz zgarnąć całą pulę („scoop") jeśli wygrasz obydwie połowy. To zmienia fundamentalnie strategię wyboru rąk startowych i decyzji w trakcie ręki.</p>

          <h2>Zasady krok po kroku</h2>

          <h3>Rozdanie kart i blindy</h3>
          <p>Jak w standardowej Omaha: każdy gracz otrzymuje <strong>5 kart zakrytych</strong> (nie 4 jak w klasycznej Omaha — to ważna różnica). Dealer wystawia Small Blind i Big Blind. Licytacja preflop przebiega identycznie jak w Texas Hold'em — fold, call, raise w kolejności od gracza po lewej stronie BB.</p>

          <h3>Flop, turn (standardowe)</h3>
          <p>Po licytacji preflop wystawiane są trzy karty wspólne (flop). Kolejna runda licytacji. Następnie jedna karta (turn) i kolejna licytacja. Do tego momentu Drawmaha przebiega identycznie jak Omaha 5-kartowa.</p>

          <h3>Faza wymiany kart — unikalna mechanika</h3>
          <p>Po turnie, <strong>zamiast od razu przechodzić do riveru</strong>, następuje faza wymiany kart. Każdy gracz decyduje:</p>
          <ul>
            <li><strong>Które karty wymienić</strong> — możesz wymienić od 0 do wszystkich 5 kart w ręce</li>
            <li><strong>Stand pat</strong> — zostawić wszystkie karty bez wymiany</li>
          </ul>
          <p>Wymiana jest jednoczesna — nie widzisz co wymieniają inni gdy decydujesz. Po wymianie każdy gracz trzyma nowe 5 kart. Karty wymienione są odrzucane i nie wracają do gry.</p>

          <h3>Faza reveal — otwarta karta</h3>
          <p>Po wymianie następuje wyjątkowy element: jedna z nowych kart każdego gracza jest <strong>odkrywana na stole</strong> — tzw. „open card". Gracz widzi otwartą kartę przeciwnika i musi zdecydować: czy chce zatrzymać tę kartę, czy wymienić ją na kartę ślepą (losową z talii).</p>
          <ul>
            <li><strong>Akceptacja open card</strong> — zostawiasz odkrytą kartę i ta karta wchodzi do Twojej ręki Draw</li>
            <li><strong>Odrzucenie open card</strong> — dostajesz losową kartę z talii zamiast odkrytej</li>
          </ul>
          <p>Ten etap wprowadza element częściowej informacji — wiesz jedną kartę z ręki Draw każdego gracza. To gigantyczna zmiana strategiczna: możesz ocenić siłę ręki Draw przeciwnika po części.</p>

          <h3>River i showdown</h3>
          <p>Po fazie reveal wystawiana jest ostatnia karta wspólna (river). Finalna runda licytacji. Showdown: każdy gracz prezentuje najlepszą rękę z obydwu kategorii:</p>
          <ul>
            <li><strong>Ręka Omaha</strong>: najlepsza 5-karta kombinacja z 5 kart w ręce + 5 kart boardu, używając <em>dokładnie 2 kart z ręki i dokładnie 3 z boardu</em></li>
            <li><strong>Ręka Draw</strong>: najlepsza 5-karta kombinacja z 5 kart po wymianie (karty prywatne, bez boardu)</li>
          </ul>
          <p>Połowa puli trafia do najlepszej ręki Omaha, połowa do najlepszej ręki Draw. Scoop (zgarnięcie całości) gdy ten sam gracz wygrywa obydwie połowy.</p>

          <h2>Strategia wyboru rąk startowych</h2>
          <p>Strategia preflop w Drawmaha radykalnie różni się od standardowej Omahy. Musisz myśleć w dwóch wymiarach jednocześnie.</p>

          <h3>Ręce dwustronne — najcenniejsze</h3>
          <p>Najlepsza ręka startowa to taka która ma potencjał zarówno na część Omaha jak i Draw. Przykład:</p>
          <ul>
            <li><strong>A♥ K♥ Q♦ J♠ T♣</strong> — broadway straight draw dla Omaha (A-K-Q-J-T) + potencjalnie silne karty Draw</li>
            <li><strong>A♠ A♦ K♠ K♦ Q♠</strong> — mocna ręka na Omaha (dwie pary, set possibilities) + high cards na Draw</li>
          </ul>

          <h3>Ręce jednostronne — ryzykowne</h3>
          <p>Ręka która jest silna tylko na jeden z celów to strategicznie słabsza pozycja:</p>
          <ul>
            <li><strong>2♣ 3♣ 4♣ 5♣ 7♦</strong> — potencjalnie silna na Draw (low cards, możliwy straight/flush) ale słaba na Omaha</li>
            <li>Grasz o połowę puli maksymalnie — masz limit zysku i pełne ryzyko</li>
          </ul>

          <h3>Kiedy grać jednostronnie?</h3>
          <p>Jednostronne ręce są akceptowalne gdy:</p>
          <ul>
            <li>Masz bardzo silny potencjał na jeden cel (np. gotowy kolor lub straight na Draw)</li>
            <li>Pula jest duża względem Twoich żetonów (pot odds uzasadniają call za połowę)</li>
            <li>Przeciwnicy też grają jednostronnie — nie ma silnego kandydata na obydwa cele</li>
          </ul>

          <h2>Strategia fazy wymiany</h2>
          <p>Decyzja o wymianie kart to serce Drawmaha. Masz do rozważenia dwie zmienne: jak to wpłynie na rękę Omaha i jak na rękę Draw.</p>

          <h3>Stand pat — kiedy nie wymieniać?</h3>
          <p>Nie wymieniaj gdy:</p>
          <ul>
            <li><strong>Masz gotową silną rękę Draw</strong> — np. już masz kolor lub strita w ręce. Wymiana tylko osłabia.</li>
            <li><strong>Twoje karty są kluczowe dla Omaha</strong> — jeśli Twoje konkretne karty dają silny draw na Omahy (np. double suited connector), zachowaj je.</li>
            <li><strong>Stand pat sygnalizuje siłę</strong> — świadomi gracze wiedzą że stand pat sugeruje dobrą rękę. To element blefowania informacyjnego.</li>
          </ul>

          <h3>Wymiana 1-2 kart — optymalizacja</h3>
          <p>Najczęstsza i zazwyczaj optymalna strategia: wymień 1-2 karty które są najsłabszym elementem Twojej ręki. Zachowujesz strukturę, ulepszasz słabe miejsca.</p>

          <h3>Wymiana 3-5 kart — reset</h3>
          <p>Wymiana większości kart sensowna gdy:</p>
          <ul>
            <li>Preflop dostałeś złą rękę ale weszłeś z blindów</li>
            <li>Grasz agresywnie na jeden cel i całkowicie przebudujesz rękę na Draw</li>
            <li>Blefujesz — duża wymiana sygnalizuje słabość (lub siłę jeśli stand-pateujemy)</li>
          </ul>

          <h2>Strategia fazy reveal</h2>
          <p>Faza reveal to element który nie istnieje w żadnym innym popularnym wariancie — jest unikalną mechaniką Drawmaha. Oto jak podchodzić do decyzji.</p>

          <h3>Kiedy akceptować open card?</h3>
          <ul>
            <li>Odkryta karta <strong>wpisuje się w Twoją rękę</strong> — uzupełnia kolor, strita lub jest wysoką kartą przy high card hands</li>
            <li>Odkryta karta jest <strong>As lub wysoka karta</strong> — zazwyczaj wartościowa w Draw</li>
            <li>Nie masz lepszej opcji — losowa karta z talii może być wszystkim</li>
          </ul>

          <h3>Kiedy odrzucić open card?</h3>
          <ul>
            <li>Odkryta karta <strong>niszczy Twój potencjał</strong> — np. masz 4 karty do koloru, a otwarta karta to inna barwa i niski rank</li>
            <li>Widzisz że <strong>ta karta nie pomaga</strong> w kontekście całej ręki</li>
            <li>Blefujesz — odrzucenie sygnalizuje że chciałeś coś innego, może zdezorientować przeciwnika</li>
          </ul>

          <h3>Czytanie open cards przeciwnika</h3>
          <p>Gdy widzisz otwartą kartę przeciwnika, natychmiast wyciągaj wnioski:</p>
          <ul>
            <li>Wysoka otwarta karta + odrzucenie → gracz ma już wyższe karty w ręce, ta karta nie pomagała</li>
            <li>Niska karta + akceptacja → gracz buduje low hand lub ma powód dla tej karty</li>
            <li>Akceptacja po stand pat → gracz ma już silną rękę i każda karta jest dobra</li>
          </ul>

          <h2>Zarządzanie scoop vs split pot</h2>
          <p>Najważniejsza decyzja strategiczna w Drawmaha: czy grasz na scoop (obydwa cele) czy na połowę puli?</p>

          <h3>Gra na scoop</h3>
          <p>Opłacalna gdy:</p>
          <ul>
            <li>Masz realny potencjał na obydwa cele</li>
            <li>Pula jest duża — warto ryzykować</li>
            <li>Przeciwnicy są podzieleni między dwa cele, nikt nie jest dominujący w obydwu</li>
          </ul>

          <h3>Gra na pół puli</h3>
          <p>Akceptowalna strategia gdy:</p>
          <ul>
            <li>Twoja ręka jest wyjątkowo silna na jeden cel (gotowy kolor najwyższy możliwy na Draw)</li>
            <li>Drugi cel jest zajęty przez silnego przeciwnika — nie przebijaj go, zabezpiecz swoją połowę</li>
            <li>Pula jest już duża — połowa to i tak duża wygrana</li>
          </ul>

          <h2>Najczęstsze błędy w Drawmaha</h2>

          <h3>Błąd 1: Granie jak w standardowej Omaha</h3>
          <p>Drawmaha to nie Omaha. Pomijanie fazy Draw i granie wyłącznie pod Omaha to strategia oddająca połowę puli za darmo. Zawsze miej plan na Draw component.</p>

          <h3>Błąd 2: Zbyt duża wymiana bez powodu</h3>
          <p>Wymiana wszystkich kart gdy masz umiarkowaną rękę to hazard bez kalkulacji. Staraj się wymieniać celowo — konkretne karty dla konkretnych celów.</p>

          <h3>Błąd 3: Ignorowanie open cards przeciwników</h3>
          <p>Każda otwarta karta to darmowa informacja. Gracz który ją ignoruje traci kluczowy element informacyjny unikatowy dla Drawmaha.</p>

          <h3>Błąd 4: Stand pat gdy powinieneś wymieniać</h3>
          <p>Stand pat dla „image siły" gdy Twoja ręka jest słaba to błąd. Prawdziwa siła pochodzi z dobrej ręki po wymianie, nie ze strategii wizerunkowej przy słabych kartach.</p>

          <h3>Błąd 5: Wchodzenie z rękami jednostronnymi w duże pule</h3>
          <p>Jeśli wiesz że grasz tylko na połowę puli, pot odds muszą to uzasadniać. Nie wchodź z jednostronną ręką gdy potencjalna wygrana to połowa stawki przy niekorzystnych odds.</p>

          <h2>Drawmaha Pot Limit — dodatkowa warstwa</h2>
          <p>Pokero oferuje też wariant Drawmaha Pot Limit (DPL) gdzie zakłady są ograniczone do rozmiary puli. To zmienia dynamikę zakładów:</p>
          <ul>
            <li>Przed wymianą pula jest mniejsza — zakłady mniejsze</li>
            <li>Po fazie Draw pula rośnie — zakłady mogą być większe</li>
            <li>Strategia: bądź agresywny preflop i na flopie (gdy pula mała) by zbudować pulę przed dużymi decyzjami po wymianie</li>
          </ul>

          <h2>Dlaczego Drawmaha to świetna gra dla grup?</h2>
          <p>Z perspektywy gry towarzyskiej Drawmaha ma kilka unikalnych zalet:</p>
          <ul>
            <li><strong>Więcej akcji</strong> — więcej decyzji na gracza, więcej emocji. Faza wymiany i reveal to dodatkowe punkty kulminacyjne w każdej ręce.</li>
            <li><strong>Equalizacja poziomu</strong> — split pot sprawia że słabszy gracz może wygrać połowę nawet gdy mocniejszy dominuje w drugiej połowie. Pula rzadziej trafia w całości do jednej osoby.</li>
            <li><strong>Otwarta karta = rozmowy</strong> — każda otwarta karta to temat do komentowania, śmiania się, spekulowania. Drawmaha jest naturalnie bardziej interaktywna społecznie.</li>
            <li><strong>Unikalna mechanika</strong> — każdy kto grał Texasa i Omahę może szybko zrozumieć Drawmaha, a każda sesja jest świeżym doświadczeniem.</li>
          </ul>

          <h2>Podsumowanie — Drawmaha w pigułce</h2>
          <p>Drawmaha to gra dla tych którzy chcą więcej niż standard. Więcej decyzji, więcej informacji, więcej strategii. Kluczowe zasady:</p>
          <ol>
            <li>Zawsze myśl w dwóch wymiarach: Omaha i Draw</li>
            <li>Najcenniejsze ręce startowe mają potencjał na obydwa cele</li>
            <li>Wymiana kart to decyzja strategiczna, nie losowa — decyduj celowo</li>
            <li>Faza reveal daje informacje — zawsze je interpretuj</li>
            <li>Scoop jest celem premium, ale pół puli jest wartościowe samo w sobie</li>
          </ol>
          <p>Najlepszy sposób na naukę Drawmaha? Kilka sesji w Pokero ze znajomymi — wariant jest dostępny do wyboru przy każdej ręce w trybie Dealer's Choice.</p>

        </div>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary">🃏 Zagraj w Drawmaha teraz</Link>
          <Link href="/zasady/drawmaha/" className="btn-outline">Zasady Drawmaha →</Link>
        </div>
        <hr className="divider" style={{ marginTop: '2.5rem' }} />
        <p style={{ color: 'rgba(var(--pk-cream-rgb),0.35)', fontSize: '0.85rem' }}>
          Powiązane: <Link href="/zasady/drawmaha/">Zasady Drawmaha</Link> · <Link href="/blog/omaha-strategia/">Strategia Omaha</Link> · <Link href="/blog/dealer-choice-poker/">Dealer's Choice Poker</Link>
        </p>
      </div>
    </div>
  );
}
