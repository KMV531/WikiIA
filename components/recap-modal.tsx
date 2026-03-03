"use client";

import { useEffect } from "react";
import { useStore } from "@/Context/useStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { Trophy, RefreshCw, Home } from "lucide-react";

export default function RecapModal() {
  const { name, score, questionNumber, resetGame } = useStore();
  const router = useRouter();

  useEffect(() => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#3b82f6", "#ffffff", "#facc15"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#3b82f6", "#ffffff", "#facc15"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handleReplay = () => {
    resetGame();
    router.push("/theme");
  };

  return (
    <main className="flex min-h-svh flex-col items-center justify-center p-6 text-center">
      <div className="z-10 space-y-8 p-12 rounded-3xl backdrop-blur-lg border border-white/10 shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="flex justify-center">
          <div className="bg-yellow-500/20 p-6 rounded-full border-2 border-yellow-500/50">
            {score >= 50 ? (
              <Trophy className="w-12 h-12 text-yellow-400" />
            ) : (
              <Trophy className="w-12 h-12 text-red-500" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            {score >= 50 ? "Mission Accomplie !" : "Mission Echouée !"}
          </h1>
          {score >= 50 ? (
            <p className="text-blue-200 text-lg">
              Bravo <span className="font-bold text-white">{name}</span>, tu as
              terminé l&apos;enquête.
            </p>
          ) : (
            <p className="text-blue-200 text-lg">
              Dommage <span className="font-bold text-white">{name}</span>, tu
              n&apos;as pas réussi à terminer l&apos;enquête. N&apos;hésite pas
              à réessayer pour améliorer ton score !
            </p>
          )}
        </div>

        <div className="bg-white/5 rounded-2xl p-8 border border-white/5 flex flex-col items-start justify-between">
          <div className="flex items-center justify-between gap-8">
            <p className="text-gray-400 uppercase text-xs tracking-[0.3em]">
              Score Final :
            </p>
            <p className="text-xl font-black text-white font-mono">{score}</p>
          </div>
          <div className="flex items-center justify-between gap-8">
            <p className="text-gray-400 uppercase text-xs tracking-[0.3em]">
              No de Questions :
            </p>
            <p className="text-xl font-black text-white font-mono">
              {questionNumber}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            onClick={handleReplay}
            className="cursor-pointer h-14 px-8 bg-blue-600 hover:bg-blue-500 text-lg font-bold rounded-xl flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" /> Rejouer
          </Button>
          <Button
            onClick={() => {
              resetGame();
              router.push("/");
            }}
            variant="outline"
            className="cursor-pointer h-14 px-8 border-white/20 text-white hover:bg-white/10 text-lg font-bold rounded-xl flex items-center gap-2"
          >
            <Home className="w-5 h-5" /> Accueil
          </Button>
        </div>
      </div>
    </main>
  );
}
