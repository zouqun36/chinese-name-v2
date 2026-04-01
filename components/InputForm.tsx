'use client';

import { useState } from 'react';
import { UserInput, Style } from '@/lib/types';

const STYLES: { value: Style; label: string }[] = [
  { value: 'classic', label: 'Classic' },
  { value: 'modern', label: 'Modern' },
  { value: 'nature', label: 'Nature' },
  { value: 'poetic', label: 'Poetic' },
  { value: 'lucky', label: 'Lucky' },
  { value: 'commercial', label: 'Commercial' },
];

interface Props {
  onGenerate: (input: UserInput) => void;
  loading: boolean;
}

export default function InputForm({ onGenerate, loading }: Props) {
  const [englishName, setEnglishName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [birthday, setBirthday] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<Style[]>(['classic']);

  const toggleStyle = (style: Style) => {
    setSelectedStyles(prev =>
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (englishName && selectedStyles.length > 0) {
      onGenerate({
        englishName,
        gender,
        birthday: birthday || undefined,
        styles: selectedStyles,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            English Name *
          </label>
          <input
            type="text"
            value={englishName}
            onChange={(e) => setEnglishName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="e.g., Michael"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as 'male' | 'female')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Birthday (Optional)
          </label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Style Preferences *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {STYLES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => toggleStyle(value)}
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                selectedStyles.includes(value)
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-red-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !englishName || selectedStyles.length === 0}
        className="mt-8 w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Generating...' : 'Generate Chinese Names'}
      </button>
    </form>
  );
}
