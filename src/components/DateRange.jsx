import { useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { CalendarDays, ArrowRight } from 'lucide-react';
import 'react-day-picker/style.css';

const parse = (s) => (s ? new Date(`${s}T00:00:00`) : undefined);
const fmt = (d) => (d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '');
const label = (d) => (d ? d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—');
const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };

/**
 * Check-in / check-out picker. Renders two fields that open a shared
 * two-month calendar; the second date must fall after the first.
 */
export default function DateRange({ checkIn, checkOut, onChange, openUp = false, compact = false }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const range = { from: parse(checkIn), to: parse(checkOut) };

  useEffect(() => {
    const onDown = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);

  const pick = (next) => {
    if (!next?.from) return;
    const from = next.from;
    let to = next.to;
    if (to && to <= from) to = undefined;
    onChange({ checkIn: fmt(from), checkOut: fmt(to) });
    if (from && to) setOpen(false);
  };

  const nights = range.from && range.to ? Math.round((range.to - range.from) / 864e5) : 0;

  return (
    <div ref={boxRef} className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className={compact
          ? 'flex w-full items-center gap-2 text-left'
          : 'field flex w-full items-center gap-2 text-left'}>
        <CalendarDays size={16} className="shrink-0 text-brand-600" />
        <span className={compact ? 'text-[14px] font-semibold text-ink-900 sm:text-[15px]' : 'text-[14px] text-ink-900'}>
          {label(range.from)} <ArrowRight size={12} className="inline -mt-0.5 text-ink-400" /> {label(range.to)}
        </span>
        {nights > 0 && <span className="ml-auto shrink-0 text-[11px] font-semibold text-ink-400">{nights}N</span>}
      </button>

      {open && (
        <div className={`absolute left-0 z-50 rounded-xl border border-line bg-white p-3 shadow-panel ${openUp ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
          <DayPicker
            mode="range"
            numberOfMonths={typeof window !== 'undefined' && window.innerWidth < 640 ? 1 : 2}
            selected={range}
            onSelect={pick}
            defaultMonth={range.from || startOfToday()}
            disabled={{ before: startOfToday() }}
            showOutsideDays
            styles={{ months: { display: 'flex', gap: '1rem' } }}
            modifiersClassNames={{
              selected: 'rdp-ha-selected',
              range_start: 'rdp-ha-edge',
              range_end: 'rdp-ha-edge',
              range_middle: 'rdp-ha-middle',
              today: 'rdp-ha-today',
            }}
          />
          <div className="flex items-center justify-between gap-3 border-t border-line pt-2.5">
            <p className="text-[12px] text-ink-500">
              {nights > 0 ? `${nights} night${nights > 1 ? 's' : ''} selected` : 'Pick your check-in date'}
            </p>
            <button type="button" onClick={() => setOpen(false)} className="btn-primary !px-4 !py-1.5 !text-[12px]">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
