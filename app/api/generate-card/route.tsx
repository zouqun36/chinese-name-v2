import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { ZODIAC_IMAGES, BG_IMAGES } from '@/lib/assets/card-images';

export const runtime = 'edge';

function splitLuckyPhrase(phrase: string): [string, string] {
  const andIdx = phrase.toLowerCase().indexOf(' and ');
  if (andIdx !== -1) {
    return [phrase.substring(0, andIdx), phrase.substring(andIdx + 1)];
  }
  const mid = Math.floor(phrase.length / 2);
  const spaceIdx = phrase.indexOf(' ', mid);
  if (spaceIdx !== -1) {
    return [phrase.substring(0, spaceIdx), phrase.substring(spaceIdx + 1)];
  }
  return [phrase, ''];
}

function formatPinyin(pinyin: string): string {
  return pinyin.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' · ');
}

function formatMeaning(meaning: string): string {
  return meaning.split(',').map(m => m.trim()).map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(' · ');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, pinyin, meaning, luckyPhrase, zodiac, gender } = body;

    if (!fullName || !pinyin || !meaning || !luckyPhrase || !zodiac || !gender) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const formattedPinyin = formatPinyin(pinyin);
    const formattedMeaning = formatMeaning(meaning);
    const [luckyLine1, luckyLine2] = splitLuckyPhrase(luckyPhrase);
    const zodiacLower = zodiac.toLowerCase();
    const genderKey = gender === 'female' ? 'female' : 'male';

    const bgSrc = BG_IMAGES[genderKey];
    const zodiacSrc = ZODIAC_IMAGES[zodiacLower] || ZODIAC_IMAGES['dragon'];

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            width: '1080px',
            height: '1080px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: 'serif',
          }}
        >
          {/* 背景图 */}
          {/* @ts-ignore */}
          <img
            src={bgSrc}
            style={{ position: 'absolute', width: '1080px', height: '1080px', objectFit: 'cover' }}
          />

          {/* 内容层 */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              paddingTop: '180px',
            }}
          >
            {/* 中文名 */}
            <div style={{ fontSize: '120px', fontWeight: 'bold', color: '#3C3C3C', lineHeight: '1' }}>
              {fullName}
            </div>

            {/* 拼音 */}
            <div style={{ fontSize: '28px', color: '#787878', marginTop: '35px' }}>
              {formattedPinyin}
            </div>

            {/* 金色横线 */}
            <div style={{ width: '600px', height: '2px', background: '#DAA520', marginTop: '30px' }} />

            {/* Meaning */}
            <div style={{ fontSize: '24px', color: '#787878', marginTop: '28px' }}>
              {formattedMeaning}
            </div>

            {/* 金色横线 */}
            <div style={{ width: '600px', height: '2px', background: '#DAA520', marginTop: '28px' }} />

            {/* Lucky Phrase */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px', gap: '4px' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3C3C3C' }}>{luckyLine1}</div>
              {luckyLine2 ? (
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3C3C3C' }}>{luckyLine2}</div>
              ) : null}
            </div>

            {/* 短横线 + 圆点 */}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '35px', gap: '8px' }}>
              <div style={{ width: '150px', height: '2px', background: '#DAA520' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#DAA520' }} />
              <div style={{ width: '150px', height: '2px', background: '#DAA520' }} />
            </div>

            {/* 生肖圆形图 */}
            <div style={{
              width: '105px',
              height: '105px',
              borderRadius: '50%',
              overflow: 'hidden',
              marginTop: '30px',
              display: 'flex',
            }}>
              {/* @ts-ignore */}
              <img src={zodiacSrc} style={{ width: '105px', height: '105px', objectFit: 'cover' }} />
            </div>
          </div>

          {/* 底部网站 */}
          <div style={{
            position: 'absolute',
            bottom: '50px',
            fontSize: '28px',
            color: 'white',
            fontFamily: 'serif',
          }}>
            chinanam.online
          </div>
        </div>
      ),
      { width: 1080, height: 1080 }
    );

    const buffer = Buffer.from(await imageResponse.arrayBuffer());

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fullName)}_lucky_card.png"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Card generation error:', error);
    return Response.json({ error: 'Failed to generate card', details: String(error) }, { status: 500 });
  }
}
