import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
  name: string;
  theme: string;
  score: number;
  questionNumber: number;
  setName: (newName: string) => void;
  setTheme: (newTheme: string) => void;
  addScore: (points: number) => void;
  nextQuestion: () => void;
  timeLeft: number;
  setTimeLeft: (time: number) => void;
  decrementTime: () => void;
  addTime: (seconds: number) => void;
  restartQuiz: () => void;
  resetGame: () => void;
}

export const useStore = create<GameState>()(
  persist(
    (set) => ({
      name: "",
      theme: "",
      score: 0,
      questionNumber: 1,
      timeLeft: 120,
      setTimeLeft: (time) => set({ timeLeft: time }),
      decrementTime: () =>
        set((state) => ({ timeLeft: Math.max(0, state.timeLeft - 1) })),

      setName: (newName) => set({ name: newName }),

      setTheme: (newTheme) => set({ theme: newTheme }),

      addScore: (points) => set((state) => ({ score: state.score + points })),

      nextQuestion: () =>
        set((state) => ({
          questionNumber: state.questionNumber + 1,
        })),

      addTime: (seconds) =>
        set((state) => ({
          timeLeft: state.timeLeft + seconds,
        })),
      restartQuiz: () =>
        set({
          score: 0,
          questionNumber: 1,
          timeLeft: 120,
        }),

      resetGame: () =>
        set({
          name: "",
          theme: "",
          score: 0,
          questionNumber: 1,
          timeLeft: 120,
        }),
    }),
    {
      name: "quiz-storage",
    },
  ),
);
