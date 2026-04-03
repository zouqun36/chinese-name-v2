import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import os from 'os';

const execAsync = promisify(exec);

// Lucky phrase 拆成两行
function splitLuckyPhrase(phrase: string): [string, string] {
  // 按 " and " 分割
  const andIdx = phrase.toLowerCase().indexOf(' and ');
  if (andIdx !== -1) {
    const line1 = phrase.substring(0, andIdx);
    const line2 = phrase.substring(andIdx + 1); // 保留 "and ..."
    return [line1, line2];
  }
  // 没有 and，从中间切
  const mid = Math.floor(phrase.length / 2);
  const spaceIdx = phrase.indexOf(' ', mid);
  if (spaceIdx !== -1) {
    return [phrase.substring(0, spaceIdx), phrase.substring(spaceIdx + 1)];
  }
  return [phrase, ''];
}

// 格式化拼音（"zhang ming rui" → "Zhang · Ming · Rui"）
function formatPinyin(pinyin: string): string {
  return pinyin
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' · ');
}

// 格式化 Meaning（"bright, noble" → "Bright · Noble"）
function formatMeaning(meaning: string): string {
  return meaning
    .split(',')
    .map(m => m.trim())
    .map(m => m.charAt(0).toUpperCase() + m.slice(1))
    .join(' · ');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, pinyin, meaning, luckyPhrase, zodiac, gender } = body;

    // 参数验证
    if (!fullName || !pinyin || !meaning || !luckyPhrase || !zodiac || !gender) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 处理数据
    const formattedPinyin = formatPinyin(pinyin);
    const formattedMeaning = formatMeaning(meaning);
    const [luckyLine1, luckyLine2] = splitLuckyPhrase(luckyPhrase);
    const zodiacLower = zodiac.toLowerCase();
    const genderKey = gender === 'female' ? 'female' : 'male'; // neutral → male

    // 生成唯一文件名
    const outputFilename = `card_${Date.now()}_${Math.random().toString(36).substr(2, 6)}.jpg`;
    const outputPath = path.join(os.tmpdir(), outputFilename);

    // 构建 Python 脚本参数
    const scriptPath = '/root/.openclaw/workspace/generate_jixiang_card.py';

    // 写入临时 Python 调用脚本
    const callScript = `
import sys
sys.path.insert(0, '/root/.openclaw/workspace')
from generate_jixiang_card import generate_card

generate_card(
    chinese_name=${JSON.stringify(fullName)},
    pinyin=${JSON.stringify(formattedPinyin)},
    meaning=${JSON.stringify(formattedMeaning)},
    lucky_phrase=[${JSON.stringify(luckyLine1)}, ${JSON.stringify(luckyLine2)}],
    gender=${JSON.stringify(genderKey)},
    zodiac=${JSON.stringify(zodiacLower)},
    output_path=${JSON.stringify(outputPath)}
)
`;

    const tmpScript = path.join(os.tmpdir(), `gen_${Date.now()}.py`);
    fs.writeFileSync(tmpScript, callScript);

    await execAsync(`python3 ${tmpScript}`);
    fs.unlinkSync(tmpScript);

    // 读取生成的图片
    const imageBuffer = fs.readFileSync(outputPath);
    fs.unlinkSync(outputPath);

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename="${fullName}_lucky_card.jpg"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Card generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate card', details: String(error) },
      { status: 500 }
    );
  }
}
