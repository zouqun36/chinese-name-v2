'use client';

import { useState } from 'react';
import { UserInput, ChineseName } from '@/lib/types';
import { generateNames } from '@/lib/generator';
import InputForm from './InputForm';
import NameList from './NameList';

export default function NameGenerator() {
  const [names, setNames] = useState<ChineseName[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = (input: UserInput) => {
    setLoading(true);
    setTimeout(() => {
      const generated = generateNames(input);
      setNames(generated);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <InputForm onGenerate={handleGenerate} loading={loading} />
      {names.length > 0 && <NameList names={names} />}
    </div>
  );
}
