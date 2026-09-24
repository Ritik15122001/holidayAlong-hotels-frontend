import { useEffect, useState } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { useSearch, useMasters } from '../store/useStore';
import Autocomplete from './Autocomplete.jsx';
import { placeOptions } from '../lib/places.js';

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

      <Group title="Star category">
        <div className="space-y-2">
          {[5, 4, 3, 2].map((s) => (
            <Check key={s} checked={filters.stars.includes(s)} onChange={() => toggleArr('stars', s)} label={`${s} Star`} />
          ))}
        </div>
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
