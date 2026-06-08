'use client';

interface Props {
  amount: number;
  isAllIn?: boolean;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

// Chip color tiers based on amount
function chipColor(amount: number): { top: string; edge: string; text: string } {
  if (amount < 50)   return { top: '#c0392b', edge: '#7b1208', text: 'rgba(255,255,255,0.9)' };
  if (amount < 200)  return { top: '#1e8449', edge: '#0e4d2b', text: 'rgba(255,255,255,0.9)' };
  if (amount < 750)  return { top: '#1a5276', edge: '#0a2a40', text: 'rgba(255,255,255,0.9)' };
  if (amount < 2000) return { top: '#6c3483', edge: '#3b1a4a', text: 'rgba(255,255,255,0.9)' };
  return                    { top: '#7d6608', edge: '#4a3c04', text: 'rgba(255,245,180,0.95)' };
}

// Number of chips to show: log scale 1-9
function chipCount(amount: number): number {
  if (amount <= 0) return 0;
  return Math.min(9, Math.max(1, Math.round(Math.log2(amount / 5 + 1))));
}

export function ChipStack({ amount, isAllIn = false, side = 'top' }: Props) {
  if (amount <= 0) return null;

  const count = chipCount(amount);
  const { top, edge, text } = chipColor(amount);

  // chip dimensions
  const CW = 36; // chip width (ellipse rx)
  const CH = 9;  // chip height (ellipse ry)
  const STEP = 8; // vertical step between chips
  const totalH = CH + (count - 1) * STEP + CH + 14; // face + edges + label
  const cx = CW + 2;
  const svgW = (CW + 2) * 2;
  const svgH = totalH + 8;

  const chips = Array.from({ length: count }, (_, i) => i);
  const baseY = svgH - 16;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id={`chip-top-${amount}`} cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor={top} stopOpacity="1.4" />
            <stop offset="50%" stopColor={top} />
            <stop offset="100%" stopColor={edge} />
          </radialGradient>
          <radialGradient id={`chip-shine-${amount}`} cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* Shadow under stack */}
        <ellipse
          cx={cx}
          cy={baseY + CH + 3}
          rx={CW - 2}
          ry={4}
          fill="rgba(0,0,0,0.4)"
        />

        {/* Render chips bottom-to-top */}
        {chips.map((i) => {
          const faceY = baseY - i * STEP;
          const edgeY = faceY + CH;
          return (
            <g key={i}>
              {/* Edge cylinder side */}
              <rect
                x={cx - CW}
                y={faceY}
                width={CW * 2}
                height={CH}
                fill={edge}
                rx={1}
              />
              {/* Bottom ellipse of edge */}
              <ellipse cx={cx} cy={edgeY} rx={CW} ry={CH} fill={edge} />
              {/* Face top */}
              <ellipse cx={cx} cy={faceY} rx={CW} ry={CH} fill={`url(#chip-top-${amount})`} />
              {/* Decorative ring */}
              <ellipse cx={cx} cy={faceY} rx={CW * 0.78} ry={CH * 0.78} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
              {/* Shine — only top chip gets full shine */}
              {i === count - 1 && (
                <ellipse cx={cx - CW * 0.25} cy={faceY - CH * 0.3} rx={CW * 0.35} ry={CH * 0.42} fill={`url(#chip-shine-${amount})`} opacity={0.6} />
              )}
            </g>
          );
        })}

        {/* Amount label on top chip */}
        {count > 0 && (
          <text
            x={cx}
            y={baseY - (count - 1) * STEP + 3}
            textAnchor="middle"
            fill={text}
            fontSize={count > 5 ? 9 : 10}
            fontWeight="700"
            fontFamily="monospace"
            style={{ userSelect: 'none' }}
          >
            {amount >= 1000 ? `${(amount / 1000).toFixed(1)}k` : amount}
          </text>
        )}
      </svg>

      {/* ALL-IN badge below chips */}
      {isAllIn && (
        <div style={{
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: '#d4af37',
          background: 'rgba(212,175,55,0.1)',
          border: '1px solid rgba(212,175,55,0.3)',
          borderRadius: 3,
          padding: '1px 5px',
          whiteSpace: 'nowrap',
        }}>
          ALL-IN
        </div>
      )}
    </div>
  );
}
