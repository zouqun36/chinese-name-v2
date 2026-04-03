// 图片预加载缓存模块
// 页面启动时预加载所有背景图和生肖图，后续直接从缓存取

const imageCache: Map<string, string> = new Map();
let preloadPromise: Promise<void> | null = null;

const ALL_IMAGES = [
  '/backgrounds/female.png',
  '/backgrounds/male.png',
  '/zodiac/rat.png', '/zodiac/ox.png', '/zodiac/tiger.png', '/zodiac/rabbit.png',
  '/zodiac/dragon.png', '/zodiac/snake.png', '/zodiac/horse.png', '/zodiac/goat.png',
  '/zodiac/monkey.png', '/zodiac/rooster.png', '/zodiac/dog.png', '/zodiac/pig.png',
];

async function fetchAndCache(src: string): Promise<void> {
  if (imageCache.has(src)) return;
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    imageCache.set(src, url);
  } catch {
    // 忽略单张失败，不影响其他图片
  }
}

export function preloadAllImages(): Promise<void> {
  if (preloadPromise) return preloadPromise;
  preloadPromise = Promise.all(ALL_IMAGES.map(fetchAndCache)).then(() => {});
  return preloadPromise;
}

export function loadImageCached(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src);
  const blobUrl = cached || src;

  if (cached) {
    // 已缓存，直接加载
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = blobUrl;
    });
  }

  // 未缓存，fetch后加载
  return new Promise((resolve, reject) => {
    fetch(src)
      .then(r => r.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        imageCache.set(src, url);
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      })
      .catch(reject);
  });
}
