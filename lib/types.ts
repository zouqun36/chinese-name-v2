// 用户输入
export interface UserInput {
  englishName?: string;
  gender?: 'male' | 'female' | 'neutral';
  birthday?: string; // YYYY-MM-DD
  styles: Style[];
}

// 风格类型
export type Style = 'classic' | 'modern' | 'nature' | 'poetic' | 'lucky' | 'commercial';

// 生成的中文名
export interface ChineseName {
  id: string;
  surname: string;
  givenName: string;
  fullName: string;
  pinyin: string;
  meaning: string;
  luckyPhrase: string;
  zodiac?: string;
  strokes: number;
  styles: Style[];
}

// 吉祥卡
export interface LuckyCard {
  id: string;
  nameId: string;
  name: ChineseName;
  template: string;
  zodiacIcon: string;
  backgroundColor: string;
  isPaid: boolean;
  downloadUrl?: string;
}

// 数据库用户
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: number;
}
