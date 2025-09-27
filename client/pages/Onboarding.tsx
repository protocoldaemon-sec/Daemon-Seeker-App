import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel, { type EmblaOptionsType } from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Onboarding() {
  const options: EmblaOptionsType = { loop: false, align: "start", dragFree: false };
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [index, setIndex] = useState(0);
  const slideCount = 2;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = (i: number) => emblaApi?.scrollTo(i);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
      <div className="mx-auto flex min-h-screen max-w-screen-sm flex-col px-6 py-10">
        <div className="mb-8 flex items-center justify-center">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
        </div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {/* Slide 1 */}
            <section className="min-w-0 shrink-0 grow-0 basis-full py-4">
              <div className="flex flex-col items-center text-center">
                <h1 className="mb-3 text-3xl font-semibold tracking-tight">Welcome to Daemon</h1>
                <p className="max-w-xs text-muted-foreground">
                  Modern onboarding experience with Poppins + Tailwind. Swipe to continue.
                </p>
                <div className="mt-8">
                  <Button onClick={() => scrollTo(1)} className="px-6">Next</Button>
                </div>
              </div>
            </section>

            {/* Slide 2 */}
            <section className="min-w-0 shrink-0 grow-0 basis-full py-4">
              <div className="flex flex-col items-center text-center">
                <h2 className="mb-3 text-3xl font-semibold tracking-tight">Everything you need</h2>
                <p className="max-w-xs text-muted-foreground">
                  Splash animation, onboarding with dots, Solana login, home with sidebar, and AI Copilot.
                </p>
                <div className="mt-8 flex flex-col items-center gap-3">
                  <Button asChild className="px-6">
                    <Link to="/login">Login with Solana</Link>
                  </Button>
                  <Button variant="outline" onClick={() => scrollTo(0)} className="px-6">Back</Button>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Dots */}
        <div className="mt-auto flex items-center justify-center gap-2 py-8">
          {Array.from({ length: slideCount }).map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={
                i === index
                  ? "h-2.5 w-6 rounded-full bg-indigo-600 transition-all"
                  : "h-2.5 w-2.5 rounded-full bg-indigo-200 transition-all"
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
