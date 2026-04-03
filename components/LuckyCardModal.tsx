'use client';

import { ChineseName } from '@/lib/types';
import { useEffect, useState } from 'react';

interface Props {
  name: ChineseName;
  gender: 'male' | 'female' | 'neutral';
  onClose: () => void;
}

export default function LuckyCardModal({ name, gender, onClose }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const cardPayload = {
    fullName: name.fullName,
    pinyin: name.pinyin,
    meaning: name.meaning,
    luckyPhrase: name.luckyPhrase,
    zodiac: name.zodiac || 'dragon',
    gender: gender,
  };

  // 打开时自动生成带水印预览图
  useEffect(() => {
    setPreviewLoading(true);
    fetch('/api/generate-card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...cardPayload, watermark: true }),
    })
      .then(res => res.blob())
      .then(blob => {
        setPreviewUrl(URL.createObjectURL(blob));
        setPreviewLoading(false);
      })
      .catch(() => setPreviewLoading(false));

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, []);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch('/api/generate-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cardPayload, watermark: false }),
      });

      if (!res.ok) {
        alert('Failed to generate card');
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name.fullName}_lucky_card.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert('Error generating card');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">✨ Your Lucky Card</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {/* 预览图 */}
        <div className="relative bg-gray-100" style={{ aspectRatio: '1/1' }}>
          {previewLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Generating your lucky card...</p>
            </div>
          ) : previewUrl ? (
            <img src={previewUrl} alt="Lucky Card Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              Preview unavailable
            </div>
          )}
        </div>

        {/* 说明 + 按钮 */}
        <div className="px-6 py-4">
          <p className="text-sm text-gray-500 text-center mb-4">
            Preview shown with watermark. Download the high-resolution version without watermark.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl hover:bg-gray-200 font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading || previewLoading}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-3 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              {isDownloading ? '⏳ Generating...' : '⬇️ Download HD Card'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
