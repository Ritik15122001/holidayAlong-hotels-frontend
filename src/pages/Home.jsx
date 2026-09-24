import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Star, Coffee, UtensilsCrossed, BedDouble, Percent, Clock, MapPin } from 'lucide-react';
import Hero from '../components/Hero.jsx';
import HotelCard from '../components/HotelCard.jsx';
import { api } from '../api';

const IMG = (id, w = 900) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const HERO = [IMG(2506988, 1200), IMG(189296, 600), IMG(1134176, 600)];

const MEAL_PLANS = [
  { code: 'EP', name: 'European Plan', text: 'Room only. Ideal if you plan to eat out or explore local restaurants.', icon: BedDouble, image: IMG(271618, 800) },
  { code: 'CP', name: 'Continental Plan', text: 'Room with breakfast included — the most popular choice for short stays.', icon: Coffee, image: IMG(67468, 800) },
  { code: 'MAP', name: 'Modified American Plan', text: 'Room with breakfast plus lunch or dinner. Best value for resort stays.', icon: UtensilsCrossed, image: IMG(1268871, 800) },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.hotels({ limit: 8, sort: 'rating' }).then((r) => setFeatured(r.data)).catch(() => {});
  }, []);


  return (
    <>
      <Hero />

      {/* FEATURED */}
      <section className="container-x py-14 sm:py-16">
        <SectionHead eyebrow="Top rated" title="Featured hotels" sub="Contracted tariffs, ready to book."
          action={<Link to="/hotels" className="btn-outline !py-2.5">View all hotels <ArrowRight size={15} /></Link>} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(featured.length ? featured : Array.from({ length: 4 })).map((h, i) =>
            h ? <HotelCard key={h._id} hotel={h} /> : <div key={i} className="h-[380px] animate-pulse rounded-xl bg-surface" />
          )}
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-line bg-white">
        <div className="container-x grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
          {[
            [ShieldCheck, '10+', 'Verified hotels'],
            [Percent, '96', 'Live tariff records'],
            [Clock, '24 hrs', 'Average reply time'],
            [MapPin, '8', 'Indian destinations'],
          ].map(([Icon, value, label]) => (
            <div key={label} className="flex items-center gap-3 bg-white px-4 py-5 sm:justify-center">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"><Icon size={19} /></span>
              <div>
                <p className="text-[18px] font-extrabold leading-tight text-ink-900">{value}</p>
                <p className="text-[12px] text-ink-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MEAL PLANS */}
      <section className="bg-surface py-14 sm:py-16">
        <div className="container-x">
          <SectionHead eyebrow="Know before you book" title="Meal plans, explained" sub="Every tariff on this site is priced against one of these three plans." />
          <div className="grid gap-4 lg:grid-cols-3">
            {MEAL_PLANS.map(({ code, name, text, icon: Icon, image }) => (
              <article key={code} className="group overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:shadow-lift">
                <div className="relative h-44 overflow-hidden">
                  <img src={image} alt={name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 p-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15 text-white backdrop-blur"><Icon size={18} /></span>
                    <div>
                      <p className="text-[19px] font-extrabold leading-none text-white">{code}</p>
                      <p className="mt-1 text-[12px] text-white/80">{name}</p>
                    </div>
                  </div>
                </div>
                <p className="p-5 text-[13.5px] leading-relaxed text-ink-500">{text}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-[13px] text-ink-500">
            Child and extra-bed rates — CNB, CWB, adult and child extra bed — are listed alongside every plan on the hotel page.
          </p>
        </div>
      </section>

    </>
  );
}

function SectionHead({ eyebrow, title, sub, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-7">
      <div>
        <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-accent-500">
          <Star size={12} className="fill-accent-500" /> {eyebrow}
        </p>
        <h2 className="text-[22px] font-extrabold text-ink-900 sm:text-[26px]">{title}</h2>
        {sub && <p className="mt-1 text-[14px] text-ink-500">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
