import { UserInput, ChineseName, Style } from './types';
import { SURNAMES, NAME_CHARACTERS, LUCKY_PHRASES } from './data';

export function generateNames(input: UserInput): ChineseName[] {
  const { englishName, gender = 'male', styles } = input;
  const names: ChineseName[] = [];
  
  // 选择姓氏（取前3个常见姓氏）
  const selectedSurnames = SURNAMES.slice(0, 3);
  
  // 为每个风格生成名字
  for (const style of styles) {
    const chars = NAME_CHARACTERS[style][gender];
    
    // 每个姓氏生成1-2个名字
    for (const surname of selectedSurnames) {
      // 单字名
      const char1 = chars[Math.floor(Math.random() * chars.length)];
      names.push(createName(surname.chinese, char1.char, surname.pinyin, char1, style, input));
      
      // 双字名
      if (names.length < 8) {
        const char2 = chars[Math.floor(Math.random() * chars.length)];
        if (char1.char !== char2.char) {
          names.push(createName(
            surname.chinese, 
            char1.char + char2.char, 
            surname.pinyin, 
            char1, 
            style, 
            input,
            char2
          ));
        }
      }
    }
  }
  
  return names.slice(0, 8);
}

function createName(
  surname: string,
  givenName: string,
  surnamePin: string,
  char1: any,
  style: Style,
  input: UserInput,
  char2?: any
): ChineseName {
  const fullName = surname + givenName;
  const pinyin = char2 
    ? `${surnamePin} ${char1.pinyin} ${char2.pinyin}`
    : `${surnamePin} ${char1.pinyin}`;
  
  const meaning = char2 
    ? `${char1.meaning}, ${char2.meaning}`
    : char1.meaning;
  
  const strokes = char1.strokes + (char2?.strokes || 0);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    surname,
    givenName,
    fullName,
    pinyin,
    meaning,
    luckyPhrase: LUCKY_PHRASES[Math.floor(Math.random() * LUCKY_PHRASES.length)],
    zodiac: input.birthday ? calculateZodiac(input.birthday) : undefined,
    strokes,
    styles: [style],
  };
}

function calculateZodiac(birthday: string): string {
  const year = parseInt(birthday.split('-')[0]);
  const zodiacs = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 
                   'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
  return zodiacs[(year - 1900) % 12];
}
