import { useMemo, useState } from 'react';
import { ChevronDown, CalendarRange, Info, ArrowUpDown, X, Copy, Check } from 'lucide-react';
import { money, fmtDate } from '../api';
import { useEnquiry } from '../store/useStore';

const COLS = [
  ['singlePrice', 'Single'], ['doublePrice', 'Double'], ['triplePrice', 'Triple'], ['quadPrice', 'Quad'],
  ['cnbPrice', 'CNB'], ['cwbPrice', 'CWB'], ['adultExtraBedPrice', 'Adult EB'],
];

const SORTS = [
  ['default', 'Room type'],
  ['price_asc', 'Price: low to high'],
  ['price_desc', 'Price: high to low'],
  ['meal', 'Meal plan'],
  ['validity', 'Validity date'],
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
  const [roomType, setRoomType] = useState('');
  const [mealPlan, setMealPlan] = useState('');
  const [sort, setSort] = useState('default');
  const [copied, setCopied] = useState('');

  /** One rate as plain text, ready to paste into WhatsApp or an email. */
  const lineFor = (p) => {
    const part = (label, k) => (p[k] > 0 ? `${label} ${money(p[k], p.currency)}` : null);
    const occ = [part('Single', 'singlePrice'), part('Double', 'doublePrice'),
                 part('Triple', 'triplePrice'), part('Quad', 'quadPrice')].filter(Boolean);
    const extra = [part('CNB', 'cnbPrice'), part('CWB', 'cwbPrice'),
                   part('Adult extra bed', 'adultExtraBedPrice')].filter(Boolean);
    return [
      `${hotel?.name || 'Hotel'} — ${p.roomTypeId?.name || ''} (${p.mealPlanId?.code || ''})`,
      occ.join(' | '),
      extra.length ? extra.join(' | ') : null,
      `Valid ${fmtDate(p.startDate)} to ${fmtDate(p.endDate)}`,
      'Rates are per room per night, exclusive of taxes.',
    ].filter(Boolean).join('\n');
  };

  const copyLine = async (p) => {
    try {
      await navigator.clipboard.writeText(lineFor(p));
      setCopied(p._id);
      setTimeout(() => setCopied(''), 1600);
    } catch { /* clipboard blocked */ }
  };

  const periods = useMemo(() => {
    const seen = new Map();
    prices.forEach((p) => {
      const k = `${p.startDate}|${p.endDate}`;
      if (!seen.has(k)) seen.set(k, { key: k, startDate: p.startDate, endDate: p.endDate });
    });
    return [...seen.values()].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }, [prices]);

  const roomTypes = useMemo(
    () => [...new Set(prices.map((p) => p.roomTypeId?.name).filter(Boolean))].sort(),
    [prices]);
  const mealPlans = useMemo(
    () => [...new Set(prices.map((p) => p.mealPlanId?.code).filter(Boolean))].sort(),
    [prices]);

  const rows = useMemo(() => {
    const list = prices.filter((p) =>
      (period === 'all' || `${p.startDate}|${p.endDate}` === period) &&
      (!roomType || p.roomTypeId?.name === roomType) &&
      (!mealPlan || p.mealPlanId?.code === mealPlan));

    const order = [...list];
    if (sort === 'price_asc') order.sort((a, b) => (a.doublePrice || 0) - (b.doublePrice || 0));
    else if (sort === 'price_desc') order.sort((a, b) => (b.doublePrice || 0) - (a.doublePrice || 0));
    else if (sort === 'meal') order.sort((a, b) => String(a.mealPlanId?.code).localeCompare(String(b.mealPlanId?.code)));
    else if (sort === 'validity') order.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    else order.sort((a, b) =>
      String(a.roomTypeId?.name).localeCompare(String(b.roomTypeId?.name)) ||
      (a.doublePrice || 0) - (b.doublePrice || 0));
    return order;
  }, [prices, period, roomType, mealPlan, sort]);

  const filtered = Boolean(roomType || mealPlan || period !== 'all' || sort !== 'default');
  const clearAll = () => { setRoomType(''); setMealPlan(''); setPeriod('all'); setSort('default'); };

  if (!prices.length) {
    return (
      <div className="card flex items-center gap-3 p-5 text-[14px] text-ink-500">
        <Info size={18} className="text-brand-600" /> Tariffs for this property are available on request — book now and we'll share the full rate sheet.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {roomTypes.length > 1 && (
          <select value={roomType} onChange={(e) => setRoomType(e.target.value)}
            className="rounded-lg border border-line bg-white px-3 py-2 text-[12.5px] font-semibold text-ink-700 outline-none transition hover:border-brand-300">
            <option value="">All room types</option>
            {roomTypes.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        )}
        {mealPlans.length > 1 && (
          <select value={mealPlan} onChange={(e) => setMealPlan(e.target.value)}
            className="rounded-lg border border-line bg-white px-3 py-2 text-[12.5px] font-semibold text-ink-700 outline-none transition hover:border-brand-300">
            <option value="">All meal plans</option>
            {mealPlans.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        )}
        <label className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-[12.5px] font-semibold text-ink-700">
          <ArrowUpDown size={13} className="text-brand-600" />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent outline-none">
            {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <span className="text-[12.5px] text-ink-500">{rows.length} of {prices.length} rate{prices.length === 1 ? '' : 's'}</span>
        {filtered && (
          <button onClick={clearAll} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-[12.5px] font-bold text-brand-700 hover:underline">
            <X size={13} /> Clear
          </button>
        )}
      </div>

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

      {rows.length === 0 ? (
        <div className="card flex flex-wrap items-center gap-3 p-5 text-[14px] text-ink-500">
          <Info size={18} className="text-brand-600" /> No rates match these filters.
          <button onClick={clearAll} className="font-bold text-brand-700 hover:underline">Clear filters</button>
        </div>
      ) : (<>
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
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => copyLine(p)} title="Copy this rate as text"
                        className={`grid h-[30px] w-[30px] place-items-center rounded-lg border transition ${
                          copied === p._id ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-line text-ink-500 hover:border-brand-300 hover:text-brand-700'}`}>
                        {copied === p._id ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                      <button onClick={() => openEnquiry({ hotelId: hotel._id, hotelName: hotel.name, roomType: p.roomTypeId?.name, mealPlan: p.mealPlanId?.code })}
                        className="whitespace-nowrap rounded-lg bg-accent-500 px-3 py-1.5 text-[12px] font-bold text-white transition hover:bg-accent-600">Book now</button>
                    </div>
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
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => copyLine(p)}
                      className={`btn-outline !py-2.5 ${copied === p._id ? '!border-emerald-200 !text-emerald-700' : ''}`}>
                      {copied === p._id ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy</>}
                    </button>
                    <button onClick={() => openEnquiry({ hotelId: hotel._id, hotelName: hotel.name, roomType: p.roomTypeId?.name, mealPlan: p.mealPlanId?.code })}
                      className="btn-accent flex-1 !py-2.5">Book this rate</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      </>)}

      <p className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed text-ink-400">
        <Info size={14} className="mt-0.5 shrink-0 text-brand-600" />
        Rates are per room per night in {rows[0]?.currency || 'INR'}, exclusive of taxes. CNB = child no bed, CWB = child with bed, EB = extra bed. Tariffs are indicative and confirmed on booking.
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
