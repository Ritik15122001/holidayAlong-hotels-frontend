import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, CalendarDays, Users, ChevronDown } from 'lucide-react';
import { useSearch } from '../store/useStore';
import { api } from '../api';
import Autocomplete from './Autocomplete.jsx';
import { placeOptions } from '../lib/places.js';

export default function SearchPanel() {
  const { filters, setFilter } = useSearch();
  const navigate = useNavigate();
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [cities, setCities] = useState([]);
  useEffect(() => { placeOptions().then(setCities); }, []);

  const submit = (e) => { e.preventDefault(); navigate('/hotels'); };

  const guestLabel = `${filters.rooms} Room${filters.rooms > 1 ? 's' : ''}, ${filters.adults} Adult${filters.adults > 1 ? 's' : ''}${filters.children ? `, ${filters.children} Child` : ''}`;

  return (
    <div className="rounded-2xl border border-white/60 bg-white p-2.5 shadow-panel sm:p-3">
      <form onSubmit={submit} className="grid grid-cols-2 gap-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr_auto]">
        <Field icon={MapPin} label="Destination" className="col-span-2 lg:col-span-1">
          <Autocomplete
            value={filters.q}
            onChange={(v) => setFilter({ q: v })}
            options={cities}
            placeholder="City, area or hotel"
            openUp
            inputClassName="w-full bg-transparent text-[15px] font-semibold text-ink-900 outline-none placeholder:font-normal placeholder:text-ink-400"
          />
        </Field>

        <Field icon={CalendarDays} label="Check-in">
          <input type="date" className="w-full bg-transparent text-[14px] font-semibold text-ink-900 outline-none sm:text-[15px]"
            value={filters.checkIn} onChange={(e) => setFilter({ checkIn: e.target.value })} />
        </Field>

        <Field icon={CalendarDays} label="Check-out">
          <input type="date" className="w-full bg-transparent text-[14px] font-semibold text-ink-900 outline-none sm:text-[15px]"
            min={filters.checkIn} value={filters.checkOut} onChange={(e) => setFilter({ checkOut: e.target.value })} />
        </Field>

        <div className="relative">
          <Field icon={Users} label="Rooms & guests">
            <button type="button" onClick={() => setGuestsOpen((o) => !o)} className="flex w-full items-center justify-between gap-1 text-left text-[14px] font-semibold text-ink-900 sm:text-[15px]">
              <span className="truncate">{guestLabel}</span>
              <ChevronDown size={15} className={`shrink-0 text-ink-400 transition ${guestsOpen ? 'rotate-180' : ''}`} />
            </button>
          </Field>
          {guestsOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setGuestsOpen(false)} />
              <div className="absolute bottom-full left-0 right-0 z-40 mb-1.5 space-y-3 rounded-xl border border-line bg-white p-4 shadow-panel sm:min-w-[250px]">
                {[['rooms', 'Rooms', 1], ['adults', 'Adults', 1], ['children', 'Children', 0]].map(([key, label, min]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink-700">{label}</span>
                    <div className="flex items-center gap-3">
                      <Stepper onClick={() => setFilter({ [key]: Math.max(min, filters[key] - 1) })}>−</Stepper>
                      <span className="w-5 text-center text-sm font-bold">{filters[key]}</span>
                      <Stepper onClick={() => setFilter({ [key]: filters[key] + 1 })}>+</Stepper>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => setGuestsOpen(false)} className="btn-primary w-full !py-2">Done</button>
              </div>
            </>
          )}
        </div>

        <button type="submit"
          className="btn-accent col-span-2 !rounded-xl px-7 py-3.5 text-[15px] font-bold uppercase tracking-wide lg:col-span-1 lg:py-0">
          <Search size={18} /> Search
        </button>
      </form>
    </div>
  );
}

const Stepper = ({ children, onClick }) => (
  <button type="button" onClick={onClick} className="grid h-7 w-7 place-items-center rounded-md border border-line text-ink-700 transition hover:border-brand-400 hover:text-brand-700">{children}</button>
);

const Field = ({ icon: Icon, label, children, className = '' }) => (
  <div className={`flex min-w-0 items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-2.5 transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/12 hover:border-brand-200 ${className}`}>
    <Icon size={17} className="shrink-0 text-brand-600" />
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-400 sm:text-[11px]">{label}</p>
      {children}
    </div>
  </div>
);
