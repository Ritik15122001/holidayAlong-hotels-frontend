import { useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { CalendarDays } from 'lucide-react';
import 'react-day-picker/style.css';

const parse = (s) => (s ? new Date(`${s}T00:00:00`) : undefined);
const fmt = (d) => (d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '');
const label = (d) => (d ? d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '');

/** One date, on a calendar. Used where the format lists dates separately. */
export default function DatePick({ value, onChange, placeholder = 'Select date', min }) {
  const [open, setOpen] = useState(false);
  const [flip, setFlip] = useState(false);
  const [offset, setOffset] = useState(0);
  const boxRef = useRef(null);
  const popRef = useRef(null);
  const selected = parse(value);

  useEffect(() => {
    const onDown = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);

  useEffect(() => {
    if (!open || !popRef.current) return;
    setOffset(0);
    const id = requestAnimationFrame(() => {
      const r = popRef.current?.getBoundingClientRect();
      if (!r) return;
      const pad = 12;
      if (r.right > window.innerWidth - pad) setOffset(Math.round(window.innerWidth - pad - r.right));
      else if (r.left < pad) setOffset(Math.round(pad - r.left));
    });
    return () => cancelAnimationFrame(id);
  }, [open, flip]);

  const toggle = () => {
    if (!open && boxRef.current) {
      const r = boxRef.current.getBoundingClientRect();
      setFlip(window.innerHeight - r.bottom < 380 && r.top > 380);
    }
    setOpen((v) => !v);
  };

  return (
    <div ref={boxRef} className="relative">
      <button type="button" onClick={toggle} className="field flex w-full items-center gap-2 text-left">
        <CalendarDays size={15} className="shrink-0 text-brand-600" />
        <span className={`text-[14px] ${selected ? 'font-semibold text-ink-900' : 'text-ink-400'}`}>
          {selected ? label(selected) : placeholder}
        </span>
      </button>

      {open && (
        <div ref={popRef} style={{ marginLeft: offset }}
          className={`absolute left-0 z-50 max-h-[78vh] max-w-[calc(100vw-1.5rem)] overflow-auto rounded-xl border border-line bg-white p-3 shadow-panel ${flip ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(d) => { onChange(fmt(d)); setOpen(false); }}
            defaultMonth={selected || parse(min) || new Date()}
            disabled={min ? { before: parse(min) } : undefined}
            showOutsideDays
            modifiersClassNames={{ selected: 'rdp-ha-edge', today: 'rdp-ha-today' }}
          />
          {value && (
            <button type="button" onClick={() => { onChange(''); setOpen(false); }}
              className="mt-1 w-full rounded-lg border border-line py-1.5 text-[12px] font-semibold text-ink-500 hover:text-ink-900">
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
