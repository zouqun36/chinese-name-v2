// 图片预加载缓存模块 - 使用内嵌 base64，零网络请求
import { ZODIAC_IMAGES, BG_IMAGES } from '@/lib/assets/card-images';

const imageCache: Map<string, HTMLImageElement> = new Map();

// 所有图片 src 映射（路径 → base64）
const IMAGE_DATA: Record<string, string> = {
  '/backgrounds/female.png': BG_IMAGES['female'],
  '/backgrounds/male.png': BG_IMAGES['male'],
  '/zodiac/rat.png': ZODIAC_IMAGES['rat'],
  '/zodiac/ox.png': ZODIAC_IMAGES['ox'],
  '/zodiac/tiger.png': ZODIAC_IMAGES['tiger'],
  '/zodiac/rabbit.png': ZODIAC_IMAGES['rabbit'],
  '/zodiac/dragon.png': ZODIAC_IMAGES['dragon'],
  '/zodiac/snake.png': ZODIAC_IMAGES['snake'],
  '/zodiac/horse.png': ZODIAC_IMAGES['horse'],
  '/zodiac/goat.png': ZODIAC_IMAGES['goat'],
  '/zodiac/monkey.png': ZODIAC_IMAGES['monkey'],
  '/zodiac/rooster.png': ZODIAC_IMAGES['rooster'],
  '/zodiac/dog.png': ZODIAC_IMAGES['dog'],
  '/zodiac/pig.png': ZODIAC_IMAGES['pig'],
};

function loadFromBase64(src: string): Promise<HTMLImageElement> {
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src)!);
  }
  const data = IMAGE_DATA[src];
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => { imageCache.set(src, img); resolve(img); };
    img.onerror = reject;
    img.src = data || src; // 有 base64 用 base64，否则降级用 URL
  });
}

// 预加载所有图片到内存（同步解析 base64，极快）
let preloadDone = false;
export function preloadAllImages(): Promise<void> {
  if (preloadDone) return Promise.resolve();
  preloadDone = true;
  return Promise.all(Object.keys(IMAGE_DATA).map(loadFromBase64)).then(() => {});
}

export function loadImageCached(src: string): Promise<HTMLImageElement> {
  return loadFromBase64(src);
}
