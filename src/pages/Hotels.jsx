import { useEffect, useMemo, useRef, useState } from 'react';
import { SlidersHorizontal, X, SearchX, ChevronLeft, ChevronRight } from 'lucide-react';
import HotelCard from '../components/HotelCard.jsx';
import Filters from '../components/Filters.jsx';
import { useSearch } from '../store/useStore';
import CtaBar from '../components/CtaBar.jsx';

export default function Hotels() {
  const { filters, hotels, total, page, pages, loading, error, fetchHotels, setFilter, setPage } = useSearch();
  const [drawer, setDrawer] = useState(false);
  const first = useRef(true);

  const key = useMemo(() => JSON.stringify(filters), [filters]);
  useEffect(() => {
    const delay = first.current ? 0 : 350;
    first.current = false;
    const t = setTimeout(fetchHotels, delay);
    return () => clearTimeout(t);
  }, [key, page, fetchHotels]);

  useEffect(() => { document.body.style.overflow = drawer ? 'hidden' : ''; }, [drawer]);

  return (
    <div className="bg-surface pb-14">
      <div className="border-b border-line bg-white">
        <div className="container-x py-5">
          <h1 className="text-[22px] font-extrabold text-ink-900 sm:text-[26px]">Hotels &amp; resorts</h1>
          <p className="mt-0.5 text-[14px] text-ink-500">
            {loading ? 'Searching…' : `${total} propert${total === 1 ? 'y' : 'ies'} found`}
            {filters.q ? <> for <span className="font-semibold text-ink-900">“{filters.q}”</span></> : null}
          </p>
        </div>
      </div>

      <div className="container-x grid gap-5 pt-5 lg:grid-cols-[268px_1fr]">
        <aside className="hidden lg:block">
          <div className="card sticky top-[76px] max-h-[calc(100vh-6rem)] overflow-y-auto p-4"><Filters /></div>
        </aside>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-3 py-2.5">
            <button onClick={() => setDrawer(true)} className="btn-ghost !py-2 lg:hidden">
              <SlidersHorizontal size={15} /> Filters
            </button>
            <span className="hidden text-[13px] text-ink-500 lg:block">Showing {hotels.length} of {total} properties</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden text-[13px] font-semibold text-ink-500 sm:block">Sort by</span>
              <select value={filters.sort} onChange={(e) => setFilter({ sort: e.target.value })} className="field !w-auto !py-2 text-[13px] font-semibold">
                <option value="">Recommended</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
                <option value="rating">Guest rating</option>
              </select>
            </div>
          </div>

          {error && <p className="card p-4 text-sm text-red-600">{error}</p>}

          {loading ? (
            <div className="grid gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-56 animate-pulse rounded-xl bg-white" />)}</div>
          ) : hotels.length === 0 ? (
            <div className="card flex flex-col items-center px-6 py-16 text-center">
              <SearchX size={34} className="mb-3 text-ink-400" />
              <h3 className="text-[16px] font-bold text-ink-900">No hotels match these filters</h3>
              <p className="mt-1 text-[14px] text-ink-500">Try widening your price range or clearing a few filters.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {hotels.map((h) => <HotelCard key={h._id} hotel={h} horizontal />)}
            </div>
          )}

          {!loading && hotels.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-brand-100 bg-brand-50 p-4 sm:p-5">
              <div>
                <p className="text-[15px] font-extrabold text-ink-900">Not sure which one to pick?</p>
                <p className="mt-0.5 text-[13px] text-ink-500">Tell our travel desk your dates and budget — we'll shortlist for you.</p>
              </div>
              <CtaBar waText="Hi! Please help me shortlist a hotel." labels={false} />
            </div>
          )}

          {pages > 1 && (
            <div className="mt-7 flex items-center justify-center gap-1.5">
              <PageBtn disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16} /></PageBtn>
              {Array.from({ length: pages }).map((_, i) => (
                <PageBtn key={i} active={page === i + 1} onClick={() => setPage(i + 1)}>{i + 1}</PageBtn>
              ))}
              <PageBtn disabled={page === pages} onClick={() => setPage(page + 1)}><ChevronRight size={16} /></PageBtn>
            </div>
          )}
        </section>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 flex items-end bg-ink-900/45 lg:hidden" onMouseDown={(e) => e.target === e.currentTarget && setDrawer(false)}>
          <div className="max-h-[88vh] w-full overflow-y-auto rounded-t-2xl bg-white">
            <div className="sticky top-0 flex items-center justify-between border-b border-line bg-white px-5 py-3.5">
              <h3 className="text-[16px] font-bold">Filters</h3>
              <button onClick={() => setDrawer(false)} aria-label="Close" className="rounded-lg p-1.5 text-ink-500 hover:bg-surface"><X size={20} /></button>
            </div>
            <div className="px-5 py-2"><Filters /></div>
            <div className="sticky bottom-0 border-t border-line bg-white p-4">
              <button onClick={() => setDrawer(false)} className="btn-accent w-full">Show {total} result{total === 1 ? '' : 's'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const PageBtn = ({ children, active, disabled, onClick }) => (
  <button disabled={disabled} onClick={onClick}
    className={`grid h-9 min-w-9 place-items-center rounded-lg border px-3 text-[13px] font-bold transition disabled:opacity-35 ${
      active ? 'border-brand-600 bg-brand-600 text-white' : 'border-line bg-white text-ink-700 hover:border-brand-300'}`}>
    {children}
  </button>
);
