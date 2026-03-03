"use client";

import * as React from "react";
import {
  Sparkles,
  Fingerprint,
  Flag,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Stepper,
  StepperHeader,
  StepperIcon,
  StepperItem,
  StepperSeparator,
} from "@/components/ui/stepper";
import { useRouter } from "next/navigation";

export function StepperWithContent() {
  const [step, setStep] = React.useState(0);
  const router = useRouter();

  function onComplete() {
    router.push("/name");
  }

  const stepsContent = [
    {
      title: "L'IA a un secret",
      description:
        "Elle est brillante, mais elle fait parfois des erreurs. Ta mission est de les débusquer.",
      icon: Sparkles,
    },
    {
      title: "Identité & Thème",
      description:
        "Entre ton prénom et choisis un sujet. L'IA générera des textes spécialement pour toi.",
      icon: Fingerprint,
    },
    {
      title: "Objectif Final",
      description:
        "Réponds aux questions dans le temp impartie, accumule des points et découvre ton score à la fin de l'enquête.",
      icon: Flag,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl px-4">
      <div className="mb-4 text-center">
        <h1 className="text-center text-3xl font-bold tracking-tight text-white mb-1">
          Bienvenue sur WikipIA
        </h1>
        <p className="text-lg">
          L&apos;enquête où tu dois démasquer les erreurs de l&apos;IA !
        </p>
      </div>
      {/* Container */}
      <div className="relative overflow-hidden rounded-3xl border border-white/40 p-8 shadow-2xl backdrop-blur-lg md:p-12">
        <Stepper value={step} onChange={setStep} className="relative">
          <div className="flex w-full items-start">
            {stepsContent.map((item, index) => (
              <StepperItem
                key={index}
                value={index}
                disabled={step < index}
                className="flex-1"
              >
                <div className="flex flex-col items-center">
                  <div className="relative w-full">
                    {index < stepsContent.length - 1 && (
                      <StepperSeparator
                        className={cn(
                          "absolute top-5 left-1/2 h-0.5 w-full -translate-x-1/2 transition-all duration-500",
                          step > index
                            ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            : "bg-white/10",
                        )}
                      />
                    )}
                  </div>
                  <StepperHeader className="relative flex w-full items-center">
                    <StepperIcon
                      className={cn(
                        "relative z-10 mx-auto flex size-12 shrink-0 items-center justify-center rounded-2xl border-2 transition-all duration-500",
                        step >= index
                          ? "border-blue-500 bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                          : "border-white/10 bg-white/5 text-white/30",
                      )}
                    >
                      <item.icon className="h-6 w-6" />
                    </StepperIcon>
                  </StepperHeader>

                  {/* Contenu textuel dynamique qui change selon le step actif */}
                  <div
                    className={cn(
                      "mt-6 flex flex-col items-center transition-all duration-300",
                      step === index
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95 h-0 overflow-hidden",
                    )}
                  >
                    <h3 className="text-xl font-black italic tracking-tight text-white uppercase">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-center text-sm leading-relaxed text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </StepperItem>
            ))}
          </div>
        </Stepper>

        {/* Navigation */}
        <div className="mt-12 flex w-full justify-between gap-4">
          <Button
            variant="ghost"
            className="text-white/50 cursor-pointer hover:bg-white/5 hover:text-white"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Précédent
          </Button>

          {step === 2 ? (
            <Button
              className="bg-blue-600 cursor-pointer font-bold text-white hover:bg-blue-500 px-8 shadow-lg shadow-blue-900/40"
              onClick={onComplete}
            >
              C&apos;est parti !
            </Button>
          ) : (
            <Button
              className="bg-white/10 cursor-pointer font-bold text-white hover:bg-white/20 px-8 backdrop-blur-sm"
              onClick={() => setStep(step + 1)}
            >
              Suivant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Indicateur de position discret en dessous */}
      <p className="mt-6 text-center text-[10px] uppercase tracking-[0.3em] text-white/60">
        Phase d&apos;initialisation — {step + 1} / 3
      </p>
    </div>
  );
}
