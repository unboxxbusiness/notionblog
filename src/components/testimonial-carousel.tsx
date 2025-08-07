
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  href: string;
};

export function TestimonialCarousel({
  testimonials,
  autoplay = true,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNext = React.useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!autoplay || testimonials.length <= 1) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [autoplay, handleNext, testimonials.length]);

  const isActive = (index: number) => index === active;

  const randomRotate = () => `${Math.floor(Math.random() * 16) - 8}deg`;

  if (!isMounted) {
      return null;
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-20">
        {/* Image Section */}
        <div className="flex items-center justify-center">
            <div className="relative h-80 w-full max-w-xs">
              <AnimatePresence>
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.src}
                    initial={{ opacity: 0, scale: 0.9, y: 50, rotate: randomRotate() }}
                    animate={{
                      opacity: isActive(index) ? 1 : 0.5,
                      scale: isActive(index) ? 1 : 0.9,
                      y: isActive(index) ? 0 : 20,
                      zIndex: isActive(index) ? testimonials.length : testimonials.length - Math.abs(index - active),
                      rotate: isActive(index) ? '0deg' : randomRotate(),
                    }}
                    exit={{ opacity: 0, scale: 0.9, y: -50 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 origin-bottom"
                    style={{ perspective: '1000px' }}
                  >
                    <Link href={testimonial.href}>
                        <Image
                        src={testimonial.src}
                        alt={testimonial.name}
                        width={500}
                        height={500}
                        draggable={false}
                        className="h-full w-full rounded-3xl object-cover shadow-2xl"
                        />
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
        </div>

        {/* Text and Controls Section */}
        <div className="flex flex-col justify-center py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col justify-between"
            >
                <div>
                    <h3 className="font-headline text-2xl font-bold">
                        <Link href={testimonials[active].href}>{testimonials[active].name}</Link>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {testimonials[active].designation}
                    </p>
                    <motion.p className="mt-8 text-lg text-foreground/80 line-clamp-4">
                        {testimonials[active].quote}
                    </motion.p>
                </div>
            </motion.div>
          </AnimatePresence>
          {testimonials.length > 1 && (
            <div className="flex gap-4 pt-12">
              <button
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <ArrowLeft className="h-5 w-5 text-secondary-foreground transition-transform duration-300 group-hover:-translate-x-1" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next testimonial"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <ArrowRight className="h-5 w-5 text-secondary-foreground transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
