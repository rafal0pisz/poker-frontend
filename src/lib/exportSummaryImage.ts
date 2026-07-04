import type { SessionResult } from './types';

// Rendered client-side on a canvas — no backend involved, matches the
// "session-only" scope of everything else here (nothing is stored).
const WIDTH = 900;
const ROW_HEIGHT = 64;
const HEADER_HEIGHT = 150;
const FOOTER_HEIGHT = 60;
const PADDING_X = 48;

function formatDate(): string {
  return new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' });
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function renderSessionSummaryCanvas(summary: SessionResult[], roomId: string): HTMLCanvasElement {
  const sorted = [...summary].sort((a, b) => b.netResult - a.netResult);
  const height = HEADER_HEIGHT + sorted.length * ROW_HEIGHT + FOOTER_HEIGHT + 24;

  const canvas = document.createElement('canvas');
  const scale = 2; // render at 2x for a crisp download
  canvas.width = WIDTH * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);

  // Background — dark felt gradient matching the app's classic theme
  const bg = ctx.createRadialGradient(WIDTH / 2, -80, 80, WIDTH / 2, height / 2, height);
  bg.addColorStop(0, '#2a0e0e');
  bg.addColorStop(1, '#1f0808');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, height);

  // Header
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#d4af37';
  ctx.font = '700 15px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.save();
  ctx.font = '700 13px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(212,175,55,0.55)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('POKERO.PL — SESSION RESULTS', WIDTH / 2, 44);
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#f5e6c0';
  ctx.font = 'italic 400 34px Georgia, "Times New Roman", serif';
  ctx.fillText(`Room ${roomId}`, WIDTH / 2, 86);

  ctx.font = '400 13px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(245,230,192,0.5)';
  ctx.fillText(formatDate(), WIDTH / 2, 110);

  // Divider
  ctx.strokeStyle = 'rgba(212,175,55,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PADDING_X, HEADER_HEIGHT - 20);
  ctx.lineTo(WIDTH - PADDING_X, HEADER_HEIGHT - 20);
  ctx.stroke();

  // Rows
  sorted.forEach((s, i) => {
    const y = HEADER_HEIGHT + i * ROW_HEIGHT;
    const positive = s.netResult > 0;
    const negative = s.netResult < 0;

    if (i % 2 === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.02)';
      drawRoundedRect(ctx, PADDING_X - 12, y, WIDTH - (PADDING_X - 12) * 2, ROW_HEIGHT - 6, 10);
      ctx.fill();
    }

    // Rank
    ctx.textAlign = 'left';
    ctx.font = '700 13px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = i === 0 ? '#d4af37' : 'rgba(245,230,192,0.35)';
    ctx.fillText(`#${i + 1}`, PADDING_X, y + 38);

    // Nick
    ctx.font = '600 20px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#f5e6c0';
    ctx.fillText(s.nick, PADDING_X + 44, y + 32);

    // Buy-in / final chips
    ctx.font = '400 12px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(245,230,192,0.45)';
    ctx.fillText(`buy-in ${s.totalBuyIn} · ${s.leftAt > 0 ? 'left with' : 'now'} ${s.finalChips}`, PADDING_X + 44, y + 52);

    // Net result
    ctx.textAlign = 'right';
    ctx.font = '700 26px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = positive ? '#4ade80' : negative ? '#f87171' : 'rgba(245,230,192,0.6)';
    const label = `${positive ? '+' : ''}${s.netResult}`;
    ctx.fillText(label, WIDTH - PADDING_X, y + 38);
  });

  // Footer
  ctx.textAlign = 'center';
  ctx.font = '400 12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(212,175,55,0.45)';
  ctx.fillText('Zagraj z nami na pokero.pl', WIDTH / 2, height - 26);

  return canvas;
}

export function downloadSessionSummaryImage(summary: SessionResult[], roomId: string): void {
  const canvas = renderSessionSummaryCanvas(summary, roomId);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pokero-${roomId}-wyniki.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}
