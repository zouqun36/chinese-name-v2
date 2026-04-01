import { UserInput, ChineseName, Style } from './types';
import { SURNAMES, NAME_CHARACTERS } from './data';

const LUNAR_NEW_YEAR: { [key: number]: string } = {
  1998: '1998-01-28', 1999: '1999-02-16', 2000: '2000-02-05',
  2001: '2001-01-24', 2002: '2002-02-12', 2003: '2003-02-01',
  2004: '2004-01-22', 2005: '2005-02-09', 2006: '2006-01-29',
  2007: '2007-02-18', 2008: '2008-02-07', 2009: '2009-01-26',
  2010: '2010-02-14',
};

// 音韵协调检查
function checkPhoneticHarmony(pinyin1: string, pinyin2?: string): boolean {
  if (!pinyin2) return true;
  
  // 避免相同声母连续
  const initial1 = pinyin1.charAt(0);
  const initial2 = pinyin2.charAt(0);
  if (initial1 === initial2) return false;
  
  // 避免相同韵母连续
  const finals1 = pinyin1.slice(1);
  const finals2 = pinyin2.slice(1);
  if (finals1 === finals2 && finals1.length > 0) return false;
  
  // 避免难读的组合
  const difficult = ['zh', 'ch', 'sh', 'z', 'c', 's'];
  if (difficult.includes(initial1) && difficult.includes(initial2)) return false;
  
  return true;
}

function matchPinyinFromName(name: string): string[] {
  const lowerName = name.toLowerCase();
  const matches: string[] = [];
  
  const patterns: { [key: string]: string[] } = {
    'mi': ['mi', 'mei'], 'ma': ['ma', 'mai'], 'mo': ['mo', 'mao'],
    'ke': ['ke', 'kai'], 'ka': ['ka', 'kai'], 'li': ['li', 'lei'],
    'la': ['la', 'lai'], 'jo': ['zhao', 'zhou'], 'ja': ['jia', 'jian'],
    'da': ['da', 'dai'], 'de': ['de', 'dei'], 'sa': ['sa', 'sai'],
    'si': ['si', 'xi'], 'to': ['tao', 'tong'], 'ti': ['ti', 'ting'],
    'ni': ['ni', 'ning'], 'na': ['na', 'nan'], 'ri': ['rui', 'ren'],
    'ro': ['rong', 'ruo'], 'wi': ['wei', 'wen'], 'wa': ['wa', 'wan'],
    'ya': ['ya', 'yan'], 'yu': ['yu', 'yun'],
  };
  
  for (let i = 2; i <= 3 && i <= lowerName.length; i++) {
    const substr = lowerName.substring(0, i);
    if (patterns[substr]) {
      matches.push(...patterns[substr]);
    }
  }
  
  return matches.length > 0 ? matches : [];
}

export function generateNames(input: UserInput): ChineseName[] {
  const { englishName, gender = 'neutral', styles } = input;
  const names: ChineseName[] = [];
  const usedCombinations = new Set<string>();
  
  let pinyinMatches: string[] = [];
  if (englishName) {
    pinyinMatches = matchPinyinFromName(englishName);
  }
  
  // 为每个风格生成名字（混合2字和3字）
  for (const style of styles) {
    let chars;
    if (gender === 'neutral') {
      chars = [...NAME_CHARACTERS[style].male, ...NAME_CHARACTERS[style].female];
    } else {
      chars = NAME_CHARACTERS[style][gender];
    }
    
    let surname;
    if (pinyinMatches.length > 0) {
      const matchedSurname = SURNAMES.find(s => 
        pinyinMatches.some(p => s.pinyin.toLowerCase().startsWith(p))
      );
      surname = matchedSurname || SURNAMES[Math.floor(Math.random() * 20)];
    } else {
      surname = SURNAMES[Math.floor(Math.random() * 20)];
    }
    
    let attempts = 0;
    while (attempts < 15) {
      // 随机决定生成2字名还是3字名（60%概率3字，40%概率2字）
      const isTwoChar = Math.random() < 0.4;
      
      let char1;
      if (pinyinMatches.length > 0) {
        const matchedChar = chars.find(c => 
          pinyinMatches.some(p => c.pinyin.toLowerCase().includes(p))
        );
        char1 = matchedChar || chars[Math.floor(Math.random() * chars.length)];
      } else {
        char1 = chars[Math.floor(Math.random() * chars.length)];
      }
      
      if (isTwoChar) {
        // 生成2字名
        const combination = `${surname.chinese}-${char1.char}`;
        if (!usedCombinations.has(combination) && checkPhoneticHarmony(surname.pinyin, char1.pinyin)) {
          usedCombinations.add(combination);
          names.push(createName(surname.chinese, char1.char, surname.pinyin, char1, style, input));
          break;
        }
      } else {
        // 生成3字名
        const char2 = chars[Math.floor(Math.random() * chars.length)];
        const combination = `${surname.chinese}-${char1.char}-${char2.char}`;
        
        if (char1.char !== char2.char && !usedCombinations.has(combination) &&
            checkPhoneticHarmony(char1.pinyin, char2.pinyin)) {
          usedCombinations.add(combination);
          names.push(createName(surname.chinese, char1.char + char2.char, 
                               surname.pinyin, char1, style, input, char2));
          break;
        }
      }
      attempts++;
    }
  }
  
  // 补充到6个
  while (names.length < 6) {
    const style = styles[Math.floor(Math.random() * styles.length)];
    let chars;
    if (gender === 'neutral') {
      chars = [...NAME_CHARACTERS[style].male, ...NAME_CHARACTERS[style].female];
    } else {
      chars = NAME_CHARACTERS[style][gender];
    }
    
    const surname = SURNAMES[Math.floor(Math.random() * 20)];
    const isTwoChar = Math.random() < 0.4;
    const char1 = chars[Math.floor(Math.random() * chars.length)];
    
    if (isTwoChar) {
      const combination = `${surname.chinese}-${char1.char}`;
      if (!usedCombinations.has(combination) && checkPhoneticHarmony(surname.pinyin, char1.pinyin)) {
        usedCombinations.add(combination);
        names.push(createName(surname.chinese, char1.char, surname.pinyin, char1, style, input));
      }
    } else {
      const char2 = chars[Math.floor(Math.random() * chars.length)];
      const combination = `${surname.chinese}-${char1.char}-${char2.char}`;
      
      if (char1.char !== char2.char && !usedCombinations.has(combination) &&
          checkPhoneticHarmony(char1.pinyin, char2.pinyin)) {
        usedCombinations.add(combination);
        names.push(createName(surname.chinese, char1.char + char2.char,
                             surname.pinyin, char1, style, input, char2));
      }
    }
  }
  
  return names.slice(0, 6);
}

function createName(
  surname: string, givenName: string, surnamePin: string,
  char1: any, style: Style, input: UserInput, char2?: any
): ChineseName {
  const fullName = surname + givenName;
  const pinyin = char2 
    ? `${surnamePin} ${char1.pinyin} ${char2.pinyin}`
    : `${surnamePin} ${char1.pinyin}`;
  
  const meaning = char2 
    ? `${char1.meaning}, ${char2.meaning}`
    : char1.meaning;
  
  const luckyPhrase = generateLuckyPhrase(char1, char2);
  const strokes = char1.strokes + (char2?.strokes || 0);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    surname, givenName, fullName, pinyin, meaning, luckyPhrase,
    zodiac: input.birthday ? calculateZodiac(input.birthday) : undefined,
    strokes, styles: [style],
  };
}

function generateLuckyPhrase(char1: any, char2?: any): string {
  const key1 = char1.meaning.split(',')[0].trim();
  const key2 = char2 ? char2.meaning.split(',')[0].trim() : '';
  
  if (char2) {
    const templates = [
      `May you embody ${key1} and ${key2} throughout your life`,
      `May you be blessed with ${key1} and ${key2}`,
      `May your path be guided by ${key1} and ${key2}`,
      `May you shine with ${key1} and flourish with ${key2}`,
      `May ${key1} and ${key2} bring you endless fortune`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  } else {
    const templates = [
      `May you embody ${key1} throughout your life`,
      `May you be blessed with ${key1}`,
      `May your path be guided by ${key1}`,
      `May you shine with ${key1}`,
      `May ${key1} bring you endless fortune`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }
}

function calculateZodiac(birthday: string): string {
  const date = new Date(birthday);
  const year = date.getFullYear();
  
  const zodiacs = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 
                   'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
  
  const lunarNewYear = LUNAR_NEW_YEAR[year];
  if (lunarNewYear) {
    const newYearDate = new Date(lunarNewYear);
    if (date < newYearDate) {
      return zodiacs[(year - 1 - 1900) % 12];
    }
  }
  
  return zodiacs[(year - 1900) % 12];
}
