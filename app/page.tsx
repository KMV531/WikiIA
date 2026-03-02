"use client";

import { NameForm } from "@/components/name-form";
import Particles from "@/components/Particles";

export default function HomePage() {
  return (
    <main className="relative min-h-svh w-full overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff"]}
          particleCount={400}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm p-6 backdrop-blur-2xl rounded-lg">
        <NameForm />
      </div>
    </main>
  );
}
