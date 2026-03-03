"use client";

import { useState, useEffect, useCallback } from "react";
import { useStore } from "@/Context/useStore";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Timer, Trophy, ArrowRight, AlertCircle } from "lucide-react";

export default function QuestionsForm() {
  const { theme, name, score, addScore, questionNumber, nextQuestion } =
    useStore();
  const router = useRouter();

  // --- ÉTATS DU JEU ---
  const [loading, setLoading] = useState(true);
  const [textIA, setTextIA] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [userCorrection, setUserCorrection] = useState("");

  // États pour le feedback
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [aiAnswer, setAiAnswer] = useState({ error: "", correction: "" });

  // --- LOGIQUE DE RÉCUPÉRATION (API GROQ) ---
  const fetchQuestion = useCallback(async () => {
    setLoading(true);
    setShowFeedback(false);
    setUserCorrection("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme }),
      });

      if (!response.ok) throw new Error("Erreur API");

      const data = await response.json();
      setTextIA(data.text);
      setAiAnswer({ error: data.error, correction: data.correction });
      setLoading(false);
      setTimeLeft(60);
    } catch (error) {
      toast.error(
        "Impossible de générer la question. Vérifie ta clé API Groq.",
        {
          description:
            "Assure-toi d'avoir une clé API valide et de l'avoir configurée correctement.",
          style: { backgroundColor: "red", color: "#fff" },
        },
      );
      console.error("Erreur lors de la récupération de la question :", error);
    }
  }, [theme, toast]);

  // Initialisation et sécurité
  useEffect(() => {
    if (!theme || !name) {
      router.push("/");
      return;
    }
    fetchQuestion();
  }, [questionNumber, theme, name, router, fetchQuestion]);

  // --- LOGIQUE DU TIMER ---
  useEffect(() => {
    if (loading || showFeedback || timeLeft <= 0) {
      if (timeLeft === 0 && !showFeedback) handleValidate(); // Auto-validation à 0s
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, showFeedback, timeLeft]);

  // --- VALIDATION DE LA RÉPONSE ---
  const handleValidate = async () => {
    if (!userCorrection.trim()) return;

    setLoading(true); // On réutilise le loader pour l'analyse

    try {
      // APPEL À L'API DE VÉRIFICATION
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userChoice: userCorrection, // Ce que l'élève a écrit
          aiError: aiAnswer.error, // L'erreur que l'IA avait cachée
          aiCorrection: aiAnswer.correction, // La vérité
        }),
      });

      const data = await response.json();

      // On arrête le timer et on montre le résultat
      setShowFeedback(true);
      setIsCorrect(data.isCorrect);

      if (data.isCorrect) {
        // Calcul des points (100 de base + bonus temps)
        const pointsGagnes = 100 + Math.floor(timeLeft / 2);
        addScore(pointsGagnes);
        toast.success("Bien joué !", {
          description: "Ton analyse est correcte.",
          style: { backgroundColor: "green", color: "#fff" },
        });
      } else {
        toast.error("Dommage...", {
          description: "L'IA n'est pas convaincue par ton explication.",
          style: { backgroundColor: "red", color: "#fff" },
        });
      }
    } catch (error) {
      console.error("Erreur de vérification:", error);
      toast.error("Erreur lors de l'analyse", {
        description: "Impossible de vérifier ta réponse. Essaie à nouveau.",
        style: { backgroundColor: "red", color: "#fff" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (questionNumber >= 5) {
      router.push("/recap");
    } else {
      nextQuestion();
    }
  };

  return (
    <main className="flex min-h-svh flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-3xl space-y-6">
        {/* BARRE D'INFOS HAUTE */}
        <div className="flex justify-between items-center p-4 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Trophy className="w-5 h-5 text-blue-400" />
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                Score
              </p>
              <p className="text-white font-bold font-mono">{score}</p>
            </div>
          </div>

          <div
            className={`flex items-center gap-3 px-6 py-2 rounded-full border ${
              timeLeft < 15
                ? "border-red-500 bg-red-500/10 animate-pulse"
                : "border-white/20 bg-white/5"
            }`}
          >
            <Timer
              className={`w-5 h-5 ${timeLeft < 15 ? "text-red-500" : "text-white"}`}
            />
            <span
              className={`text-2xl font-black font-mono ${timeLeft < 15 ? "text-red-500" : "text-white"}`}
            >
              {timeLeft}s
            </span>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
              Question
            </p>
            <p className="text-white font-bold">
              {questionNumber} <span className="text-gray-500">/ 5</span>
            </p>
          </div>
        </div>

        {/* CARTE PRINCIPALE (TEXTE IA) */}
        <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl overflow-hidden relative">
          <CardContent className="p-8 md:p-12">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-blue-200 font-medium animate-pulse">
                  L&quot;IA rédige un texte sur {theme}...
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <span className="text-blue-500 font-bold uppercase text-xs tracking-[0.2em] mb-4 block">
                    Rapport d&apos;analyse
                  </span>
                  <p className="text-xl md:text-2xl text-gray-100 leading-relaxed font-serif italic">
                    &quot;{textIA}&quot;
                  </p>
                </div>

                {/* ZONE DE FEEDBACK (S'affiche après validation) */}
                {showFeedback && (
                  <div
                    className={`p-6 rounded-xl border-l-4 transform transition-all animate-in zoom-in-95 duration-300 ${
                      isCorrect
                        ? "bg-green-500/10 border-green-500"
                        : "bg-red-500/10 border-red-500"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {isCorrect ? (
                        <Trophy className="w-8 h-8 text-green-500 shrink-0" />
                      ) : (
                        <AlertCircle className="w-8 h-8 text-red-500 shrink-0" />
                      )}
                      <div className="space-y-2">
                        <h3
                          className={`text-xl font-bold ${isCorrect ? "text-green-400" : "text-red-400"}`}
                        >
                          {isCorrect
                            ? "Bien joué, Détective !"
                            : "L'IA t'a eu cette fois !"}
                        </h3>
                        <p className="text-gray-300 italic">
                          <span className="text-white font-bold not-italic">
                            L&quot;erreur était :
                          </span>{" "}
                          {aiAnswer.error}
                        </p>
                        <p className="text-gray-300 italic">
                          <span className="text-white font-bold not-italic">
                            La vérité :
                          </span>{" "}
                          {aiAnswer.correction}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ZONE D'INTERACTION (INPUT OU BOUTON NEXT) */}
        <div className="min-h-37.5">
          {!loading && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              {!showFeedback ? (
                <>
                  <Textarea
                    placeholder="Qu'est-ce qui est faux dans ce texte ? Explique pourquoi..."
                    className="bg-white/5 border-white/10 text-white min-h-30 text-lg rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-white/50"
                    value={userCorrection}
                    onChange={(e) => setUserCorrection(e.target.value)}
                  />
                  <Button
                    onClick={handleValidate}
                    disabled={userCorrection.length < 3}
                    className="w-full cursor-pointer h-14 text-lg font-bold bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                  >
                    Vérifier ma théorie
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleNext}
                  className="w-full h-14 cursor-pointer text-lg font-bold bg-white text-black hover:bg-gray-200 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl"
                >
                  {questionNumber >= 5
                    ? "Découvrir mon score final"
                    : "Question suivante"}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
