'use client';

import { ChineseName } from '@/lib/types';
import { useState } from 'react';
import LuckyCardModal from './LuckyCardModal';

interface Props {
  name: ChineseName;
}

export default function NameCard({ name }: Props) {
  const [showLuckyCard, setShowLuckyCard] = useState(false);

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(name.fullName);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="text-center mb-4">
        <h3 className="text-4xl font-bold text-red-600 mb-2">
          {name.fullName}
        </h3>
        <p className="text-lg text-gray-600">{name.pinyin}</p>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <span className="font-semibold text-gray-700">Meaning:</span>
          <p className="text-gray-600 mt-1">{name.meaning}</p>
        </div>

        <div>
          <span className="font-semibold text-gray-700">Lucky Phrase:</span>
          <p className="text-gray-600 mt-1 italic">{name.luckyPhrase}</p>
        </div>

        {name.zodiac && (
          <div>
            <span className="font-semibold text-gray-700">Zodiac:</span>
            <span className="text-gray-600 ml-2">{name.zodiac}</span>
          </div>
        )}

        <div>
          <span className="font-semibold text-gray-700">Style:</span>
          <div className="flex gap-2 mt-1">
            {name.styles.map(style => (
              <span key={style} className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs capitalize">
                {style}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSpeak}
          className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          🔊 Pronounce
        </button>
        <button
          onClick={() => setShowLuckyCard(true)}
          className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors"
        >
          ✨ Create Lucky Card
        </button>
      </div>
    </div>

    {showLuckyCard && (
      <LuckyCardModal name={name} onClose={() => setShowLuckyCard(false)} />
    )}
  </>
  );
}
