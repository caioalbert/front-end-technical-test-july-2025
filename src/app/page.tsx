'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Star = { width: number; height: number; top: number; left: number };

const generateStars = (count: number): Star[] =>
  Array.from({ length: count }, () => ({
    width: Math.random() * 2 + 1,
    height: Math.random() * 2 + 1,
    top: Math.random() * 100,
    left: Math.random() * 100,
  }));

const TITLE = 'Olá, recrutador!';
const SUBTITLE = 'Desafio técnico Vorp - Caio Alberto Ferreira';
const TYPING_SPEED = 40;

export default function Home() {
  const [stars, setStars] = useState<Star[]>([]);
  const [mounted, setMounted] = useState(false);
  const [typedTitle, setTypedTitle] = useState('');
  const [typedSubtitle, setTypedSubtitle] = useState('');
  const [showButton, setShowButton] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    setStars(generateStars(50));
  }, []);

  // Efeito de digitação do título e subtítulo
  useEffect(() => {
    let i = 0;
    setTypedTitle('');
    setTypedSubtitle('');
    setShowButton(false);
    const interval = setInterval(() => {
      i++;
      setTypedTitle(TITLE.substring(0, i));
      if (i === TITLE.length) {
        clearInterval(interval);
        setTimeout(() => {
          let j = 0;
          const subtitleInterval = setInterval(() => {
            j++;
            setTypedSubtitle(SUBTITLE.substring(0, j));
            if (j === SUBTITLE.length) {
              clearInterval(subtitleInterval);
              setTimeout(() => setShowButton(true), 300);
            }
          }, TYPING_SPEED);
        }, 300);
      }
    }, TYPING_SPEED);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden px-4 bg-black">
      {/* Gradiente roxo suave no topo */}
      <div className="absolute top-0 left-0 w-full h-56 z-0 pointer-events-none select-none">
        <div className="w-full h-full bg-gradient-to-b from-fuchsia-700/60 via-purple-900/40 to-transparent" />
      </div>

      {/* Estrelas só no client */}
      {mounted && (
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white opacity-20"
              style={{
                width: `${star.width}px`,
                height: `${star.height}px`,
                top: `${star.top}%`,
                left: `${star.left}%`,
              }}
            />
          ))}
        </div>
      )}

      {/* Conteúdo central */}
      <main className="flex flex-col items-center justify-center z-10 min-h-dvh w-full max-w-5xl mx-auto px-4">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-center text-fuchsia-300 mb-6 drop-shadow-lg max-w-3xl min-h-[3.5rem] sm:min-h-[5rem]">
          {typedTitle}
          <span className="animate-pulse text-white">
            {typedTitle.length < TITLE.length ? '|' : ''}
          </span>
        </h1>
        <p className="text-lg sm:text-2xl text-center text-gray-300 max-w-2xl mb-10 min-h-[2.5rem]">
          {typedSubtitle}
          <span className="animate-pulse text-white">
            {typedTitle.length === TITLE.length && typedSubtitle.length < SUBTITLE.length ? '|' : ''}
          </span>
        </p>
        <button
          onClick={() => router.push('/users')}
          className={`px-8 py-4 rounded-full bg-gradient-to-r from-fuchsia-600 via-purple-500 to-indigo-500 text-lg font-semibold text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400 cursor-pointer ${
            showButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          Tela inicial
        </button>
      </main>
    </div>
  );
}
