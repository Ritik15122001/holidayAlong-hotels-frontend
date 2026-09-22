import { useMemo, useState } from 'react';
import { ChevronDown, CalendarRange, Info } from 'lucide-react';
import { money, fmtDate } from '../api';
import { useEnquiry } from '../store/useStore';

const COLS = [
  ['singlePrice', 'Single'], ['doublePrice', 'Double'], ['triplePrice', 'Triple'], ['quadPrice', 'Quad'],
  ['cnbPrice', 'CNB'], ['cwbPrice', 'CWB'], ['adultExtraBedPrice', 'Adult EB'], ['childExtraBedPrice', 'Child EB'],
];

const mealColor = (code) => ({
  EP: 'bg-surface text-ink-700',
  CP: 'bg-brand-50 text-brand-700',
  MAP: 'bg-emerald-50 text-emerald-700',
}[code] || 'bg-surface text-ink-700');

export default function PricingTable({ prices, hotel }) {
  const openEnquiry = useEnquiry((s) => s.openEnquiry);
  const [openRow, setOpenRow] = useState(null);
  const [period, setPeriod] = useState('all');

  const periods = useMemo(() => {
    const seen = new Map();
    prices.forEach((p) => {
      const k = `${p.startDate}|${p.endDate}`;
      if (!seen.has(k)) seen.set(k, { key: k, startDate: p.startDate, endDate: p.endDate });
    });
    return [...seen.values()].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }, [prices]);

  const rows = period === 'all' ? prices : prices.filter((p) => `${p.startDate}|${p.endDate}` === period);

  if (!prices.length) {
    return (
      <div className="card flex items-center gap-3 p-5 text-[14px] text-ink-500">
        <Info size={18} className="text-brand-600" /> Tariffs for this property are available on request — send an enquiry and we'll share the full rate sheet.
      </div>
    );
  }

  return (
    <div>
      {periods.length > 1 && (
        <div className="no-scrollbar mb-3.5 flex gap-2 overflow-x-auto pb-1">
          <Chip active={period === 'all'} onClick={() => setPeriod('all')}>All periods</Chip>
          {periods.map((p) => (
            <Chip key={p.key} active={period === p.key} onClick={() => setPeriod(p.key)}>
              <CalendarRange size={13} /> {fmtDate(p.startDate)} – {fmtDate(p.endDate)}
            </Chip>
          ))}
        </div>
      )}

      {/* Desktop table */}
      <div className="card hidden overflow-hidden md:block">
        <div className="max-h-[540px] overflow-auto">
          <table className="w-full min-w-[860px] border-collapse text-[13px]">
            <thead className="sticky top-0 z-10 bg-brand-50">
              <tr className="border-b border-brand-100">
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-brand-800">Room type</th>
                <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-brand-800">Meal</th>
                {COLS.map(([k, l]) => <th key={k} className="px-2 py-3 text-right text-[11px] font-bold uppercase tracking-[0.06em] text-brand-800">{l}</th>)}
                <th className="px-2.5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-brand-800">Validity</th>
                <th className="px-3 py-3 text-center text-[11px] font-bold uppercase tracking-[0.06em] text-brand-800">Status</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p._id} className="border-b border-line transition last:border-0 hover:bg-brand-50/40">
                  <td className="px-4 py-3"><span className="badge bg-ink-900 text-white">{p.roomTypeId?.name || '—'}</span></td>
                  <td className="px-3 py-3"><span className={`badge ${mealColor(p.mealPlanId?.code)}`}>{p.mealPlanId?.code || '—'}</span></td>
                  {COLS.map(([k]) => (
                    <td key={k} className={`whitespace-nowrap px-2 py-3 text-right tabular-nums ${
                      p[k] ? (k === 'doublePrice' ? 'text-[15px] font-extrabold text-ink-900' : 'font-semibold text-ink-700') : 'text-ink-400'}`}>
                      {money(p[k], p.currency)}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-2.5 py-3 text-[12px] text-ink-500">{fmtDate(p.startDate)} → {fmtDate(p.endDate)}</td>
                  <td className="px-3 py-3 text-center">
                    <span className={`badge ${p.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-surface text-ink-400'}`}>{p.status}</span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button onClick={() => openEnquiry({ hotelId: hotel._id, hotelName: hotel.name, roomType: p.roomTypeId?.name, mealPlan: p.mealPlanId?.code })}
                      className="whitespace-nowrap rounded-lg bg-accent-500 px-3 py-1.5 text-[12px] font-bold text-white transition hover:bg-accent-600">Enquire</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-2.5 md:hidden">
        {rows.map((p) => {
          const open = openRow === p._id;
          return (
            <div key={p._id} className="card overflow-hidden">
              <button onClick={() => setOpenRow(open ? null : p._id)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="badge bg-ink-900 text-white">{p.roomTypeId?.name}</span>
                    <span className={`badge ${mealColor(p.mealPlanId?.code)}`}>{p.mealPlanId?.code}</span>
                  </div>
                  <p className="mt-2 text-[20px] font-extrabold text-ink-900">{money(p.doublePrice, p.currency)}<span className="ml-1 text-[12px] font-medium text-ink-400">/ double</span></p>
                  <p className="mt-0.5 text-[11px] text-ink-400">{fmtDate(p.startDate)} → {fmtDate(p.endDate)}</p>
                </div>
                <ChevronDown size={18} className={`shrink-0 text-ink-400 transition ${open ? 'rotate-180' : ''}`} />
              </button>
              {open && (
                <div className="border-t border-line bg-surface px-4 py-3">
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
                    {COLS.map(([k, l]) => (
                      <div key={k} className="flex justify-between border-b border-line pb-1.5">
                        <dt className="text-ink-500">{l}</dt>
                        <dd className={`tabular-nums ${p[k] ? 'font-bold text-ink-900' : 'text-ink-400'}`}>{money(p[k], p.currency)}</dd>
                      </div>
                    ))}
                  </dl>
                  <button onClick={() => openEnquiry({ hotelId: hotel._id, hotelName: hotel.name, roomType: p.roomTypeId?.name, mealPlan: p.mealPlanId?.code })}
                    className="btn-accent mt-3 w-full !py-2.5">Enquire about this rate</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed text-ink-400">
        <Info size={14} className="mt-0.5 shrink-0 text-brand-600" />
        Rates are per room per night in {rows[0]?.currency || 'INR'}, exclusive of taxes. CNB = child no bed, CWB = child with bed, EB = extra bed. Tariffs are indicative and confirmed on enquiry.
      </p>
    </div>
  );
}

const Chip = ({ active, onClick, children }) => (
  <button onClick={onClick}
    className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-2 text-[12px] font-semibold transition ${
      active ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-line bg-white text-ink-500 hover:border-brand-300'}`}>
    {children}
  </button>
);
