'use client';

import { ChineseName } from '@/lib/types';
import NameCard from './NameCard';

interface Props {
  names: ChineseName[];
  gender: 'male' | 'female' | 'neutral';
}

export default function NameList({ names, gender }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Your Chinese Names
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {names.map((name) => (
          <NameCard key={name.id} name={name} gender={gender} />
        ))}
      </div>
    </div>
  );
}
