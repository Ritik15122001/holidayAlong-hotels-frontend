import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import SearchPanel from './SearchPanel.jsx';

const P = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920`;

const SLIDES = [
  { image: P(2506988), tag: 'Beach resorts · Goa',        title: 'Luxury stays across India, at the right tariff', sub: 'Verified five-star resorts with transparent room and meal-plan rates.' },
  { image: P(4502973), tag: 'Heritage palaces · Udaipur', title: 'Palace hotels, honest pricing',                   sub: 'Lake-facing suites and courtyard pools, contracted directly by our desk.' },
  { image: P(1268871), tag: 'Infinity pools · Goa',       title: 'Sea-facing suites without the guesswork',         sub: 'Every property inspected by us before it reaches this page.' },
  { image: P(2869215), tag: 'City hotels · Delhi',        title: 'Grand hotels, one simple booking',                sub: 'Tell us your dates — we come back with availability and final rates.' },
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
          <img key={s.image} src={s.image} alt={s.tag}
            fetchPriority={idx === 0 ? 'high' : 'auto'} loading={idx === 0 ? 'eager' : 'lazy'}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ${idx === i ? 'opacity-100' : 'opacity-0'}`} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900/85 via-ink-900/55 to-ink-900/25" />
      </div>

      <div className="container-x relative flex flex-1 flex-col items-center justify-center py-20 text-center">
        <div className="max-w-[720px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm sm:text-[12px]">
            <ShieldCheck size={14} className="shrink-0" /> {SLIDES[i].tag}
          </span>
          <h1 className="mt-5 text-[30px] font-extrabold uppercase leading-[1.06] tracking-[-0.01em] text-white sm:text-[44px] lg:text-[54px]">
            {SLIDES[i].title}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-white/80 sm:text-[17px]">{SLIDES[i].sub}</p>
        </div>

        <div className="mt-9 w-full max-w-5xl">
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
