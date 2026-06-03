'use client';

import { useState, useCallback } from 'react';

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const SUITS = ['h', 'd', 's', 'c'] as const;
type Suit = typeof SUITS[number];
type Card = { rank: string; suit: Suit } | null;

const SYM: Record<Suit, string> = { h: '♥', d: '♦', s: '♠', c: '♣' };
const SNAME: Record<Suit, string> = { h: 'Kier', d: 'Karo', s: 'Pik', c: 'Trefl' };
const RV: Record<string, number> = { '2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,T:10,J:11,Q:12,K:13,A:14 };
const IS_RED: Record<Suit, boolean> = { h:true, d:true, s:false, c:false };
const PLAYER_COLORS = ['#1d4ed8','#dc2626','#16a34a','#d97706','#7c3aed','#0891b2','#be185d','#92400e'];

function getCombinations<T>(arr: T[], k: number): T[][] {
  if (k === arr.length) return [arr];
  if (k === 0) return [[]];
  const [f, ...r] = arr;
  return [...getCombinations(r, k-1).map(c => [f, ...c]), ...getCombinations(r, k)];
}

function eval5(hand: Card[]): number {
  const rv = hand.map(c => RV[c!.rank]).sort((a,b) => b-a);
  const suits = hand.map(c => c!.suit);
  const fl = suits.every(s => s === suits[0]);
  const u = [...new Set(rv)].sort((a,b) => b-a);
  const isWheel = u[0]===14 && u[1]===5 && u[4]===2;
  const st = u.length>=5 && (u[0]-u[4]===4 || isWheel);
  const cnt: Record<number,number> = {};
  rv.forEach(r => { cnt[r]=(cnt[r]||0)+1; });
  const fr = Object.values(cnt).sort((a,b) => b-a);
  if (fl && st) return 8e6+(isWheel?5:u[0]);
  if (fr[0]===4) return 7e6+rv[0]*1e2+rv[4];
  if (fr[0]===3 && fr[1]===2) return 6e6+rv[0]*1e2+rv[3];
  if (fl) return 5e6+rv[0]*1e4+rv[1]*1e3+rv[2]*1e2+rv[3]*10+rv[4];
  if (st) return 4e6+(isWheel?5:u[0]);
  if (fr[0]===3) return 3e6+rv[0]*1e4+rv[3]*1e2+rv[4];
  if (fr[0]===2 && fr[1]===2) return 2e6+rv[0]*1e4+rv[2]*1e2+rv[4];
  if (fr[0]===2) return 1e6+rv[0]*1e4+rv[2]*1e2+rv[3]*10+rv[4];
  return rv[0]*1e4+rv[1]*1e3+rv[2]*1e2+rv[3]*10+rv[4];
}

function bestHand(hole: Card[], board: Card[]): number {
  const all = [...hole,...board].filter(Boolean) as Card[];
  if (all.length<5) return all.reduce((s,c) => s+RV[c!.rank],0);
  return Math.max(...getCombinations(all,5).map(eval5));
}

function buildDeck(exclude: Card[]): Card[] {
  const ex = new Set(exclude.filter(Boolean).map(c => c!.rank+c!.suit));
  return RANKS.flatMap(r => SUITS.map(s => ({rank:r,suit:s} as Card))).filter(c => !ex.has(c!.rank+c!.suit));
}

function shuffle<T>(arr: T[]): T[] {
  const a=[...arr];
  for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

function CardBtn({ card, onClick, isBoard }: { card: Card; onClick: () => void; isBoard?: boolean }) {
  if (!card) return (
    <button onClick={onClick} style={{
      width: isBoard ? 'clamp(44px,10vw,58px)' : 'clamp(48px,12vw,60px)',
      height: isBoard ? 'clamp(60px,14vw,80px)' : 'clamp(66px,16vw,84px)',
      borderRadius: 8, background: '#f9fafb', border: '1.5px dashed #d1d5db',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', fontSize: 'clamp(20px,5vw,26px)', color: '#9ca3af', flexShrink: 0,
      WebkitTapHighlightColor: 'transparent',
    }}>+</button>
  );
  const red = IS_RED[card.suit];
  return (
    <button onClick={onClick} style={{
      width: isBoard ? 'clamp(44px,10vw,58px)' : 'clamp(48px,12vw,60px)',
      height: isBoard ? 'clamp(60px,14vw,80px)' : 'clamp(66px,16vw,84px)',
      borderRadius: 8, background: '#fff', border: '1.5px solid #d1d5db',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', flexShrink: 0, gap: 1,
      color: red ? '#dc2626' : '#111827', WebkitTapHighlightColor: 'transparent',
    }}>
      <span style={{ fontSize: 'clamp(14px,4vw,20px)', fontWeight: 700, lineHeight: 1 }}>{card.rank==='T'?'10':card.rank}</span>
      <span style={{ fontSize: 'clamp(12px,3vw,16px)', lineHeight: 1 }}>{SYM[card.suit]}</span>
    </button>
  );
}

export function TexasCalculator() {
  const [heroCards, setHeroCards] = useState<[Card,Card]>([null,null]);
  const [boardCards, setBoardCards] = useState<[Card,Card,Card,Card,Card]>([null,null,null,null,null]);
  const [numOpp, setNumOpp] = useState(2);
  const [pickerTarget, setPickerTarget] = useState<string|null>(null);
  const [activeSuit, setActiveSuit] = useState<Suit>('h');
  const [result, setResult] = useState<{win:number;tie:number;lose:number;oppAvg:number;n:number}|null>(null);
  const [running, setRunning] = useState(false);

  const allCards: Card[] = [...heroCards,...boardCards];
  const usedKeys = new Set(allCards.filter(Boolean).map(c => c!.rank+c!.suit));

  const getCard = (slot: string): Card => slot.startsWith('h') ? heroCards[parseInt(slot[1])]??null : boardCards[parseInt(slot[1])]??null;

  const setCard = (slot: string, card: Card) => {
    if (slot.startsWith('h')) { const idx=parseInt(slot[1]); setHeroCards(prev=>{const n=[...prev] as [Card,Card];n[idx]=card;return n;}); }
    else { const idx=parseInt(slot[1]); setBoardCards(prev=>{const n=[...prev] as [Card,Card,Card,Card,Card];n[idx]=card;return n;}); }
  };

  const openPicker = (slot: string) => setPickerTarget(prev => prev===slot ? null : slot);
  const pickCard = (rank: string) => { if (!pickerTarget) return; setCard(pickerTarget,{rank,suit:activeSuit}); setPickerTarget(null); setResult(null); };
  const clearCard = (slot: string) => { setCard(slot,null); setResult(null); setPickerTarget(null); };
  const reset = () => { setHeroCards([null,null]); setBoardCards([null,null,null,null,null]); setResult(null); setPickerTarget(null); setNumOpp(2); };

  const heroFilled = heroCards.filter(Boolean).length;
  const slotLabel: Record<string,string> = {h0:'Karta 1',h1:'Karta 2',b0:'Flop 1',b1:'Flop 2',b2:'Flop 3',b3:'Turn',b4:'River'};

  const calcEquity = useCallback(() => {
    const h = heroCards.filter(Boolean) as NonNullable<Card>[];
    if (h.length<2) return;
    setRunning(true);
    setTimeout(() => {
      const board=boardCards.filter(Boolean) as NonNullable<Card>[];
      const N=5000; let wins=0,ties=0;
      for (let i=0;i<N;i++){
        const deck=shuffle(buildDeck([...h,...board]));let di=0;
        const sb=[...board];while(sb.length<5)sb.push(deck[di++]!);
        const hs=bestHand(h,sb);let ob=0;
        for(let o=0;o<numOpp;o++){const oh=[deck[di++]!,deck[di++]!];const s=bestHand(oh,sb);if(s>ob)ob=s;}
        if(hs>ob)wins++;else if(hs===ob)ties++;
      }
      const win=wins/N*100,tie=ties/N*100;
      setResult({win,tie,lose:100-win-tie,oppAvg:(100-win-tie/2)/numOpp,n:N});
      setRunning(false);
    },10);
  },[heroCards,boardCards,numOpp]);

  const suitColors = { h:{bg:'#fee2e2',border:'#dc2626',text:'#dc2626'}, d:{bg:'#fee2e2',border:'#dc2626',text:'#dc2626'}, s:{bg:'#e0e7ff',border:'#3730a3',text:'#3730a3'}, c:{bg:'#d1fae5',border:'#065f46',text:'#065f46'} };

  return (
    <div style={{background:'#1a1a2a',border:'1px solid rgba(212,175,55,0.2)',borderRadius:16,padding:'clamp(1rem,4vw,1.5rem)',maxWidth:700}}>

      {/* Hero + opponents */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1.25rem'}}>
        <div>
          <div style={{fontSize:'0.7rem',fontWeight:600,color:'rgba(212,175,55,0.6)',letterSpacing:'0.07em',textTransform:'uppercase',marginBottom:8}}>Twoje karty (hero)</div>
          <div style={{display:'flex',gap:'clamp(6px,2vw,10px)'}}>
            {([0,1] as const).map(i => <div key={i} onClick={() => heroCards[i] ? clearCard(`h${i}`) : openPicker(`h${i}`)}><CardBtn card={heroCards[i]} onClick={()=>{}} /></div>)}
          </div>
        </div>
        <div>
          <div style={{fontSize:'0.7rem',fontWeight:600,color:'rgba(212,175,55,0.6)',letterSpacing:'0.07em',textTransform:'uppercase',marginBottom:8}}>Liczba rywali</div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginTop:6}}>
            <input type="range" min={1} max={8} value={numOpp} onChange={e=>{setNumOpp(+e.target.value);setResult(null);}} style={{flex:1,accentColor:'#d4af37'}} />
            <span style={{fontSize:20,fontWeight:700,color:'#d4af37',minWidth:24}}>{numOpp}</span>
            <span style={{fontSize:12,color:'rgba(245,230,192,0.5)'}}>graczy</span>
          </div>
        </div>
      </div>

      {/* Board */}
      <div style={{marginBottom:'1.25rem'}}>
        <div style={{fontSize:'0.7rem',fontWeight:600,color:'rgba(212,175,55,0.6)',letterSpacing:'0.07em',textTransform:'uppercase',marginBottom:8}}>Karty wspólne (opcjonalne)</div>
        <div style={{display:'flex',gap:'clamp(5px,1.5vw,8px)',flexWrap:'nowrap'}}>
          {([0,1,2,3,4] as const).map(i => <div key={i} onClick={() => boardCards[i] ? clearCard(`b${i}`) : openPicker(`b${i}`)}><CardBtn card={boardCards[i]} onClick={()=>{}} isBoard /></div>)}
        </div>
      </div>

      {/* Picker */}
      {pickerTarget && (
        <div style={{background:'#13131f',border:'1px solid rgba(212,175,55,0.25)',borderRadius:12,padding:'clamp(0.75rem,3vw,1rem)',marginBottom:'1.25rem'}}>
          <div style={{fontSize:12,fontWeight:500,color:'rgba(245,230,192,0.5)',marginBottom:10}}>
            Wybierz kolor — <strong style={{color:'#d4af37'}}>{slotLabel[pickerTarget]}</strong>
          </div>
          {/* Suit buttons — 2x2 on mobile, 1x4 on wider */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:12}}>
            {SUITS.map(s => {
              const active=activeSuit===s;
              const sc=suitColors[s];
              return (
                <button key={s} onClick={()=>setActiveSuit(s)} style={{
                  padding:'clamp(10px,3vw,12px) 8px',borderRadius:10,
                  border:`1.5px solid ${active?sc.border:'#d1d5db'}`,
                  background:active?sc.bg:'#fff',
                  fontSize:'clamp(16px,4vw,20px)',fontWeight:700,cursor:'pointer',
                  color:sc.text,display:'flex',alignItems:'center',justifyContent:'center',gap:6,
                  WebkitTapHighlightColor:'transparent',
                }}>
                  <span>{SYM[s]}</span>
                  <span style={{fontSize:'clamp(12px,3vw,14px)',fontWeight:600}}>{SNAME[s]}</span>
                </button>
              );
            })}
          </div>
          {/* Rank grid — larger touch targets */}
          <div style={{fontSize:12,fontWeight:500,color:'rgba(245,230,192,0.5)',marginBottom:8}}>Wybierz wartość:</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'clamp(4px,1.5vw,6px)'}}>
            {RANKS.map(r => {
              const key=r+activeSuit;
              const taken=usedKeys.has(key) && !(pickerTarget && getCard(pickerTarget)?.rank===r && getCard(pickerTarget)?.suit===activeSuit);
              const sc=suitColors[activeSuit];
              return (
                <button key={r} disabled={taken} onClick={()=>pickCard(r)} style={{
                  aspectRatio:'1',borderRadius:8,
                  border:`1px solid ${taken?'#e5e7eb':'#d1d5db'}`,
                  background:taken?'#f3f4f6':'#fff',
                  fontSize:'clamp(13px,3.5vw,16px)',fontWeight:700,
                  cursor:taken?'default':'pointer',
                  color:taken?'#9ca3af':sc.text,
                  opacity:taken?0.35:1,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  minHeight:'clamp(36px,10vw,48px)',
                  WebkitTapHighlightColor:'transparent',
                }}>
                  {r==='T'?'10':r}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Calculate */}
      {heroFilled===2 && (
        <button onClick={calcEquity} disabled={running} style={{width:'100%',padding:'clamp(10px,3vw,14px)',borderRadius:10,background:'#d4af37',border:'none',color:'#0d0d14',fontSize:'clamp(14px,4vw,16px)',fontWeight:700,cursor:running?'default':'pointer',opacity:running?0.7:1,marginBottom:'1.25rem',WebkitTapHighlightColor:'transparent'}}>
          {running?'Obliczam (5000 symulacji)...':'🎯 Oblicz szanse na wygraną'}
        </button>
      )}
      {heroFilled<2 && (
        <div style={{padding:'10px 14px',background:'rgba(212,175,55,0.06)',borderLeft:'3px solid rgba(212,175,55,0.3)',borderRadius:6,fontSize:13,color:'rgba(245,230,192,0.5)',marginBottom:'1rem'}}>
          Wybierz {2-heroFilled} {2-heroFilled===1?'kartę':'karty'} na rękę.
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{marginBottom:'1rem'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:14}}>
            {[{label:'Wygrana',val:result.win,col:'#1d4ed8'},{label:'Remis',val:result.tie,col:'#9ca3af'},{label:'Przegrana',val:result.lose,col:'#dc2626'}].map(s=>(
              <div key={s.label} style={{background:'#13131f',border:'1px solid rgba(212,175,55,0.15)',borderRadius:8,padding:'10px 6px',textAlign:'center'}}>
                <div style={{fontSize:11,color:'rgba(245,230,192,0.4)',marginBottom:4}}>{s.label}</div>
                <div style={{fontSize:'clamp(18px,5vw,22px)',fontWeight:700,color:s.col}}>{s.val.toFixed(1)}%</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:0}}>
            <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid rgba(212,175,55,0.08)'}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:'#1d3a8a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#93c5fd',flexShrink:0}}>H</div>
              <div style={{fontSize:13,fontWeight:600,flex:'0 0 auto',color:'#1d4ed8',minWidth:60}}>Ty (Hero)</div>
              <div style={{flex:1,height:8,background:'#2d2d3f',borderRadius:4,overflow:'hidden'}}><div style={{height:8,width:`${result.win.toFixed(1)}%`,background:'#1d4ed8',borderRadius:4,transition:'width 0.4s'}}/></div>
              <div style={{fontSize:'clamp(15px,4vw,18px)',fontWeight:700,minWidth:52,textAlign:'right',color:'#1d4ed8'}}>{result.win.toFixed(1)}%</div>
            </div>
            {Array.from({length:numOpp},(_,i)=>{
              const col=PLAYER_COLORS[i+1]||PLAYER_COLORS[PLAYER_COLORS.length-1];
              return (
                <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:i<numOpp-1?'1px solid rgba(212,175,55,0.08)':'none'}}>
                  <div style={{width:32,height:32,borderRadius:'50%',background:'rgba(212,175,55,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:col,flexShrink:0}}>{i+1}</div>
                  <div style={{fontSize:13,color:'rgba(245,230,192,0.5)',flex:'0 0 auto',minWidth:60}}>Rywal {i+1}</div>
                  <div style={{flex:1,height:8,background:'#2d2d3f',borderRadius:4,overflow:'hidden'}}><div style={{height:8,width:`${result.oppAvg.toFixed(1)}%`,background:col,borderRadius:4,transition:'width 0.4s'}}/></div>
                  <div style={{fontSize:'clamp(15px,4vw,18px)',fontWeight:700,minWidth:52,textAlign:'right',color:col}}>{result.oppAvg.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
          <div style={{marginTop:12,padding:'10px 14px',background:'#0f1f3d',borderLeft:'3px solid #3b82f6',borderRadius:6,fontSize:13,color:'#93c5fd'}}>
            Symulacja Monte Carlo: {result.n.toLocaleString('pl-PL')} rozdań.{' '}
            {boardCards.filter(Boolean).length===0?'Equity pre-flop.':`${boardCards.filter(Boolean).length} kart wspólnych.`}
          </div>
        </div>
      )}

      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
        <button onClick={reset} style={{padding:'6px 14px',fontSize:13,borderRadius:8,border:'1px solid rgba(212,175,55,0.25)',background:'transparent',color:'rgba(245,230,192,0.5)',cursor:'pointer',WebkitTapHighlightColor:'transparent'}}>
          ↺ Reset
        </button>
      </div>
    </div>
  );
}
