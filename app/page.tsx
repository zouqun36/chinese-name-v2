import NameGenerator from '@/components/NameGenerator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-red-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-red-600 mb-4">
            Chinese Name Generator
          </h1>
          <p className="text-xl text-gray-600">
            Discover a meaningful Chinese name that resonates with your identity.
          </p>
          <p className="text-lg text-gray-500 mt-2">
            Good Name, Good Luck.
          </p>
        </header>
        
        <NameGenerator />
      </div>
    </main>
  );
}
