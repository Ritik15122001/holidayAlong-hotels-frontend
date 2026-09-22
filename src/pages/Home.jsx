import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, BadgeIndianRupee, Headset, MessageSquareQuote, ArrowRight, Star, Sparkles, Plane,
  Search, ListChecks, Send, FileCheck2, Waves, Mountain, Building2, Home as HomeIcon, Palmtree,
  Coffee, UtensilsCrossed, BedDouble, ChevronDown, Quote, Percent, Clock, MapPin,
} from 'lucide-react';
import Hero from '../components/Hero.jsx';
import CtaBar from '../components/CtaBar.jsx';
import HotelCard from '../components/HotelCard.jsx';
import Stars from '../components/Stars.jsx';
import { api, money } from '../api';
import { useSearch, useEnquiry } from '../store/useStore';

const IMG = (id, w = 900) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const HERO = [IMG(2506988, 1200), IMG(189296, 600), IMG(1134176, 600)];

const FALLBACK_DEST = [
  { city: 'Goa', image: IMG(2506988) }, { city: 'Udaipur', image: IMG(4502973) },
  { city: 'Jaipur', image: IMG(2869215) }, { city: 'Agra', image: IMG(189296) },
  { city: 'Delhi', image: IMG(1457842) }, { city: 'Munnar', image: IMG(6129967) },
];

const COLLECTIONS = [
  { label: 'Beach resorts', icon: Waves, image: IMG(1268871, 700), q: 'Goa' },
  { label: 'Hill & tea-estate stays', icon: Mountain, image: IMG(6129967, 700), q: 'Munnar' },
  { label: 'City hotels', icon: Building2, image: IMG(1457842, 700), q: 'Delhi' },
  { label: 'Himalayan homestays', icon: HomeIcon, image: IMG(1743231, 700), q: 'Narkanda' },
  { label: 'Heritage palaces', icon: Sparkles, image: IMG(4502973, 700), q: 'Udaipur' },
  { label: 'Poolside resorts', icon: Palmtree, image: IMG(3889843, 700), q: 'Goa' },
];

const STEPS = [
  { icon: Search, title: 'Search a destination', text: 'Pick your city, dates and guests. We show only verified, contracted properties.' },
  { icon: ListChecks, title: 'Compare real tariffs', text: 'See room type, meal plan and occupancy rates side by side — no hidden mark-ups.' },
  { icon: Send, title: 'Send one enquiry', text: 'Tell us what you need. No payment, no account, no booking commitment.' },
  { icon: FileCheck2, title: 'Get a proposal', text: 'Our travel desk confirms availability and replies with final pricing in 24 hours.' },
];

const MEAL_PLANS = [
  { code: 'EP', name: 'European Plan', text: 'Room only. Ideal if you plan to eat out or explore local restaurants.', icon: BedDouble, image: IMG(271618, 800) },
  { code: 'CP', name: 'Continental Plan', text: 'Room with breakfast included — the most popular choice for short stays.', icon: Coffee, image: IMG(67468, 800) },
  { code: 'MAP', name: 'Modified American Plan', text: 'Room with breakfast plus lunch or dinner. Best value for resort stays.', icon: UtensilsCrossed, image: IMG(1268871, 800) },
];

const WHY = [
  { icon: ShieldCheck, title: 'Verified hotels', text: 'Every property is inspected and contracted directly by our team.' },
  { icon: BadgeIndianRupee, title: 'Best available rates', text: 'Transparent room and meal-plan tariffs with no hidden mark-ups.' },
  { icon: Headset, title: 'Personalised assistance', text: 'A real travel desk for occasions, budgets and group stays.' },
  { icon: MessageSquareQuote, title: 'Easy enquiry', text: 'One enquiry, a tailored proposal back within 24 hours.' },
];

const REVIEWS = [
  { name: 'Ananya Sharma', city: 'Mumbai', text: 'They found us a sea-facing room in Goa well below what the booking sites were quoting, and answered every question the same day.', stay: 'The Azure Palm Resort' },
  { name: 'Rahul Verma', city: 'Pune', text: 'We needed four connecting rooms in Udaipur. One enquiry and we had a full tariff sheet with meal plans laid out clearly.', stay: 'Lake Pichola Heritage Palace' },
  { name: 'Meera Iyer', city: 'Bengaluru', text: 'The pricing table made it obvious what CP and MAP actually cost. No surprises at check-in, which is rare.', stay: 'Rajmahal Heritage Palace' },
];

const FAQS = [
  { q: 'Can I book and pay online?', a: 'No — and that is intentional. Holiday Along Hotels is an enquiry platform. You browse verified hotels and real tariffs, then send an enquiry. Our travel desk confirms availability and shares a final proposal, and payment is arranged directly once you are happy.' },
  { q: 'Are the tariffs shown final?', a: 'The rates on each hotel page are our contracted tariffs for the validity period shown, exclusive of taxes. They are indicative until we confirm availability for your exact dates, which we do when we reply to your enquiry.' },
  { q: 'What do EP, CP and MAP mean?', a: 'EP is room only, CP includes breakfast, and MAP includes breakfast plus one major meal. Every hotel page lists the rate for each plan so you can compare the true cost of your stay.' },
  { q: 'What are CNB, CWB and extra bed rates?', a: 'CNB is a child sharing the room without a bed, CWB is a child with a bed, and extra bed rates apply when an additional adult or child bed is added to the room. All of these are shown in the tariff table.' },
  { q: 'How quickly will I hear back?', a: 'Enquiries are answered by a person, not a bot, within one business day. Most guests hear back the same day between 9:30 am and 7:00 pm IST.' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [destinations, setDestinations] = useState(FALLBACK_DEST);
  const [openFaq, setOpenFaq] = useState(0);
  const setFilter = useSearch((s) => s.setFilter);
  const openEnquiry = useEnquiry((s) => s.openEnquiry);
  const navigate = useNavigate();

  useEffect(() => {
    api.hotels({ limit: 8, sort: 'rating' }).then((r) => setFeatured(r.data)).catch(() => {});
    api.destinations().then((d) => d.length && setDestinations(d)).catch(() => {});
  }, []);

  const deals = useMemo(
    () => [...featured].filter((h) => h.startingPrice).sort((a, b) => a.startingPrice - b.startingPrice).slice(0, 3),
    [featured]
  );

  const go = (q) => { setFilter({ q }); navigate('/hotels'); };

  return (
    <>
      <Hero />

      {/* FEATURED */}
      <section className="container-x py-14 sm:py-16">
        <SectionHead eyebrow="Top rated" title="Featured hotels" sub="Contracted tariffs, ready to enquire."
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

      {/* DESTINATIONS */}
      <section className="border-b border-line bg-surface py-14 sm:py-16">
        <div className="container-x">
        <SectionHead eyebrow="Where to next" title="Popular destinations" sub="Explore stays in the cities our guests ask for most." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {destinations.slice(0, 6).map((d) => (
            <button key={d.city} onClick={() => go(d.city)}
              className="group overflow-hidden rounded-xl border border-line bg-white text-left shadow-card transition hover:border-brand-200 hover:shadow-lift">
              <div className="overflow-hidden">
                <img src={d.image} alt={d.city} loading="lazy" className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-32" />
              </div>
              <div className="px-3 py-2.5">
                <p className="text-[14px] font-bold text-ink-900">{d.city}</p>
                <p className="text-[12px] text-ink-400">{d.count ? `${d.count} propert${d.count > 1 ? 'ies' : 'y'}` : 'Explore stays'}</p>
              </div>
            </button>
          ))}
        </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="py-14 sm:py-16">
        <div className="container-x">
          <SectionHead eyebrow="Browse by style" title="Find the kind of stay you want" sub="From beach resorts to heritage palaces — pick a mood, not just a city." />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {COLLECTIONS.map(({ label, icon: Icon, image, q }) => (
              <button key={label} onClick={() => go(q)}
                className="group relative overflow-hidden rounded-xl border border-line text-left shadow-card transition hover:shadow-lift">
                <img src={image} alt={label} loading="lazy" className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-36" />
                <div className="flex items-center justify-between gap-2 bg-white px-3.5 py-3">
                  <span className="flex items-center gap-2 text-[14px] font-bold text-ink-900"><Icon size={16} className="text-brand-600" /> {label}</span>
                  <ArrowRight size={15} className="shrink-0 text-ink-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* DEALS */}
      {deals.length > 0 && (
        <section className="border-y border-line bg-surface py-14 sm:py-16">
          <div className="container-x">
            <SectionHead eyebrow="Best value" title="Deals worth an enquiry" sub="Our lowest contracted double-occupancy rates right now."
              action={<Link to="/hotels" className="btn-outline !py-2.5">See all offers <ArrowRight size={15} /></Link>} />
            <div className="grid gap-3.5 lg:grid-cols-3">
              {deals.map((h) => (
                <div key={h._id} className="flex items-center gap-4 rounded-xl border border-line bg-white p-3.5 shadow-card">
                  <img src={h.images?.[0]} alt={h.name} loading="lazy" className="h-24 w-24 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <span className="badge bg-accent-50 text-accent-600"><Percent size={11} /> Lowest rate</span>
                    <p className="mt-1.5 truncate text-[15px] font-bold text-ink-900">{h.name}</p>
                    <p className="flex items-center gap-1.5 text-[12px] text-ink-500"><Stars count={h.starCategory} size={11} /> {h.city}</p>
                    <div className="mt-1.5 flex items-end justify-between gap-2">
                      <p className="text-[18px] font-extrabold text-ink-900">{money(h.startingPrice, h.currency)}<span className="text-[11px] font-medium text-ink-400"> /night</span></p>
                      <button onClick={() => openEnquiry({ hotelId: h._id, hotelName: h.name, roomType: h.topRoomType, mealPlan: h.topMealPlan })}
                        className="btn-accent !px-3 !py-2 !text-[12px]">Enquire</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="border-y border-line bg-white py-14 sm:py-16">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <img src={IMG(4502973, 1000)} alt="Luxury courtyard pool" loading="lazy" className="h-[300px] w-full object-cover sm:h-[430px]" />
            </div>
            <div className="absolute -bottom-5 left-5 hidden w-[230px] overflow-hidden rounded-2xl border border-white/60 bg-white/90 p-4 shadow-lift backdrop-blur sm:block">
              <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-accent-500"><Sparkles size={13} /> No payment</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-700">You never pay us. Settle directly with the hotel once you are happy.</p>
            </div>
          </div>

          <div>
            <SectionHead eyebrow="How it works" title="Four steps, no payment" sub="From search to a confirmed proposal — here is exactly what happens." />
            <ol className="relative space-y-6 border-l border-dashed border-line pl-8">
              {STEPS.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="relative">
                  <span className="absolute -left-[49px] grid h-[34px] w-[34px] place-items-center rounded-full bg-brand-600 text-[13px] font-extrabold text-white ring-4 ring-white">{i + 1}</span>
                  <h3 className="flex items-center gap-2 text-[16px] font-extrabold text-ink-900"><Icon size={17} className="text-accent-500" /> {title}</h3>
                  <p className="mt-1.5 max-w-md text-[13.5px] leading-relaxed text-ink-500">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* MEAL PLANS */}
      <section className="bg-surface py-14 sm:py-16">
        <div className="container-x">
          <SectionHead eyebrow="Know before you enquire" title="Meal plans, explained" sub="Every tariff on this site is priced against one of these three plans." />
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

      {/* WHY */}
      <section className="py-14 sm:py-16">
        <div className="container-x">
          <div className="overflow-hidden rounded-3xl bg-ink-900">
            <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
              <div className="relative min-h-[240px] lg:min-h-full">
                <img src={IMG(2869215, 900)} alt="Luxury hotel lobby" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-ink-900/30 to-ink-900/90 lg:bg-gradient-to-r lg:from-transparent lg:via-ink-900/20 lg:to-ink-900" />
              </div>
              <div className="p-7 sm:p-10">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent-500"><Star size={13} className="fill-accent-500" /> Why Holiday Along</p>
                <h2 className="mt-3 text-[26px] font-extrabold leading-tight text-white sm:text-[32px]">A boutique travel desk,<br className="hidden sm:block" /> not a booking engine</h2>
                <div className="mt-7 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  {WHY.map(({ icon: Icon, title, text }) => (
                    <div key={title} className="flex gap-3.5">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-accent-500"><Icon size={18} /></span>
                      <div>
                        <h3 className="text-[15px] font-bold text-white">{title}</h3>
                        <p className="mt-1 text-[13px] leading-relaxed text-white/60">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="border-y border-line bg-surface py-14 sm:py-16">
        <div className="container-x">
          <SectionHead eyebrow="Guest stories" title="What our guests say" sub="Feedback from travellers who enquired through us." />
          <div className="grid gap-3.5 lg:grid-cols-3">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="flex flex-col rounded-xl border border-line bg-white p-5">
                <Quote size={22} className="mb-2.5 text-brand-200" />
                <blockquote className="flex-1 text-[14px] leading-relaxed text-ink-700">{r.text}</blockquote>
                <figcaption className="mt-4 border-t border-line pt-3.5">
                  <Stars count={5} size={12} />
                  <p className="mt-1.5 text-[14px] font-bold text-ink-900">{r.name}</p>
                  <p className="text-[12px] text-ink-500">{r.city} · stayed at {r.stay}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x py-14 sm:py-16">
        <SectionHead eyebrow="Good to know" title="Frequently asked questions" sub="How enquiries, tariffs and meal plans work on this site." />
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q}>
                  <button onClick={() => setOpenFaq(open ? -1 : i)} className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left">
                    <span className="text-[14.5px] font-bold text-ink-900">{f.q}</span>
                    <ChevronDown size={18} className={`shrink-0 text-ink-400 transition ${open ? 'rotate-180 text-brand-600' : ''}`} />
                  </button>
                  {open && <p className="px-4 pb-4 text-[13.5px] leading-relaxed text-ink-500">{f.a}</p>}
                </div>
              );
            })}
          </div>
          <div className="rounded-xl border border-brand-100 bg-brand-50 p-5">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-white text-brand-600"><Headset size={20} /></span>
            <h3 className="mt-3.5 text-[16px] font-extrabold text-ink-900">Still have a question?</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">
              Our travel desk answers every enquiry personally. Tell us your dates and what matters to you.
            </p>
            <CtaBar variant="stack" className="mt-4" waText="Hi! I have a question about a hotel stay." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x pb-14 pt-4 sm:pb-16">
        <div className="relative overflow-hidden rounded-3xl">
          <img src={IMG(2506988, 1400)} alt="Luxury resort pool" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-ink-900/92 via-ink-900/75 to-brand-900/60" />
          <div className="relative grid items-center gap-8 p-7 sm:p-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[12px] font-bold text-white backdrop-blur"><Plane size={14} /> Planning something special?</span>
              <h2 className="mt-4 text-[28px] font-extrabold leading-tight text-white sm:text-[36px]">Find your perfect stay</h2>
              <p className="mt-2.5 max-w-lg text-[15px] leading-relaxed text-white/70">
                Share your dates and preferences. We'll come back with the right hotel, the right room and the right tariff — no payment needed.
              </p>
              <CtaBar className="mt-6" waText="Hi! I'd like help finding a hotel in India." />
              <Link to="/hotels" className="mt-4 inline-flex text-[13px] font-bold text-white/80 hover:text-white hover:underline">Or browse all hotels →</Link>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[['10+', 'Curated hotels'], ['24 hrs', 'Reply time'], ['4.6★', 'Guest rating']].map(([v, l]) => (
                <div key={l} className="rounded-2xl border border-white/15 bg-white/10 px-2 py-5 backdrop-blur">
                  <p className="text-[20px] font-extrabold text-white sm:text-[24px]">{v}</p>
                  <p className="mt-1 text-[11.5px] text-white/60">{l}</p>
                </div>
              ))}
            </div>
          </div>
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
