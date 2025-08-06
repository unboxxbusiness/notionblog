'use client';

import { Typewriter } from './typewriter';

export function HomeHero() {
  const typewriterTexts = ["Creativity & Code", "Design & Development", "AI & Innovation"];
  return (
    <section className="text-center my-8 h-28">
        <Typewriter text={typewriterTexts} className="text-4xl font-bold font-headline tracking-tight sm:text-5xl lg:text-6xl" />
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            A blog for creative minds and curious souls. Explore topics in design,
            development, and AI.
        </p>
    </section>
  );
}
