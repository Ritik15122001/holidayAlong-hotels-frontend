import { Link } from 'react-router-dom';
import { MapPin, Utensils, BedDouble, ShieldCheck } from 'lucide-react';
import Stars from './Stars.jsx';
import { money } from '../api';
import { useEnquiry } from '../store/useStore';

const ratingWord = (r) => (r >= 4.7 ? 'Exceptional' : r >= 4.4 ? 'Excellent' : r >= 4 ? 'Very good' : 'Good');
const MEAL_LABEL = { EP: 'Room only', CP: 'With breakfast', MAP: 'Breakfast + 1 meal' };

export default function HotelCard({ hotel, horizontal = false }) {
  const openEnquiry = useEnquiry((s) => s.openEnquiry);
  const enquire = () => openEnquiry({ hotelId: hotel._id, hotelName: hotel.name, roomType: hotel.topRoomType, mealPlan: hotel.topMealPlan });

  return (
    <article className={`group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition hover:border-brand-200 hover:shadow-lift ${horizontal ? 'sm:flex-row sm:min-h-[230px]' : ''}`}>
      <Link to={`/hotels/${hotel._id}`} className={`relative block shrink-0 overflow-hidden ${horizontal ? 'sm:w-[34%] sm:self-stretch' : ''}`}>
        <img src={hotel.images?.[0]} alt={hotel.name} loading="lazy" decoding="async"
          className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${horizontal ? 'h-48 sm:absolute sm:inset-0 sm:h-full' : 'h-48'}`} />
        {hotel.rating >= 4.5 && (
          <span className="absolute left-3 top-3 rounded-md bg-accent-500 px-2 py-1 text-[11px] font-bold text-white">Guest favourite</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/hotels/${hotel._id}`} className="min-w-0">
            <h3 className={`font-bold leading-snug text-ink-900 transition group-hover:text-brand-700 ${horizontal ? 'text-[18px]' : 'line-clamp-2 text-[15px]'}`}>{hotel.name}</h3>
          </Link>
          <span className="shrink-0 rounded-md bg-brand-600 px-2 py-1 text-[13px] font-bold text-white">{hotel.rating?.toFixed(1)}</span>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <Stars count={hotel.starCategory} size={12} />
          <span className="flex min-w-0 items-center gap-1 text-[12.5px] text-ink-500">
            <MapPin size={12} className="shrink-0 text-brand-600" /><span className="truncate">{hotel.location}, {hotel.city}</span>
          </span>
        </div>
        <p className="mt-1 text-[11.5px] font-semibold text-emerald-700">{ratingWord(hotel.rating)} · Verified property</p>

        {horizontal && <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-ink-500">{hotel.description}</p>}

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {hotel.topRoomType && <span className="badge bg-surface text-ink-700"><BedDouble size={12} className="text-brand-600" /> {hotel.topRoomType}</span>}
          {hotel.topMealPlan && (
            <span className="badge bg-emerald-50 text-emerald-700">
              <Utensils size={12} /> {hotel.topMealPlan}{horizontal && MEAL_LABEL[hotel.topMealPlan] ? ` · ${MEAL_LABEL[hotel.topMealPlan]}` : ''}
            </span>
          )}
          {horizontal && <span className="badge bg-surface text-ink-700"><ShieldCheck size={12} className="text-emerald-600" /> No online payment</span>}
        </div>

        <div className={`mt-auto flex flex-wrap items-end justify-between gap-2.5 border-t border-line pt-3 ${horizontal ? '' : 'pt-3'}`}>
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-400">Starting from</p>
            <p className="text-[20px] font-extrabold leading-tight text-ink-900">
              {hotel.startingPrice ? money(hotel.startingPrice, hotel.currency) : 'On request'}
            </p>
            <p className="text-[11px] text-ink-400">per night · double · excl. taxes</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Link to={`/hotels/${hotel._id}`} className="btn-outline !px-3 !py-2.5 !text-[13px]">Details</Link>
            <button onClick={enquire} className="btn-accent !px-3 !py-2.5 !text-[13px]">Book now</button>
          </div>
        </div>
      </div>
    </article>
  );
}
