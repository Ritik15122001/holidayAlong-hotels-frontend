import { useEffect, useMemo, useState } from 'react';
import { FileText, Copy, Check, ChevronRight } from 'lucide-react';
import { api } from '../api';

/**
 * Internal copy-and-paste library for the sales desk.
 * Square brackets mark the blanks to fill in before sending.
 */
const slug = (t) => String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function Formats() {
  const [templates, setTemplates] = useState(null);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    api.formats()
      .then((rows) => setTemplates(rows.map((r) => ({ ...r, id: slug(r.title) }))))
      .catch(() => setTemplates([]));
  }, []);

  const groups = useMemo(() => [...new Set((templates || []).map((t) => t.group || 'General'))], [templates]);

  const copy = async (t) => {
    try {
      await navigator.clipboard.writeText(t.body);
      setCopied(t.id);
      setTimeout(() => setCopied(''), 1600);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <div className="bg-surface pb-16">
      <section className="border-b border-line bg-white">
        <div className="container-x py-10 sm:py-12">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-accent-500">
            <FileText size={13} /> Team library
          </p>
          <h1 className="mt-3 text-[28px] font-extrabold leading-tight text-ink-900 sm:text-[36px]">Formats &amp; Scripts</h1>
          <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-ink-500">
            Ready-made call scripts and message formats for the desk. Copy one, fill in the blanks marked in brackets, and send.
          </p>
        </div>
      </section>

      {templates === null ? (
        <section className="container-x pt-6"><div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-white" />)}</div></section>
      ) : templates.length === 0 ? (
        <section className="container-x pt-6">
          <div className="card p-12 text-center">
            <FileText size={34} className="mx-auto text-ink-400" />
            <p className="mt-4 text-[16px] font-bold text-ink-900">No formats published yet</p>
            <p className="mt-1 text-[14px] text-ink-500">Our team adds call scripts and message formats here.</p>
          </div>
        </section>
      ) : (
      <section className="container-x grid gap-6 pt-6 lg:grid-cols-[210px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <nav className="card p-2">
            {groups.map((g) => (
              <div key={g} className="mb-2 last:mb-0">
                <p className="px-2.5 pb-1 pt-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-400">{g}</p>
                {templates.filter((t) => (t.group || 'General') === g).map((t) => (
                  <a key={t.id} href={`#${t.id}`}
                    className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-[13px] font-semibold text-ink-700 transition hover:bg-brand-50 hover:text-brand-700">
                    <span className="truncate">{t.title}</span>
                    <ChevronRight size={13} className="shrink-0 text-ink-400" />
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 space-y-4">
          {templates.map((t) => (
            <article key={t._id || t.id} id={t.id} className="card scroll-mt-24 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="rounded-md bg-brand-50 px-2 py-1 text-[10.5px] font-bold uppercase tracking-wide text-brand-700">{t.group}</span>
                  <h2 className="mt-2 text-[17px] font-extrabold text-ink-900">{t.title}</h2>
                </div>
                <button onClick={() => copy(t)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-[12.5px] font-bold transition ${
                    copied === t.id ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-line text-ink-700 hover:border-brand-300 hover:text-brand-700'}`}>
                  {copied === t.id ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>
              <pre className="mt-3.5 whitespace-pre-wrap break-words rounded-xl bg-surface p-4 font-sans text-[13.5px] leading-relaxed text-ink-700">{t.body}</pre>
            </article>
          ))}
        </div>
      </section>
      )}
    </div>
  );
}
