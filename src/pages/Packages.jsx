import { useEffect, useMemo, useState } from 'react';
import { FileText, Download, Search, Layers } from 'lucide-react';
import { api } from '../api';

export default function Packages() {
  const [rows, setRows] = useState(null);
  const [q, setQ] = useState('');

  useEffect(() => { api.brochures().then(setRows).catch(() => setRows([])); }, []);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (rows || []).filter((b) =>
      !needle || b.title.toLowerCase().includes(needle) || (b.region || '').toLowerCase().includes(needle));
  }, [rows, q]);

  return (
    <div className="bg-surface pb-16">
      <section className="border-b border-line bg-white">
        <div className="container-x py-10 sm:py-12">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-accent-500">
            <Layers size={13} /> B2B brochures
          </p>
          <h1 className="mt-3 text-[28px] font-extrabold leading-tight text-ink-900 sm:text-[36px]">Packages</h1>
          <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-ink-500">
            Download our latest package brochures and tariff sheets. Each file opens as a PDF you can share with your clients.
          </p>
          <div className="relative mt-6 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input className="field !pl-10" placeholder="Search brochures" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
      </section>

      <section className="container-x pt-6">
        {rows === null ? (
          <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-white" />)}</div>
        ) : shown.length === 0 ? (
          <div className="card p-12 text-center">
            <FileText size={34} className="mx-auto text-ink-400" />
            <p className="mt-4 text-[16px] font-bold text-ink-900">No brochures yet</p>
            <p className="mt-1 text-[14px] text-ink-500">New package brochures will appear here as soon as they are published.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
            {shown.map((b, i) => (
              <div key={b._id}
                className={`flex flex-wrap items-center gap-4 px-5 py-4 transition hover:bg-surface ${i ? 'border-t border-line' : ''}`}>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600">
                  <FileText size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold text-ink-900">{b.title}</p>
                  {b.region && <p className="mt-0.5 text-[12.5px] text-ink-500">{b.region}</p>}
                </div>
                <a href={b.fileUrl} target="_blank" rel="noreferrer" download
                  className="btn-accent shrink-0 !px-4 !py-2.5 !text-[13px] font-bold">
                  <Download size={15} /> Download
                </a>
              </div>
            ))}
          </div>
        )}
        <p className="mt-4 text-[12.5px] text-ink-400">Brochures are updated by our team. Ask us if you need a format that isn't listed.</p>
      </section>
    </div>
  );
}
