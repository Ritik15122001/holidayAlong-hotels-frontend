import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Phone, Mail, Globe, MapPin, Building2, ChevronDown, Search, Star,
} from 'lucide-react';
import { api } from '../api';

const TYPES = ['Cab', 'Hotel', 'Flight', 'Bus', 'Activities', 'Cruises', 'Visa', 'Insurance'];

export default function Vendors() {
  const [vendors, setVendors] = useState(null);
  const [type, setType] = useState('');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);
  const [hotels, setHotels] = useState({});

  useEffect(() => { api.vendors().then(setVendors).catch(() => setVendors([])); }, []);

  const shown = useMemo(() => {
    const list = vendors || [];
    const needle = q.trim().toLowerCase();
    return list.filter((v) =>
      (!type || v.vendorType === type) &&
      (!needle || v.companyName.toLowerCase().includes(needle) || (v.sectors || []).join(' ').toLowerCase().includes(needle))
    );
  }, [vendors, type, q]);

  const toggle = async (v) => {
    if (open === v._id) return setOpen(null);
    setOpen(v._id);
    if (!hotels[v._id]) {
      const list = await api.vendorHotels(v._id).catch(() => []);
      setHotels((h) => ({ ...h, [v._id]: list }));
    }
  };

  return (
    <div className="bg-surface pb-16">
      <section className="border-b border-line bg-white">
        <div className="container-x py-10 sm:py-12">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-accent-500">
            <Briefcase size={13} /> Our network
          </p>
          <h1 className="mt-3 text-[28px] font-extrabold leading-tight text-ink-900 sm:text-[36px]">Vendors &amp; partners</h1>
          <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-ink-500">
            The suppliers behind every stay we arrange — hotels, transport, activities and more. Expand a vendor to see the properties we hold with them.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input className="field !pl-10" placeholder="Search company or sector" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
              {['', ...TYPES].map((t) => (
                <button key={t || 'all'} onClick={() => setType(t)}
                  className={`shrink-0 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition ${
                    type === t ? 'bg-brand-600 text-white' : 'border border-line bg-white text-ink-700 hover:border-brand-300'}`}>
                  {t || 'All'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x pt-6">
        {vendors === null ? (
          <div className="grid gap-4 lg:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-white" />)}</div>
        ) : shown.length === 0 ? (
          <div className="card p-12 text-center">
            <Briefcase size={34} className="mx-auto text-ink-400" />
            <p className="mt-4 text-[16px] font-bold text-ink-900">No vendors to show</p>
            <p className="mt-1 text-[14px] text-ink-500">Try a different type or search term.</p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {shown.map((v) => (
              <article key={v._id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-[17px] font-extrabold text-ink-900">{v.companyName}</h2>
                    {v.contactPerson && <p className="mt-0.5 text-[13px] text-ink-500">{v.contactPerson}</p>}
                  </div>
                  <span className="shrink-0 rounded-lg bg-brand-50 px-2.5 py-1 text-[11.5px] font-bold text-brand-700">{v.vendorType}</span>
                </div>

                <div className="mt-3.5 grid gap-2 text-[13px] text-ink-700 sm:grid-cols-2">
                  {(v.phones || []).slice(0, 2).map((p) => (
                    <a key={p} href={`tel:${p}`} className="flex items-center gap-2 hover:text-brand-700"><Phone size={14} className="shrink-0 text-brand-600" /> {p}</a>
                  ))}
                  {(v.emails || []).slice(0, 2).map((e) => (
                    <a key={e} href={`mailto:${e}`} className="flex items-center gap-2 truncate hover:text-brand-700"><Mail size={14} className="shrink-0 text-brand-600" /> {e}</a>
                  ))}
                  {v.website && (
                    <a href={v.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 truncate hover:text-brand-700">
                      <Globe size={14} className="shrink-0 text-brand-600" /> {v.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>

                {(v.sectors || []).length > 0 && (
                  <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                    <MapPin size={14} className="text-ink-400" />
                    {v.sectors.map((s) => <span key={s} className="rounded-md bg-surface px-2 py-1 text-[11.5px] font-semibold text-ink-700">{s}</span>)}
                  </div>
                )}

                <button onClick={() => toggle(v)}
                  className="mt-4 flex w-full items-center justify-between rounded-lg border border-line px-3.5 py-2.5 text-[13px] font-bold text-ink-900 transition hover:border-brand-300">
                  <span className="flex items-center gap-2"><Building2 size={15} className="text-brand-600" /> {v.hotelCount} hotel{v.hotelCount === 1 ? '' : 's'} listed</span>
                  <ChevronDown size={16} className={`text-ink-400 transition ${open === v._id ? 'rotate-180' : ''}`} />
                </button>

                {open === v._id && (
                  <div className="mt-3 space-y-2">
                    {!hotels[v._id] ? (
                      <p className="text-[13px] text-ink-500">Loading…</p>
                    ) : hotels[v._id].length === 0 ? (
                      <p className="rounded-lg bg-surface px-3.5 py-3 text-[13px] text-ink-500">No hotels listed under this vendor yet.</p>
                    ) : hotels[v._id].map((h) => (
                      <Link key={h._id} to={`/hotels/${h.slug || h._id}`}
                        className="flex items-center gap-3 rounded-lg border border-line p-2.5 transition hover:border-brand-200 hover:shadow-card">
                        <img src={h.images?.[0]} alt="" loading="lazy" className="h-12 w-16 shrink-0 rounded-md object-cover" />
                        <div className="min-w-0">
                          <p className="truncate text-[13.5px] font-bold text-ink-900">{h.name}</p>
                          <p className="flex items-center gap-1.5 text-[12px] text-ink-500">
                            <Star size={11} className="fill-accent-500 text-accent-500" /> {h.starCategory}★ · {h.location}, {h.city}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
