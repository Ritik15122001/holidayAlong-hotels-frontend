import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, Loader2 } from 'lucide-react';
import { api } from '../api';
import { useEnquiry, useMasters, useSearch, useAuth } from '../store/useStore';

export default function EnquiryModal() {
  const { context, closeEnquiry } = useEnquiry();
  const { roomTypes, mealPlans, load } = useMasters();
  const searchFilters = useSearch((s) => s.filters);
  const navigate = useNavigate();
  const user = useAuth((st) => st.user);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 p-0 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && closeEnquiry()}>
      <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-panel sm:rounded-xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-white px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-[19px] font-extrabold text-ink-900">Send an enquiry</h2>
            <p className="text-[13px] text-ink-500">
              {context?.hotelName ? <>For <span className="font-semibold text-ink-900">{context.hotelName}</span></> : 'Our travel desk will get back within 24 hours.'}
            </p>
          </div>
          <button onClick={closeEnquiry} aria-label="Close" className="rounded-lg p-1.5 text-ink-500 hover:bg-surface hover:text-ink-900"><X size={20} /></button>
        </div>

        <form onSubmit={submit} className="grid grid-cols-2 gap-x-4 gap-y-3.5 px-5 py-5 sm:grid-cols-6 sm:px-6">
          <div className="col-span-2 sm:col-span-2"><label className="label">Full name *</label><input required className="field" value={form.name} onChange={set('name')} placeholder="Your name" /></div>
          <div className="col-span-2 sm:col-span-2"><label className="label">Email *</label><input required type="email" className="field" value={form.email} onChange={set('email')} placeholder="you@email.com" /></div>
          <div className="col-span-2 sm:col-span-2"><label className="label">Phone *</label><input required className="field" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" /></div>

          <div className="col-span-1 sm:col-span-3"><label className="label">Check-in *</label><input required type="date" className="field" value={form.checkIn} onChange={set('checkIn')} /></div>
          <div className="col-span-1 sm:col-span-3"><label className="label">Check-out *</label><input required type="date" className="field" value={form.checkOut} onChange={set('checkOut')} /></div>

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
            <label className="label">Message</label>
            <textarea rows="3" className="field resize-none" value={form.message} onChange={set('message')} placeholder="Tell us about your preferences, occasion or budget…" />
          </div>

          {error && <p className="col-span-2 rounded-lg bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700 sm:col-span-6">{error}</p>}

          <div className="col-span-2 flex flex-col-reverse gap-2.5 pt-1 sm:col-span-6 sm:flex-row sm:justify-end">
            <button type="button" onClick={closeEnquiry} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn-accent">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Send enquiry
            </button>
          </div>
          <p className="col-span-2 text-center text-[11px] text-ink-400 sm:col-span-6">No payment is taken online. This is an enquiry only.</p>
        </form>
      </div>
    </div>
  );
}
