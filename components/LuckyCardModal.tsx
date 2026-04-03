'use client';

import { ChineseName } from '@/lib/types';
import { useEffect, useRef, useState } from 'react';
import { loadImageCached, preloadAllImages } from '@/lib/imageCache';

interface Props {
  name: ChineseName;
  gender: 'male' | 'female' | 'neutral';
  onClose: () => void;
}

const ZODIAC_MAP: Record<string, string> = {
  Rat: '/zodiac/rat.png', Ox: '/zodiac/ox.png', Tiger: '/zodiac/tiger.png',
  Rabbit: '/zodiac/rabbit.png', Dragon: '/zodiac/dragon.png', Snake: '/zodiac/snake.png',
  Horse: '/zodiac/horse.png', Goat: '/zodiac/goat.png', Monkey: '/zodiac/monkey.png',
  Rooster: '/zodiac/rooster.png', Dog: '/zodiac/dog.png', Pig: '/zodiac/pig.png',
};

function formatPinyin(pinyin: string) {
  return pinyin.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' · ');
}
function formatMeaning(meaning: string) {
  return meaning.split(',').map(m => m.trim()).map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(' · ');
}
function splitLuckyPhrase(phrase: string): [string, string] {
  const andIdx = phrase.toLowerCase().indexOf(' and ');
  if (andIdx !== -1) return [phrase.substring(0, andIdx), phrase.substring(andIdx + 1)];
  const mid = Math.floor(phrase.length / 2);
  const sp = phrase.indexOf(' ', mid);
  return sp !== -1 ? [phrase.substring(0, sp), phrase.substring(sp + 1)] : [phrase, ''];
}

// 生成英文文件名：拼音_LuckyCard
function buildFilename(pinyin: string): string {
  const pinyinPart = pinyin.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  return `${pinyinPart}_LuckyCard.png`;
}

// 字体加载（只加载一次）
let fontsLoaded = false;
async function ensureFonts() {
  if (fontsLoaded) return;
  try {
    await Promise.all([
      new FontFace('Playfair Display', 'url(https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvUDQ.woff2)').load(),
      new FontFace('Noto Serif SC', 'url(https://fonts.gstatic.com/s/notoserifsc/v22/H4c8BXePl9DZ0Xe7gG9cyOj7aq0.woff2)', { weight: '700' }).load(),
      new FontFace('Cormorant Garamond', 'url(https://fonts.gstatic.com/s/cormorantgaramond/v21/co3YmX5slCNuHLi8bLeY9MK7whWMhyjornFLsS6V7w.woff2)', { weight: '600' }).load(),
    ]).then(fonts => fonts.forEach(f => (document.fonts as FontFaceSet).add(f)));
    fontsLoaded = true;
  } catch {
    // 字体加载失败，降级用系统字体
    fontsLoaded = true;
  }
}

async function drawCard(canvas: HTMLCanvasElement, params: {
  fullName: string; pinyin: string; meaning: string;
  luckyPhrase: string; zodiac: string; gender: string; watermark: boolean;
}) {
  const SIZE = 1080;
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;

  const GOLD = '#DAA520';
  const DARK = '#3C3C3C';
  const MID = '#787878';

  const genderKey = params.gender === 'female' ? 'female' : 'male';
  const zodiacKey = Object.keys(ZODIAC_MAP).find(k => k.toLowerCase() === params.zodiac.toLowerCase()) || 'Dragon';
  const zodiacSrc = ZODIAC_MAP[zodiacKey] || '/zodiac/dragon.png';

  // 并行：加载图片 + 加载字体
  const [bgImg, zodiacImg] = await Promise.all([
    loadImageCached(`/backgrounds/${genderKey}.png`),
    loadImageCached(zodiacSrc),
    ensureFonts(),
  ]) as [HTMLImageElement, HTMLImageElement, void];

  // 背景
  ctx.drawImage(bgImg, 0, 0, SIZE, SIZE);

  // 水印
  if (params.watermark) {
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = 'white';
    ctx.font = 'bold 80px "Playfair Display", serif';
    ctx.translate(SIZE / 2, SIZE / 2);
    ctx.rotate(-35 * Math.PI / 180);
    ctx.textAlign = 'center';
    ctx.fillText('PREVIEW ONLY', 0, 0);
    ctx.restore();
  }

  let y = 180;
  ctx.textAlign = 'center';
  const cx = SIZE / 2;

  // 中文名 - Noto Serif SC 粗体
  ctx.font = 'bold 120px "Noto Serif SC", serif';
  ctx.fillStyle = DARK;
  ctx.fillText(params.fullName, cx, y + 100);
  y += 175;

  // 拼音 - Playfair Display
  ctx.font = '28px "Playfair Display", serif';
  ctx.fillStyle = MID;
  ctx.fillText(formatPinyin(params.pinyin), cx, y);
  y += 48;

  // 横线
  ctx.strokeStyle = GOLD; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx - 300, y); ctx.lineTo(cx + 300, y); ctx.stroke();
  y += 38;

  // Meaning - Playfair Display 正体（不斜）
  ctx.font = '24px "Playfair Display", serif';
  ctx.fillStyle = MID;
  ctx.fillText(formatMeaning(params.meaning), cx, y);
  y += 40;

  // 横线
  ctx.beginPath(); ctx.moveTo(cx - 300, y); ctx.lineTo(cx + 300, y); ctx.stroke();
  y += 48;

  // Lucky Phrase - Cormorant Garamond（更优雅）
  const [line1, line2] = splitLuckyPhrase(params.luckyPhrase);
  ctx.font = '600 36px "Cormorant Garamond", serif';
  ctx.fillStyle = DARK;
  ctx.fillText(line1, cx, y);
  if (line2) { y += 44; ctx.fillText(line2, cx, y); }
  y += 40;

  // 短横线 + 圆点
  ctx.strokeStyle = GOLD; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx - 160, y); ctx.lineTo(cx - 10, y); ctx.stroke();
  ctx.fillStyle = GOLD;
  ctx.beginPath(); ctx.arc(cx, y, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx + 10, y); ctx.lineTo(cx + 160, y); ctx.stroke();
  y += 30;

  // 生肖圆形
  const r = 52;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, y + r, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(zodiacImg, cx - r, y, r * 2, r * 2);
  ctx.restore();

  // 网站 - Playfair Display
  ctx.font = '28px "Playfair Display", serif';
  ctx.fillStyle = 'white';
  ctx.fillText('chinanam.online', cx, SIZE - 50);
}

export default function LuckyCardModal({ name, gender, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(false);

  const params = {
    fullName: name.fullName,
    pinyin: name.pinyin,
    meaning: name.meaning || 'Lucky and Blessed',
    luckyPhrase: name.luckyPhrase || 'May you shine with luck and flourish with joy',
    zodiac: name.zodiac || 'Dragon',
    gender: gender || 'male',
  };

  useEffect(() => {
    setPreviewLoading(true);
    setPreviewUrl(null);
    setError(false);

    const canvas = document.createElement('canvas');
    drawCard(canvas, { ...params, watermark: true })
      .then(() => {
        setPreviewUrl(canvas.toDataURL('image/jpeg', 0.85));
        setPreviewLoading(false);
      })
      .catch(err => {
        console.error('Preview error:', err);
        setPreviewLoading(false);
        setError(true);
      });
  }, [name.fullName, name.zodiac, gender]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      await drawCard(canvas, { ...params, watermark: false });
      const filename = buildFilename(params.pinyin);
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      alert('Error generating card, please try again');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <button onClick={onClose}
        style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 9999 }}
        className="w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-700 hover:bg-gray-100 text-xl font-bold">
        ×
      </button>

      <div className="bg-white rounded-2xl w-full shadow-2xl flex flex-col"
        style={{ maxWidth: '480px', maxHeight: '88vh' }}>

        <div className="flex items-center px-5 py-3 border-b flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800">✨ Your Lucky Card</h2>
        </div>

        <div className="flex-1 min-h-0 flex items-center justify-center bg-gray-100 p-3 overflow-hidden">
          {previewLoading ? (
            <div className="flex flex-col items-center gap-3 py-12">
              <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Generating your lucky card...</p>
            </div>
          ) : error ? (
            <div className="text-gray-400 py-12 text-center text-sm">Preview unavailable, please try again</div>
          ) : previewUrl ? (
            <img src={previewUrl} alt="Lucky Card Preview"
              className="w-full h-full object-contain rounded-lg" style={{ maxHeight: '100%' }} />
          ) : null}
        </div>

        <div className="px-5 py-4 border-t flex-shrink-0">
          <p className="text-xs text-gray-400 text-center mb-3">
            Preview has watermark · Download HD version is watermark-free
          </p>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl hover:bg-gray-200 font-medium transition-colors text-sm">
              Close
            </button>
            <button onClick={handleDownload}
              disabled={isDownloading || previewLoading || error}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-2.5 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md text-sm">
              {isDownloading ? '⏳ Generating...' : '⬇️ Download HD Card'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
