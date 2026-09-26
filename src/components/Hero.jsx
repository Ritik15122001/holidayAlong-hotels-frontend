import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SearchPanel from './SearchPanel.jsx';

const P = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920`;

const SLIDES = [
  { image: P(2506988), alt: 'Beach resort in Goa' },
  { image: P(4502973), alt: 'Heritage palace in Udaipur' },
  { image: P(1268871), alt: 'Infinity pool in Goa' },
  { image: P(2869215), alt: 'City hotel in Delhi' },
];

export default function Hero() {
  const [i, setI] = useState(0);
  const next = useCallback(() => setI((v) => (v + 1) % SLIDES.length), []);
  const prev = () => setI((v) => (v - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const t = setInterval(next, 6500);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section className="relative flex min-h-[100svh] flex-col bg-ink-900 lg:min-h-[calc(100svh-64px)]">
      {/* Background layer clips on its own, so panels above it can overflow the hero. */}
      <div className="absolute inset-0 overflow-hidden">
        {SLIDES.map((s, idx) => (
          <img key={s.image} src={s.image} alt={s.alt}
            fetchPriority={idx === 0 ? 'high' : 'auto'} loading={idx === 0 ? 'eager' : 'lazy'}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ${idx === i ? 'opacity-100' : 'opacity-0'}`} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900/55 via-ink-900/35 to-ink-900/20" />
      </div>

      <div className="container-x relative flex flex-1 flex-col items-center justify-center py-20 text-center">
        <div className="w-full max-w-5xl">
          <SearchPanel />
        </div>
      </div>

      {/* Slider controls sit at the hero's foot so they do not push the panel off centre. */}
      <div className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-2.5 sm:bottom-8">
        <button onClick={prev} aria-label="Previous slide"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/30 text-white transition hover:bg-white hover:text-ink-900">
          <ChevronLeft size={18} />
        </button>
        <button onClick={next} aria-label="Next slide"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/30 text-white transition hover:bg-white hover:text-ink-900">
          <ChevronRight size={18} />
        </button>
        <div className="ml-2 flex items-center gap-1.5">
          {SLIDES.map((s, idx) => (
            <button key={s.image} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-7 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/75'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
