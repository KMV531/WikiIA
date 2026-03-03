"use client";

import Particles from "@/components/Particles";
import { StepperWithContent } from "@/components/Steppers";

export default function NamePage() {
  return (
    <main className="relative min-h-svh w-full overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={[
            "#88E7FA ",
            "#ac63ff ",
            "#637cff ",
            "#3B82F6 ",
            "#EC4899 ",
          ]}
          particleCount={400}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={300}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>

      <div className="relative z-10 p-6 backdrop-blur-2xl rounded-lg">
        <StepperWithContent />
      </div>
    </main>
  );
}
