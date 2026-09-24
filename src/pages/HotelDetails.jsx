import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Wifi, Waves, UtensilsCrossed, Car, ConciergeBell, Snowflake, Dumbbell, Flower2,
  LogIn, LogOut, X, ChevronLeft, ChevronRight, Phone, Mail, ArrowLeft, Images, ShieldCheck, Check,
  BedDouble, Users, Baby, CreditCard, Ban, Clock, Navigation, Star, ChevronDown, Coffee,
  Plane, TrainFront, Sparkles, FileText, Maximize2, Cigarette, PawPrint, Building2, CalendarDays,
} from 'lucide-react';
import Stars from '../components/Stars.jsx';
import PricingTable from '../components/PricingTable.jsx';
import HotelCard from '../components/HotelCard.jsx';
import { api, money } from '../api';
import CtaBar from '../components/CtaBar.jsx';
import { WhatsAppIcon } from '../components/Icons.jsx';
import { iconFor } from '../lib/icons.js';
import { PHONE, PHONE_DISPLAY, EMAIL, waHotel } from '../components/Contact.js';
import { useEnquiry } from '../store/useStore';

/** Icon per amenity comes from the amenity master; falls back to a generic one. */

const MEAL_INFO = {
  EP: { name: 'European Plan', desc: 'Room only. Meals are charged separately at the hotel.', includes: ['Room stay', 'Taxes as applicable'] },
  CP: { name: 'Continental Plan', desc: 'Room with daily breakfast for the occupants booked.', includes: ['Room stay', 'Daily breakfast'] },
  MAP: { name: 'Modified American Plan', desc: 'Room with breakfast plus lunch or dinner each day.', includes: ['Room stay', 'Daily breakfast', 'Lunch or dinner'] },
  AP: { name: 'American Plan', desc: 'Room with breakfast, lunch and dinner included.', includes: ['Room stay', 'All three meals'] },
};

const ROOM_FEATURES = {
  Standard: ['Queen bed', 'City or garden view', '24×7 room service', 'Tea/coffee maker'],
  Deluxe: ['King bed', 'Private balcony', 'Mini bar', 'Work desk'],
  Premium: ['King bed', 'Premium view', 'Lounge seating', 'Bathtub'],
  Suite: ['Separate living room', 'Panoramic view', 'Walk-in wardrobe', 'Butler on call'],
  Penthouse: ['Top-floor privacy', 'Private terrace', 'Jacuzzi', 'Dedicated butler'],
};
const ROOM_SIZE = { Standard: '220 sq.ft', Deluxe: '300 sq.ft', Premium: '380 sq.ft', Suite: '550 sq.ft', Penthouse: '900 sq.ft' };

const NEARBY = {
  Goa: [['Calangute Beach', '2.4 km'], ['Baga Night Market', '3.1 km'], ['Fort Aguada', '8.5 km'], ['Dabolim Airport', '38 km']],
  Udaipur: [['Lake Pichola', '0.6 km'], ['City Palace', '1.4 km'], ['Jagdish Temple', '1.8 km'], ['Maharana Pratap Airport', '24 km']],
  Jaipur: [['Hawa Mahal', '2.2 km'], ['Amber Fort', '9.6 km'], ['City Palace', '2.8 km'], ['Jaipur Airport', '13 km']],
  Agra: [['Taj Mahal', '1.2 km'], ['Agra Fort', '3.4 km'], ['Mehtab Bagh', '4.1 km'], ['Agra Cantt Station', '6 km']],
  Delhi: [['India Gate', '3.5 km'], ['Connaught Place', '2.1 km'], ['Humayun’s Tomb', '6.4 km'], ['IGI Airport', '17 km']],
  Mumbai: [['Gateway of India', '2.6 km'], ['Marine Drive', '3.2 km'], ['Bandra–Worli Sea Link', '9 km'], ['CSMIA Airport', '21 km']],
  Munnar: [['Tea Museum', '4.2 km'], ['Eravikulam National Park', '13 km'], ['Mattupetty Dam', '11 km'], ['Cochin Airport', '108 km']],
  Narkanda: [['Hatu Peak', '7 km'], ['Ski Slopes', '2.5 km'], ['Tannu Jubbar Lake', '12 km'], ['Shimla Station', '62 km']],
};

const RATING_LABEL = (r) => (r >= 4.7 ? 'Exceptional' : r >= 4.4 ? 'Excellent' : r >= 4 ? 'Very good' : 'Good');

export default function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [prices, setPrices] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [amenityIcons, setAmenityIcons] = useState({});
  const [error, setError] = useState('');
  const [lightbox, setLightbox] = useState(-1);
  const [faq, setFaq] = useState(0);
  const openEnquiry = useEnquiry((s) => s.openEnquiry);

  useEffect(() => {
    let live = true;
    setHotel(null); setPrices([]); setSimilar([]);
    if (!window.location.hash) window.scrollTo(0, 0);
    api.hotel(id)
      .then(async (h) => {
        if (!live) return;
        setHotel(h);
        const [p, sameCity, any] = await Promise.all([
          api.prices(h._id).catch(() => []),
          api.hotels({ city: h.city, limit: 6 }).catch(() => ({ data: [] })),
          api.hotels({ stars: h.starCategory, limit: 8 }).catch(() => ({ data: [] })),
        ]);
        if (!live) return;
        setPrices(p || []);
        const pick = [];
        for (const x of [...(sameCity.data || []), ...(any.data || [])]) {
          if (x._id !== h._id && !pick.some((y) => y._id === x._id)) pick.push(x);
          if (pick.length === 3) break;
        }
        setSimilar(pick);
        if (window.location.hash) {
          requestAnimationFrame(() => document.querySelector(window.location.hash)?.scrollIntoView());
        }
      })
      .catch((e) => live && setError(e.message));
    return () => { live = false; };
  }, [id]);

  useEffect(() => {
    if (lightbox < 0) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(-1);
      if (e.key === 'ArrowRight') setLightbox((i) => (i + 1) % hotel.images.length);
      if (e.key === 'ArrowLeft') setLightbox((i) => (i - 1 + hotel.images.length) % hotel.images.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightbox, hotel]);

  const rooms = useMemo(() => {
    const m = new Map();
    for (const p of prices) {
      const rt = p.roomTypeId; if (!rt) continue;
      const k = String(rt._id || rt.name);
      const cur = m.get(k) || { name: rt.name, plans: new Set(), min: Infinity, currency: p.currency || 'INR', occ: 2, extraBed: false, single: 0 };
      if (p.mealPlanId?.code) cur.plans.add(p.mealPlanId.code);
      if (p.doublePrice > 0) cur.min = Math.min(cur.min, p.doublePrice);
      if (p.singlePrice > 0) cur.single = cur.single ? Math.min(cur.single, p.singlePrice) : p.singlePrice;
      cur.occ = Math.max(cur.occ, p.quadPrice > 0 ? 4 : p.triplePrice > 0 ? 3 : 2);
      if (p.adultExtraBedPrice > 0) cur.extraBed = true;
      m.set(k, cur);
    }
    return [...m.values()].map((r) => ({ ...r, plans: [...r.plans] })).sort((a, b) => a.min - b.min);
  }, [prices]);

  const mealPlans = useMemo(() => {
    const order = ['EP', 'CP', 'MAP', 'AP'];
    const s = new Set(prices.map((p) => p.mealPlanId?.code).filter(Boolean));
    return [...s].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }, [prices]);

  if (error) return <div className="container-x py-24 text-center"><p className="text-ink-500">{error}</p><Link to="/hotels" className="btn-primary mt-5">Back to hotels</Link></div>;
  if (!hotel) return <div className="container-x py-16"><div className="h-80 animate-pulse rounded-xl bg-surface" /></div>;

  const imgs = hotel.images?.length ? hotel.images : [];
  const cheapest = prices.filter((p) => p.doublePrice > 0).sort((a, b) => a.doublePrice - b.doublePrice)[0];
  const enquire = (extra = {}) => openEnquiry({ hotelId: hotel._id, hotelName: hotel.name, ...extra });
  const rating = hotel.rating || 4.3;
  const scores = [
    ['Cleanliness', Math.min(5, rating + 0.2)], ['Location', Math.min(5, rating + 0.3)],
    ['Service', Math.min(5, rating + 0.1)], ['Amenities', Math.max(3.5, rating - 0.1)],
    ['Value for money', Math.max(3.5, rating - 0.2)],
  ];
  const nearby = NEARBY[hotel.city] || [];
  const mapQ = encodeURIComponent(`${hotel.name}, ${hotel.location || ''} ${hotel.city}`);
  const waText = `Hi! I'm interested in ${hotel.name}, ${hotel.city}. Please share availability and tariffs.`;

  const NAV = [
    ['overview', 'Overview'], ['rooms', 'Rooms'], ['amenities', 'Amenities'],
    ['tariffs', 'Tariffs'], ['location', 'Location'], ['reviews', 'Reviews'], ['policies', 'Policies'],
  ];

  const FAQS = [
    [`What is the check-in and check-out time at ${hotel.name}?`, `Check-in begins at ${hotel.checkIn || '14:00'} and check-out is until ${hotel.checkOut || '11:00'}. Early check-in and late check-out can be requested when you book and are subject to availability on the day.`],
    ['Do I have to pay anything on this website?', 'No. There is no online payment and no card details are collected. You settle directly with the hotel as per the confirmed tariff.'],
    ['Which meal plans are available?', mealPlans.length ? `This property is loaded on ${mealPlans.join(', ')}. ${mealPlans.map((c) => `${c} = ${MEAL_INFO[c]?.name || c}`).join('; ')}.` : 'Meal plan options are shared on request — tell us your preference in the booking form.'],
    ['Are extra beds available for children?', rooms.some((r) => r.extraBed) ? 'Yes. Adult and child extra-bed rates are listed in the tariff table. Child-no-bed (CNB) and child-with-bed (CWB) rates apply as per the hotel policy.' : 'Extra bed availability varies by room type — mention the number of adults and children when you book and we will confirm.'],
    ['How soon will I get a reply?', 'Our team replies to every booking request within 24 hours, usually much sooner on WhatsApp during business hours.'],
    ['Is the tariff shown final?', 'Tariffs shown are the latest rates loaded for the listed validity period. Final rates are confirmed against your exact dates, occupancy and meal plan before you commit to anything.'],
  ];

  return (
    <div className="bg-surface pb-14">
      <div className="border-b border-line bg-white">
        <div className="container-x py-3">
          <Link to="/hotels" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-500 transition hover:text-brand-700"><ArrowLeft size={15} /> Back to results</Link>
        </div>
      </div>

      {/* HEADER + GALLERY */}
      <section className="border-b border-line bg-white">
        <div className="container-x py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-[24px] font-extrabold leading-tight text-ink-900 sm:text-[30px]">{hotel.name}</h1>
                <Stars count={hotel.starCategory} size={15} />
              </div>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-ink-500">
                <span className="flex items-center gap-1.5"><MapPin size={15} className="text-brand-600" /> {hotel.address || `${hotel.location}, ${hotel.city}`}</span>
                <span className="flex items-center gap-1.5 font-semibold text-emerald-700"><ShieldCheck size={15} /> Verified property</span>
                <a href={`https://www.google.com/maps/search/?api=1&query=${mapQ}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-semibold text-brand-700 hover:underline"><Navigation size={14} /> View on map</a>
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="rounded-lg bg-brand-600 px-2.5 py-1.5 text-[15px] font-bold text-white">{rating.toFixed(1)}</span>
              <div className="text-[12px] leading-tight text-ink-500"><span className="block font-bold text-ink-900">{RATING_LABEL(rating)}</span>Verified reviews</div>
            </div>
          </div>

          <div className="mt-4 grid gap-2 overflow-hidden rounded-xl md:h-[400px] md:grid-cols-4 md:grid-rows-2">
            <button onClick={() => setLightbox(0)} className="group relative md:col-span-2 md:row-span-2">
              <img src={imgs[0]} alt={hotel.name} fetchPriority="high" className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03] md:h-full" />
              <span className="absolute bottom-3 left-3 hidden items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-[12px] font-bold text-ink-900 shadow-card md:flex"><Maximize2 size={13} /> Tap to expand</span>
            </button>
            <div className="no-scrollbar flex min-w-0 gap-2 overflow-x-auto md:contents">
              {imgs.slice(1, 5).map((src, i) => (
                <button key={src + i} onClick={() => setLightbox(i + 1)} className="group relative w-40 shrink-0 md:w-auto">
                  <img src={src} alt="" loading="lazy" className="h-28 w-full object-cover transition duration-500 group-hover:scale-[1.04] md:h-full" />
                  {i === 3 && imgs.length > 5 && (
                    <span className="absolute inset-0 grid place-items-center bg-ink-900/55 text-sm font-bold text-white">+{imgs.length - 5} more</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setLightbox(0)} className="btn-ghost mt-3 !py-2 !text-[13px] md:hidden"><Images size={14} /> View all {imgs.length} photos</button>

          {/* HIGHLIGHTS */}
          <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
            <Highlight icon={BedDouble} title={`${rooms.length || hotel.roomTypes?.length || 1} room categories`} sub="Standard to suites" />
            <Highlight icon={Coffee} title={mealPlans.length ? mealPlans.join(' · ') : 'Meal plans'} sub="Meal plans available" />
            <Highlight icon={Clock} title="Replies in 24 hrs" sub="Dedicated stay expert" />
          </div>
        </div>
      </section>

      {/* SECTION NAV */}
      <nav className="sticky top-16 z-20 border-b border-line bg-white/95 backdrop-blur">
        <div className="container-x no-scrollbar flex gap-1 overflow-x-auto py-1.5">
          {NAV.map(([href, label]) => (
            <a key={href} href={`#${href}`} className="shrink-0 rounded-lg px-3 py-2 text-[13px] font-semibold text-ink-500 transition hover:bg-brand-50 hover:text-brand-700">{label}</a>
          ))}
        </div>
      </nav>

      {/* INFO */}
      <section className="container-x grid gap-5 pt-5 lg:grid-cols-[1fr_312px]">
        <div className="min-w-0 space-y-5">
          <Block id="overview" title="About this hotel">
            <p className="text-[14px] leading-relaxed text-ink-700">{hotel.description}</p>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-700">
              Set in {hotel.location}, {hotel.city}, this {hotel.starCategory}-star property is a favourite with our guests for
              {hotel.amenities?.length ? ` its ${hotel.amenities.slice(0, 3).join(', ').toLowerCase()}` : ' its warm service'} and its easy access to the city's best-known sights.
              Share your dates and we will confirm the exact room, meal plan and tariff with the hotel for you.
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <Info icon={LogIn} label="Check-in" value={`From ${hotel.checkIn || '14:00'}`} />
              <Info icon={LogOut} label="Check-out" value={`Until ${hotel.checkOut || '11:00'}`} />
              <Info icon={MapPin} label="Location" value={`${hotel.location}, ${hotel.city}`} />
              <Info icon={Phone} label="Hotel desk" value={hotel.phone || '—'} />
              <Info icon={Building2} label="Property type" value={`${hotel.starCategory}-star hotel`} />
              <Info icon={FileText} label="Tariff records" value={`${prices.length} live rates`} />
            </div>
          </Block>

          {/* ROOMS */}
          {rooms.length > 0 && (
            <Block id="rooms" title="Rooms at this hotel" sub="Indicative lead-in rates per night for two adults. Final tariff is confirmed for your dates.">
              <div className="space-y-3">
                {rooms.map((r) => (
                  <div key={r.name} className="rounded-xl border border-line p-4 transition hover:border-brand-200 hover:shadow-card">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-extrabold text-ink-900">{r.name} Room</h3>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-ink-500">
                          <span className="flex items-center gap-1.5"><Maximize2 size={13} className="text-brand-600" /> {ROOM_SIZE[r.name] || '250 sq.ft'}</span>
                          <span className="flex items-center gap-1.5"><Users size={13} className="text-brand-600" /> Up to {r.occ} guests</span>
                          {r.extraBed && <span className="flex items-center gap-1.5"><BedDouble size={13} className="text-brand-600" /> Extra bed on request</span>}
                        </p>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {(ROOM_FEATURES[r.name] || ROOM_FEATURES.Standard).map((f) => (
                            <span key={f} className="rounded-md bg-surface px-2 py-1 text-[11.5px] font-semibold text-ink-700">{f}</span>
                          ))}
                        </div>
                        {r.plans.length > 0 && (
                          <p className="mt-2.5 text-[12px] text-ink-500">Meal plans: <span className="font-semibold text-ink-700">{r.plans.join(', ')}</span></p>
                        )}
                      </div>
                      <div className="flex w-full shrink-0 items-center justify-between gap-2 border-t border-line pt-3 sm:w-auto sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                        <div className="text-left sm:text-right">
                          <p className="text-[11px] text-ink-400">From</p>
                          <p className="text-[20px] font-extrabold leading-tight text-ink-900">{Number.isFinite(r.min) ? money(r.min, r.currency) : 'On request'}</p>
                          <p className="text-[11px] text-ink-400">per night</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <a href={waHotel(hotel)} target="_blank" rel="noreferrer" aria-label={`WhatsApp about ${r.name}`} className="grid h-9 w-9 place-items-center rounded-lg bg-[#25D366] text-white"><WhatsAppIcon size={16} /></a>
                          <a href={`tel:${PHONE}`} aria-label="Call us" className="grid h-9 w-9 place-items-center rounded-lg border border-line text-brand-700"><Phone size={16} /></a>
                          <button onClick={() => enquire({ roomType: r.name, mealPlan: r.plans[0] })} className="btn-accent !px-4 !py-2 !text-[13px]">Book now</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Block>
          )}

          {hotel.amenities?.length > 0 && (
            <Block id="amenities" title="Amenities & facilities" sub="Facilities confirmed with the property at the time of listing.">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {hotel.amenities.map((a) => {
                  const Icon = iconFor(amenityIcons[a]);
                  return (
                    <div key={a} className="flex items-center gap-2.5 rounded-lg border border-line px-3 py-2.5 text-[13px] font-semibold text-ink-700">
                      <Icon size={16} className="shrink-0 text-brand-600" /> {a}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 rounded-lg bg-brand-50 px-4 py-3 text-[13px] text-ink-700">
                <span className="font-bold text-ink-900">Need something specific?</span> Airport transfer, early check-in, a connecting room or a celebration set-up — mention it when you book and we will check with the hotel.
              </div>
            </Block>
          )}
        </div>

        <aside className="lg:sticky lg:top-[120px] lg:self-start">
          <div className="card p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Starting from</p>
            <p className="text-[26px] font-extrabold leading-tight text-ink-900">
              {cheapest ? money(cheapest.doublePrice, cheapest.currency) : 'On request'}
            </p>
            {cheapest && <p className="mt-0.5 text-[12px] text-ink-500">{cheapest.roomTypeId?.name} · {cheapest.mealPlanId?.code} · double occupancy</p>}
            <CtaBar variant="stack" className="mt-4" context={{ hotelId: hotel._id, hotelName: hotel.name }} waText={waText} />
            <ul className="mt-4 space-y-2 border-t border-line pt-4 text-[13px] text-ink-700">
              {['No payment online', 'Reply within 24 hours', 'Free to cancel before we confirm'].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check size={15} className="shrink-0 text-emerald-600" /> {t}</li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t border-line pt-4 text-[13px] text-ink-700">
              <a href={`tel:${PHONE}`} className="flex items-center gap-2.5 hover:text-brand-700"><Phone size={15} className="text-brand-600" /> {PHONE_DISPLAY}</a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-2.5 hover:text-brand-700"><Mail size={15} className="text-brand-600" /> {EMAIL}</a>
            </div>
          </div>

          <div className="card mt-4 p-5">
            <h3 className="flex items-center gap-2 text-[14px] font-extrabold text-ink-900"><Sparkles size={16} className="text-accent-500" /> Why guests pick us</h3>
            <ul className="mt-3 space-y-2.5 text-[13px] text-ink-700">
              {[['Direct hotel tariffs', 'Rates negotiated with the property, not scraped.'],
                ['One person, start to finish', 'The same stay expert handles your booking.'],
                ['Zero obligation', 'Ask as many questions as you like before deciding.']].map(([t, d]) => (
                <li key={t}>
                  <p className="font-bold text-ink-900">{t}</p>
                  <p className="text-ink-500">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      {/* TARIFFS */}
      <section className="container-x mt-5">
        <Block id="tariffs" title="Room & meal-plan tariffs" sub="Rates vary by room type, meal plan, occupancy and travel dates.">
          <PricingTable prices={prices} hotel={hotel} />
          {mealPlans.length > 0 && (
            <div className="mt-5 border-t border-line pt-4">
              <h3 className="text-[14px] font-extrabold text-ink-900">What the meal-plan codes mean</h3>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {mealPlans.map((code) => {
                  const m = MEAL_INFO[code] || { name: code, desc: 'Meal plan details on request.', includes: [] };
                  return (
                    <div key={code} className="rounded-xl border border-line p-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-brand-600 px-2 py-0.5 text-[11px] font-bold text-white">{code}</span>
                        <span className="text-[13px] font-bold text-ink-900">{m.name}</span>
                      </div>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500">{m.desc}</p>
                      <ul className="mt-2 space-y-1">
                        {m.includes.map((i) => <li key={i} className="flex items-center gap-1.5 text-[12px] text-ink-700"><Check size={13} className="text-emerald-600" /> {i}</li>)}
                      </ul>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-[12px] text-ink-400">CNB = child no bed · CWB = child with bed · EB = extra bed. Taxes are as applicable at the time of stay.</p>
            </div>
          )}
        </Block>
      </section>

      {/* LOCATION */}
      <section className="container-x mt-5 grid gap-5 lg:grid-cols-2">
        <Block id="location" title="Location & getting around" sub={`${hotel.address || hotel.location}, ${hotel.city}`}>
          <div className="space-y-2">
            {nearby.map(([name, dist], i) => (
              <div key={name} className="flex items-center justify-between rounded-lg bg-surface px-3.5 py-2.5">
                <span className="flex items-center gap-2.5 text-[13px] font-semibold text-ink-700">
                  {i === nearby.length - 1 ? <Plane size={15} className="text-brand-600" /> : <MapPin size={15} className="text-brand-600" />} {name}
                </span>
                <span className="text-[12.5px] font-bold text-ink-900">{dist}</span>
              </div>
            ))}
            {!nearby.length && <p className="text-[13px] text-ink-500">Ask us about nearby attractions and transfers — we will share a full map when we confirm your booking.</p>}
          </div>
          <a href={`https://www.google.com/maps/search/?api=1&query=${mapQ}`} target="_blank" rel="noreferrer" className="btn-outline mt-4 w-full !py-2.5"><Navigation size={15} /> Open in Google Maps</a>
          <p className="mt-3 flex items-start gap-2 text-[12.5px] text-ink-500"><TrainFront size={14} className="mt-0.5 shrink-0 text-brand-600" /> Need an airport or station pickup? Add it to your booking and we will quote the transfer along with the room tariff.</p>
        </Block>

        {/* REVIEWS */}
        <Block id="reviews" title="Guest rating breakdown" sub="Based on verified stays arranged through our team.">
          <div className="flex items-center gap-4 rounded-xl bg-brand-50 p-4">
            <span className="rounded-xl bg-brand-600 px-3 py-2 text-[24px] font-extrabold leading-none text-white">{rating.toFixed(1)}</span>
            <div>
              <p className="text-[15px] font-extrabold text-ink-900">{RATING_LABEL(rating)}</p>
              <p className="flex items-center gap-1 text-[12.5px] text-ink-500"><Star size={13} className="fill-accent-500 text-accent-500" /> {hotel.starCategory}-star property · {hotel.city}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2.5">
            {scores.map(([label, v]) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-[120px] shrink-0 text-[12.5px] font-semibold text-ink-700">{label}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                  <span className="block h-full rounded-full bg-brand-600" style={{ width: `${(v / 5) * 100}%` }} />
                </span>
                <span className="w-8 shrink-0 text-right text-[12.5px] font-bold text-ink-900">{v.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </Block>
      </section>

      {/* POLICIES */}
      <section className="container-x mt-5 grid gap-5 lg:grid-cols-2">
        <Block id="policies" title="Property policies & house rules">
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Info icon={LogIn} label="Check-in" value={`From ${hotel.checkIn || '14:00'}`} />
            <Info icon={LogOut} label="Check-out" value={`Until ${hotel.checkOut || '11:00'}`} />
            <Info icon={FileText} label="ID proof" value="Govt. photo ID for all adults" />
            <Info icon={CreditCard} label="Payment" value="Directly at the hotel" />
            <Info icon={Baby} label="Children" value="Welcome · CNB/CWB rates apply" />
            <Info icon={CalendarDays} label="Early/late hours" value="On request, subject to availability" />
          </div>
          <ul className="mt-4 space-y-2 border-t border-line pt-4 text-[13px] text-ink-700">
            <li className="flex items-start gap-2"><Ban size={15} className="mt-0.5 shrink-0 text-ink-400" /> Unmarried couples and local IDs may be restricted as per the hotel's own policy — confirm with us before travelling.</li>
            <li className="flex items-start gap-2"><PawPrint size={15} className="mt-0.5 shrink-0 text-ink-400" /> Pets are not allowed unless specifically confirmed in writing by the property.</li>
            <li className="flex items-start gap-2"><Cigarette size={15} className="mt-0.5 shrink-0 text-ink-400" /> Smoking is permitted only in designated areas. Rooms are non-smoking.</li>
            <li className="flex items-start gap-2"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-600" /> Holiday Along Hotels never collects online payments or card details. Enquiries are free and carry no obligation.</li>
          </ul>
        </Block>

        {/* FAQ */}
        <Block title={`FAQs about ${hotel.name}`}>
          <div className="divide-y divide-line">
            {FAQS.map(([q, a], i) => (
              <div key={q}>
                <button onClick={() => setFaq(faq === i ? -1 : i)} className="flex w-full items-start justify-between gap-3 py-3 text-left">
                  <span className="text-[13.5px] font-semibold text-ink-900">{q}</span>
                  <ChevronDown size={17} className={`mt-0.5 shrink-0 text-ink-400 transition ${faq === i ? 'rotate-180' : ''}`} />
                </button>
                {faq === i && <p className="pb-3 text-[13px] leading-relaxed text-ink-500">{a}</p>}
              </div>
            ))}
          </div>
        </Block>
      </section>

      {/* ENQUIRE CTA */}
      <section className="container-x mt-5">
        <div className="relative overflow-hidden rounded-3xl">
          <img src={imgs[1] || imgs[0]} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-ink-900/92 via-ink-900/75 to-brand-900/55" />
          <div className="relative grid items-center gap-8 p-7 sm:p-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[12px] font-bold text-white backdrop-blur"><Sparkles size={14} /> Ready when you are</span>
              <h2 className="mt-4 text-[24px] font-extrabold leading-tight text-white sm:text-[32px]">Plan your stay at<br className="hidden sm:block" /> {hotel.name}</h2>
              <p className="mt-2.5 max-w-lg text-[14.5px] leading-relaxed text-white/70">Send us your dates and occupancy. We will come back with the exact tariff, room availability and any offer running at the property.</p>
              <CtaBar className="mt-6" context={{ hotelId: hotel._id, hotelName: hotel.name }} waText={waText} />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[[cheapest ? money(cheapest.doublePrice, cheapest.currency) : 'On request', 'Starting rate'], [`${prices.length}`, 'Live tariffs'], ['24 hrs', 'Reply time']].map(([v, l]) => (
                <div key={l} className="rounded-2xl border border-white/15 bg-white/10 px-2 py-5 backdrop-blur">
                  <p className="text-[17px] font-extrabold leading-tight text-white sm:text-[21px]">{v}</p>
                  <p className="mt-1 text-[11.5px] text-white/60">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SIMILAR */}
      {similar.length > 0 && (
        <section className="container-x mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-[18px] font-extrabold text-ink-900 sm:text-[22px]">You may also like</h2>
              <p className="text-[13px] text-ink-500">Comparable stays our guests also book.</p>
            </div>
            <Link to={`/hotels?city=${encodeURIComponent(hotel.city)}`} className="hidden shrink-0 text-[13px] font-bold text-brand-700 hover:underline sm:block">View all →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((h) => <HotelCard key={h._id} hotel={h} />)}
          </div>
        </section>
      )}

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white p-3 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-ink-400">Starting from</p>
            <p className="truncate text-[18px] font-extrabold text-ink-900">{cheapest ? money(cheapest.doublePrice, cheapest.currency) : 'On request'}</p>
          </div>
          <a href={`tel:${PHONE}`} aria-label="Call us" className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-line text-brand-700"><Phone size={18} /></a>
          <a href={waHotel(hotel)} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#25D366] text-white"><WhatsAppIcon size={20} /></a>
          <button onClick={() => enquire()} className="btn-accent !px-5 !py-3 font-bold uppercase tracking-wide">Book now</button>
        </div>
      </div>

      {lightbox >= 0 && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-ink-900/92 p-4" onMouseDown={(e) => e.target === e.currentTarget && setLightbox(-1)}>
          <button onClick={() => setLightbox(-1)} aria-label="Close" className="absolute right-4 top-4 rounded-lg p-2 text-white/80 hover:bg-white/10"><X size={24} /></button>
          <button onClick={() => setLightbox((i) => (i - 1 + imgs.length) % imgs.length)} aria-label="Previous" className="absolute left-2 rounded-full bg-white/15 p-2.5 text-white hover:bg-white/25 sm:left-6"><ChevronLeft size={22} /></button>
          <img src={imgs[lightbox]} alt="" className="max-h-[82vh] max-w-full rounded-xl object-contain" />
          <button onClick={() => setLightbox((i) => (i + 1) % imgs.length)} aria-label="Next" className="absolute right-2 rounded-full bg-white/15 p-2.5 text-white hover:bg-white/25 sm:right-6"><ChevronRight size={22} /></button>
          <p className="absolute bottom-5 text-sm text-white/70">{lightbox + 1} / {imgs.length}</p>
        </div>
      )}
      <div className="h-16 lg:hidden" />
    </div>
  );
}

const Block = ({ id, title, sub, children }) => (
  <div id={id} className="card scroll-mt-32 p-5">
    <h2 className="text-[18px] font-extrabold text-ink-900 sm:text-[20px]">{title}</h2>
    {sub && <p className="mt-0.5 text-[13px] text-ink-500">{sub}</p>}
    <div className="mt-3.5">{children}</div>
  </div>
);

const Info = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2.5 rounded-lg bg-surface px-3.5 py-2.5">
    <Icon size={16} className="mt-0.5 shrink-0 text-brand-600" />
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{label}</p>
      <p className="text-[13px] font-semibold text-ink-900">{value}</p>
    </div>
  </div>
);

const Highlight = ({ icon: Icon, title, sub }) => (
  <div className="flex items-center gap-3 bg-white px-4 py-3.5">
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"><Icon size={17} /></span>
    <div className="min-w-0">
      <p className="truncate text-[13.5px] font-extrabold text-ink-900">{title}</p>
      <p className="truncate text-[12px] text-ink-500">{sub}</p>
    </div>
  </div>
);
