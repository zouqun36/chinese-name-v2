'use client';

import { useState, useEffect } from 'react';
import { UserInput, ChineseName } from '@/lib/types';
import { generateNames } from '@/lib/generator';
import { preloadAllImages } from '@/lib/imageCache';
import InputForm from './InputForm';
import NameList from './NameList';

export default function NameGenerator() {
  const [names, setNames] = useState<ChineseName[]>([]);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState<'male' | 'female' | 'neutral'>('neutral');

  // 页面加载后立即预加载所有图片
  useEffect(() => {
    preloadAllImages();
  }, []);

  const handleGenerate = (input: UserInput) => {
    setLoading(true);
    setTimeout(() => {
      const generated = generateNames(input);
      setNames(generated);
      setGender(input.gender || 'neutral');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <InputForm onGenerate={handleGenerate} loading={loading} />
      {names.length > 0 && <NameList names={names} gender={gender} />}
    </div>
  );
}
