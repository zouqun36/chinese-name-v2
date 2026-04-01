// 常见姓氏库
export const SURNAMES = [
  { chinese: '李', pinyin: 'Li', frequency: 100 },
  { chinese: '王', pinyin: 'Wang', frequency: 95 },
  { chinese: '张', pinyin: 'Zhang', frequency: 90 },
  { chinese: '刘', pinyin: 'Liu', frequency: 85 },
  { chinese: '陈', pinyin: 'Chen', frequency: 80 },
  { chinese: '杨', pinyin: 'Yang', frequency: 75 },
  { chinese: '黄', pinyin: 'Huang', frequency: 70 },
  { chinese: '赵', pinyin: 'Zhao', frequency: 65 },
  { chinese: '吴', pinyin: 'Wu', frequency: 60 },
  { chinese: '周', pinyin: 'Zhou', frequency: 55 },
];

// 名字字库（按风格分类）
export const NAME_CHARACTERS = {
  classic: {
    male: [
      { char: '文', pinyin: 'wen', strokes: 4, meaning: 'cultured, literary' },
      { char: '武', pinyin: 'wu', strokes: 8, meaning: 'martial, brave' },
      { char: '明', pinyin: 'ming', strokes: 8, meaning: 'bright, clear' },
      { char: '德', pinyin: 'de', strokes: 15, meaning: 'virtue, morality' },
      { char: '仁', pinyin: 'ren', strokes: 4, meaning: 'benevolence, kindness' },
    ],
    female: [
      { char: '雅', pinyin: 'ya', strokes: 12, meaning: 'elegant, graceful' },
      { char: '静', pinyin: 'jing', strokes: 14, meaning: 'quiet, calm' },
      { char: '婉', pinyin: 'wan', strokes: 11, meaning: 'graceful, gentle' },
      { char: '淑', pinyin: 'shu', strokes: 11, meaning: 'virtuous, kind' },
      { char: '慧', pinyin: 'hui', strokes: 15, meaning: 'intelligent, wise' },
    ],
  },
  modern: {
    male: [
      { char: '轩', pinyin: 'xuan', strokes: 10, meaning: 'high, lofty' },
      { char: '宇', pinyin: 'yu', strokes: 6, meaning: 'universe, space' },
      { char: '晨', pinyin: 'chen', strokes: 11, meaning: 'morning, dawn' },
      { char: '睿', pinyin: 'rui', strokes: 14, meaning: 'wise, intelligent' },
      { char: '泽', pinyin: 'ze', strokes: 8, meaning: 'grace, favor' },
    ],
    female: [
      { char: '欣', pinyin: 'xin', strokes: 8, meaning: 'happy, joyful' },
      { char: '悦', pinyin: 'yue', strokes: 10, meaning: 'pleased, delighted' },
      { char: '琪', pinyin: 'qi', strokes: 12, meaning: 'precious jade' },
      { char: '萱', pinyin: 'xuan', strokes: 12, meaning: 'day lily flower' },
      { char: '涵', pinyin: 'han', strokes: 11, meaning: 'contain, cultivate' },
    ],
  },
  nature: {
    male: [
      { char: '林', pinyin: 'lin', strokes: 8, meaning: 'forest, woods' },
      { char: '山', pinyin: 'shan', strokes: 3, meaning: 'mountain' },
      { char: '海', pinyin: 'hai', strokes: 10, meaning: 'ocean, sea' },
      { char: '松', pinyin: 'song', strokes: 8, meaning: 'pine tree' },
      { char: '云', pinyin: 'yun', strokes: 4, meaning: 'cloud' },
    ],
    female: [
      { char: '梅', pinyin: 'mei', strokes: 11, meaning: 'plum blossom' },
      { char: '兰', pinyin: 'lan', strokes: 5, meaning: 'orchid' },
      { char: '竹', pinyin: 'zhu', strokes: 6, meaning: 'bamboo' },
      { char: '菊', pinyin: 'ju', strokes: 11, meaning: 'chrysanthemum' },
      { char: '莲', pinyin: 'lian', strokes: 10, meaning: 'lotus' },
    ],
  },
  poetic: {
    male: [
      { char: '诗', pinyin: 'shi', strokes: 8, meaning: 'poetry, poem' },
      { char: '韵', pinyin: 'yun', strokes: 13, meaning: 'rhyme, charm' },
      { char: '墨', pinyin: 'mo', strokes: 15, meaning: 'ink, literary' },
      { char: '书', pinyin: 'shu', strokes: 4, meaning: 'book, writing' },
      { char: '逸', pinyin: 'yi', strokes: 11, meaning: 'ease, leisure' },
    ],
    female: [
      { char: '诗', pinyin: 'shi', strokes: 8, meaning: 'poetry, poem' },
      { char: '画', pinyin: 'hua', strokes: 8, meaning: 'painting, picture' },
      { char: '琴', pinyin: 'qin', strokes: 12, meaning: 'musical instrument' },
      { char: '韵', pinyin: 'yun', strokes: 13, meaning: 'rhyme, charm' },
      { char: '雨', pinyin: 'yu', strokes: 8, meaning: 'rain' },
    ],
  },
  lucky: {
    male: [
      { char: '福', pinyin: 'fu', strokes: 13, meaning: 'fortune, blessing' },
      { char: '瑞', pinyin: 'rui', strokes: 13, meaning: 'auspicious, lucky' },
      { char: '祥', pinyin: 'xiang', strokes: 10, meaning: 'auspicious, good omen' },
      { char: '吉', pinyin: 'ji', strokes: 6, meaning: 'lucky, auspicious' },
      { char: '昌', pinyin: 'chang', strokes: 8, meaning: 'prosperous, flourishing' },
    ],
    female: [
      { char: '瑞', pinyin: 'rui', strokes: 13, meaning: 'auspicious, lucky' },
      { char: '祥', pinyin: 'xiang', strokes: 10, meaning: 'auspicious, good omen' },
      { char: '喜', pinyin: 'xi', strokes: 12, meaning: 'joy, happiness' },
      { char: '福', pinyin: 'fu', strokes: 13, meaning: 'fortune, blessing' },
      { char: '宝', pinyin: 'bao', strokes: 8, meaning: 'treasure, precious' },
    ],
  },
  commercial: {
    male: [
      { char: '凯', pinyin: 'kai', strokes: 8, meaning: 'triumph, victory' },
      { char: '杰', pinyin: 'jie', strokes: 8, meaning: 'outstanding, hero' },
      { char: '强', pinyin: 'qiang', strokes: 11, meaning: 'strong, powerful' },
      { char: '伟', pinyin: 'wei', strokes: 6, meaning: 'great, mighty' },
      { char: '达', pinyin: 'da', strokes: 6, meaning: 'achieve, reach' },
    ],
    female: [
      { char: '敏', pinyin: 'min', strokes: 11, meaning: 'quick, clever' },
      { char: '慧', pinyin: 'hui', strokes: 15, meaning: 'intelligent, wise' },
      { char: '颖', pinyin: 'ying', strokes: 13, meaning: 'intelligent, bright' },
      { char: '佳', pinyin: 'jia', strokes: 8, meaning: 'excellent, beautiful' },
      { char: '丽', pinyin: 'li', strokes: 7, meaning: 'beautiful, pretty' },
    ],
  },
};

// 吉祥语库
export const LUCKY_PHRASES = [
  'May your name bring you endless fortune and happiness',
  'A name that shines like the morning sun',
  'Blessed with wisdom and prosperity',
  'Your name carries the spirit of success',
  'May this name guide you to greatness',
];
