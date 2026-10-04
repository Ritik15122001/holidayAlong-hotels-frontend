import { useEffect, useState } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { useSearch, useMasters } from '../store/useStore';
import Autocomplete from './Autocomplete.jsx';
import { placeOptions } from '../lib/places.js';
import { HOTEL_CATEGORIES } from '../lib/categories.js';

export default function Filters() {
  const { filters, setFilter, toggleArr, clearFilters } = useSearch();
  const { roomTypes, mealPlans, load } = useMasters();
  const [places, setPlaces] = useState([]);
  useEffect(() => { load(); placeOptions().then(setPlaces); }, [load]);

  return (
    <div className="divide-y divide-line">
      <div className="flex items-center justify-between pb-3">
        <h3 className="text-[15px] font-bold text-ink-900">Filters</h3>
        <button onClick={clearFilters} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand-700 hover:underline">
          <RotateCcw size={13} /> Clear all
        </button>
      </div>

      <Group title="Search by location">
        <Autocomplete
          value={filters.q}
          onChange={(v) => setFilter({ q: v })}
          options={places}
          icon={Search}
          placeholder="City, area or hotel"
        />
      </Group>

      <Group title="Category">
        <div className="no-scrollbar max-h-56 space-y-2 overflow-y-auto pr-1">
          {HOTEL_CATEGORIES.map((c) => (
            <Check key={c} checked={filters.stars.includes(c)} onChange={() => toggleArr('stars', c)} label={c} />
          ))}
        </div>
      </Group>

      <Group title="Rooms & guests">
        <div className="space-y-2.5">
          {[['rooms', 'Rooms', 1], ['adults', 'Adults', 1], ['extraBeds', 'Extra beds', 0],
            ['cwb', 'Children with bed (CWB)', 0], ['cnb', 'Children without bed (CNB)', 0]].map(([key, label, min]) => (
            <div key={key} className="flex items-center justify-between gap-3">
              <span className="text-[13px] text-ink-700">{label}</span>
              <div className="flex shrink-0 items-center gap-2.5">
                <Step onClick={() => setFilter({ [key]: Math.max(min, filters[key] - 1) })}>−</Step>
                <span className="w-4 text-center text-[13px] font-bold text-ink-900">{filters[key]}</span>
                <Step onClick={() => setFilter({ [key]: filters[key] + 1 })}>+</Step>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2.5 text-[11.5px] text-ink-400">Prices below are the total for this party across your dates.</p>
      </Group>

      <Group title="Price per night">
        <div className="flex items-center gap-2">
          <input type="number" min="0" className="field" placeholder="Min" value={filters.minPrice} onChange={(e) => setFilter({ minPrice: e.target.value })} />
          <span className="text-ink-400">–</span>
          <input type="number" min="0" className="field" placeholder="Max" value={filters.maxPrice} onChange={(e) => setFilter({ maxPrice: e.target.value })} />
        </div>
      </Group>

      <Group title="Room type">
        <div className="space-y-2">
          {roomTypes.map((r) => (
            <Check key={r._id} checked={filters.roomType.includes(r.name)} onChange={() => toggleArr('roomType', r.name)} label={r.name} />
          ))}
        </div>
      </Group>

      <Group title="Meal plan">
        <div className="flex flex-wrap gap-2">
          {mealPlans.map((m) => (
            <Pill key={m._id} active={filters.mealPlan.includes(m.code)} onClick={() => toggleArr('mealPlan', m.code)} title={m.name}>{m.code}</Pill>
          ))}
        </div>
      </Group>

      <Group title="Guest rating" last>
        <div className="flex flex-wrap gap-2">
          {['', '3', '4', '4.5'].map((v) => (
            <Pill key={v} active={filters.rating === v} onClick={() => setFilter({ rating: v })}>{v ? `${v}+` : 'Any'}</Pill>
          ))}
        </div>
      </Group>
    </div>
  );
}

const Group = ({ title, children, last }) => (
  <div className={`py-3.5 ${last ? '!pb-0' : ''}`}>
    <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.06em] text-ink-700">{title}</p>
    {children}
  </div>
);

const Pill = ({ active, onClick, children, title }) => (
  <button title={title} onClick={onClick}
    className={`rounded-lg border px-3 py-1.5 text-[13px] font-semibold transition ${
      active ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-line text-ink-700 hover:border-brand-300'}`}>
    {children}
  </button>
);

const Check = ({ checked, onChange, label }) => (
  <label className="flex cursor-pointer items-center gap-2.5 text-[14px] text-ink-700 transition hover:text-ink-900">
    <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded border-line accent-brand-600" />
    {label}
  </label>
);

const Step = ({ children, onClick }) => (
  <button type="button" onClick={onClick} className="grid h-6 w-6 place-items-center rounded-md border border-line text-[13px] text-ink-700 transition hover:border-brand-400 hover:text-brand-700">{children}</button>
);
