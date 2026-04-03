'use client';

import { ChineseName } from '@/lib/types';
import { useRef, useState } from 'react';

interface Props {
  name: ChineseName;
  gender: 'male' | 'female' | 'neutral';
  onClose: () => void;
}

const ZODIAC_EMOJI: { [key: string]: string } = {
  'Rat': '🐀', 'Ox': '🐂', 'Tiger': '🐅', 'Rabbit': '🐇',
  'Dragon': '🐉', 'Snake': '🐍', 'Horse': '🐴', 'Goat': '🐐',
  'Monkey': '🐒', 'Rooster': '🐓', 'Dog': '🐕', 'Pig': '🐖',
};

export default function LuckyCardModal({ name, gender, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name.fullName,
          pinyin: name.pinyin,
          meaning: name.meaning,
          luckyPhrase: name.luckyPhrase,
          zodiac: name.zodiac || 'dragon',
          gender: gender,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert('Failed to generate card: ' + err.error);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name.fullName}_lucky_card.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Error generating card');
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Lucky Card Preview</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
          </div>

          {/* Card Preview */}
          <div
            ref={cardRef}
            className="bg-gradient-to-br from-red-50 to-yellow-50 border-4 border-red-600 rounded-lg p-8 mb-6"
            style={{ aspectRatio: '3/4' }}
          >
            <div className="h-full flex flex-col justify-between">
              {name.zodiac && (
                <div className="text-center">
                  <div className="text-6xl mb-2">{ZODIAC_EMOJI[name.zodiac]}</div>
                  <p className="text-sm text-gray-600">{name.zodiac}</p>
                </div>
              )}
              <div className="text-center flex-1 flex flex-col justify-center">
                <h1 className="text-6xl font-bold text-red-600 mb-4">{name.fullName}</h1>
                <p className="text-2xl text-gray-700 mb-4">{name.pinyin}</p>
                <p className="text-lg text-gray-600 italic">{name.meaning}</p>
              </div>
              <div className="text-center border-t-2 border-red-300 pt-4">
                <p className="text-lg text-gray-700 italic">"{name.luckyPhrase}"</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex-1 bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Download Lucky Card'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
