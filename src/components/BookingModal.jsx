import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CalendarCheck, Loader2, User, MapPin, BedDouble, ShieldCheck } from 'lucide-react';
import { api } from '../api';
import { useEnquiry, useMasters, useSearch, useAuth } from '../store/useStore';
import DateRange from './DateRange.jsx';

const Section = ({ icon: Icon, title, children }) => (
  <div className="col-span-2 sm:col-span-6">
    <p className="mb-2.5 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-ink-400">
      <Icon size={14} className="text-brand-600" /> {title}
    </p>
    <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 sm:grid-cols-6">{children}</div>
  </div>
);

export default function BookingModal() {
  const { context, closeEnquiry } = useEnquiry();
  const { roomTypes, mealPlans, load } = useMasters();
  const searchFilters = useSearch((s) => s.filters);
  const navigate = useNavigate();
  const user = useAuth((st) => st.user);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '', altPhone: '',
    address: '', city: '', state: '', country: 'India',
    checkIn: searchFilters.checkIn, checkOut: searchFilters.checkOut,
    rooms: searchFilters.rooms, adults: searchFilters.adults, children: searchFilters.children,
    roomType: context?.roomType || '', mealPlan: context?.mealPlan || '', message: '',
  });

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeEnquiry();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [closeEnquiry]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const nights = (() => {
    const a = new Date(form.checkIn), b = new Date(form.checkOut);
    const n = Math.round((b - a) / 864e5);
    return Number.isFinite(n) && n > 0 ? n : 0;
  })();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.checkOut && form.checkIn && new Date(form.checkOut) <= new Date(form.checkIn)) {
      return setError('Check-out must be after check-in.');
    }
    setSaving(true);
    try {
      await api.createLead({ ...form, hotelId: context?.hotelId, hotelName: context?.hotelName });
      closeEnquiry();
      navigate('/enquiry-success', { state: { name: form.name, hotelName: context?.hotelName } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/55 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && closeEnquiry()}>
      <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-white shadow-panel sm:rounded-2xl">

        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 className="text-[20px] font-extrabold text-ink-900">Book your stay</h2>
            <p className="truncate text-[13px] text-ink-500">
              {context?.hotelName
                ? <>At <span className="font-semibold text-ink-900">{context.hotelName}</span>{nights ? ` · ${nights} night${nights > 1 ? 's' : ''}` : ''}</>
                : 'Tell us your details and we will confirm availability and the final tariff.'}
            </p>
          </div>
          <button onClick={closeEnquiry} aria-label="Close" className="shrink-0 rounded-lg p-1.5 text-ink-500 transition hover:bg-surface hover:text-ink-900"><X size={20} /></button>
        </div>

        <form onSubmit={submit} className="grid grid-cols-2 gap-x-4 gap-y-6 px-5 py-5 sm:grid-cols-6 sm:px-6">

          <Section icon={User} title="Guest details">
            <div className="col-span-2 sm:col-span-3"><label className="label">Full name *</label><input required className="field" value={form.name} onChange={set('name')} placeholder="Your full name" /></div>
            <div className="col-span-2 sm:col-span-3"><label className="label">Email *</label><input required type="email" className="field" value={form.email} onChange={set('email')} placeholder="you@email.com" /></div>
            <div className="col-span-1 sm:col-span-3"><label className="label">Phone *</label><input required className="field" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" /></div>
            <div className="col-span-1 sm:col-span-3"><label className="label">Alternate phone</label><input className="field" value={form.altPhone} onChange={set('altPhone')} placeholder="Optional" /></div>
          </Section>

          <Section icon={MapPin} title="Address">
            <div className="col-span-2 sm:col-span-6"><label className="label">Street address</label><input className="field" value={form.address} onChange={set('address')} placeholder="House / street / area" /></div>
            <div className="col-span-1 sm:col-span-2"><label className="label">City</label><input className="field" value={form.city} onChange={set('city')} placeholder="City" /></div>
            <div className="col-span-1 sm:col-span-2"><label className="label">State</label><input className="field" value={form.state} onChange={set('state')} placeholder="State" /></div>
            <div className="col-span-2 sm:col-span-2"><label className="label">Country</label><input className="field" value={form.country} onChange={set('country')} placeholder="Country" /></div>
          </Section>

          <Section icon={BedDouble} title="Stay details">
            <div className="col-span-2 sm:col-span-6">
              <label className="label">Check-in — Check-out *</label>
              <DateRange
                checkIn={form.checkIn}
                checkOut={form.checkOut}
                onChange={({ checkIn, checkOut }) => setForm((f) => ({ ...f, checkIn, checkOut }))}
              />
            </div>

            <div className="col-span-2 sm:col-span-2"><label className="label">Rooms</label><input type="number" min="1" className="field" value={form.rooms} onChange={set('rooms')} /></div>
            <div className="col-span-1 sm:col-span-2"><label className="label">Adults</label><input type="number" min="1" className="field" value={form.adults} onChange={set('adults')} /></div>
            <div className="col-span-1 sm:col-span-2"><label className="label">Children</label><input type="number" min="0" className="field" value={form.children} onChange={set('children')} /></div>

            <div className="col-span-1 sm:col-span-3">
              <label className="label">Room type</label>
              <select className="field" value={form.roomType} onChange={set('roomType')}>
                <option value="">Any</option>
                {roomTypes.map((r) => <option key={r._id} value={r.name}>{r.name}</option>)}
              </select>
            </div>
            <div className="col-span-1 sm:col-span-3">
              <label className="label">Meal plan</label>
              <select className="field" value={form.mealPlan} onChange={set('mealPlan')}>
                <option value="">Any</option>
                {mealPlans.map((m) => <option key={m._id} value={m.code}>{m.code} — {m.name}</option>)}
              </select>
            </div>

            <div className="col-span-2 sm:col-span-6">
              <label className="label">Special requests</label>
              <textarea rows="3" className="field resize-none" value={form.message} onChange={set('message')} placeholder="Airport transfer, early check-in, connecting rooms, occasion…" />
            </div>
          </Section>

          {error && <p className="col-span-2 rounded-lg bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700 sm:col-span-6">{error}</p>}

          <div className="col-span-2 flex flex-col-reverse gap-2.5 border-t border-line pt-4 sm:col-span-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-1.5 text-[12px] text-ink-500">
              <ShieldCheck size={14} className="text-emerald-600" /> No payment now — we confirm availability and the final tariff first.
            </p>
            <div className="flex flex-col-reverse gap-2.5 sm:flex-row">
              <button type="button" onClick={closeEnquiry} className="btn-ghost">Cancel</button>
              <button type="submit" disabled={saving} className="btn-accent font-bold disabled:opacity-60">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <CalendarCheck size={16} />} Book now
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
