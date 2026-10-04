import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CalendarCheck, Loader2 } from 'lucide-react';
import { api } from '../api';
import { useEnquiry, useMasters } from '../store/useStore';
import DatePick from './DatePick.jsx';

/** One labelled row of the booking format. */
const Row = ({ label, children, hint }) => (
  <div className="grid grid-cols-1 items-center gap-1.5 border-b border-line px-4 py-2.5 last:border-b-0 sm:grid-cols-[minmax(190px,0.8fr)_1.2fr] sm:gap-4">
    <label className="text-[13px] font-bold text-ink-900">{label}</label>
    <div>
      {children}
      {hint && <p className="mt-1 text-[11.5px] text-ink-400">{hint}</p>}
    </div>
  </div>
);

/** The yellow banded section headings from the format. */
const SectionRow = ({ label }) => (
  <div className="border-b border-line bg-amber-50 px-4 py-2">
    <p className="text-[12.5px] font-extrabold uppercase tracking-wide text-amber-900">{label}</p>
  </div>
);

const num = (v) => (v === '' ? '' : Math.max(0, Number(v) || 0));

export default function BookingModal() {
  const { context, closeEnquiry } = useEnquiry();
  const { roomTypes, mealPlans, load } = useMasters();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [options, setOptions] = useState([]);

  // every field starts empty — nothing is guessed for the user
  const [form, setForm] = useState({
    name: '',
    city: '',
    vendorId: '',
    hotelName: '',
    checkIn: '',
    checkOut: '',
    reCheckIn: '',
    reCheckOut: '',
    adults: '',
    rooms: '',
    extraBeds: '',
    childWithBed: '',
    childNoBedAges: '',
    roomType: '',
    mealPlan: '',
    extraInclusions: '',
    totalAmount: '',
  });

  useEffect(() => { load(); }, [load]);
  useEffect(() => { api.bookingOptions().then(setOptions).catch(() => setOptions([])); }, []);

  // opened from a hotel page or card: preselect that hotel's city, vendor and name
  useEffect(() => {
    if (!context?.hotelId || !options.length) return;
    const match = options.find((o) => o._id === String(context.hotelId));
    if (!match) return;
    setForm((f) => (f.hotelName ? f : {
      ...f, city: match.city, vendorId: match.vendorId || '', hotelName: match.name,
    }));
  }, [context?.hotelId, options]);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeEnquiry();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [closeEnquiry]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setVal = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const cities = useMemo(
    () => [...new Set(options.map((o) => o.city).filter(Boolean))].sort(),
    [options],
  );

  // vendors that actually supply the chosen city; empty means skip the step
  const cityVendors = useMemo(() => {
    const seen = new Map();
    for (const o of options) {
      if (o.city === form.city && o.vendorId) seen.set(o.vendorId, o.vendorName || 'Vendor');
    }
    return [...seen].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, [options, form.city]);

  // hotels in the chosen city, narrowed to the vendor once one is picked
  const cityHotels = useMemo(
    () => options.filter((o) => o.city === form.city && (!form.vendorId || o.vendorId === form.vendorId)),
    [options, form.city, form.vendorId],
  );

  // changing the city or vendor invalidates anything chosen below it
  const pickCity = (e) => setForm((f) => ({ ...f, city: e.target.value, vendorId: '', hotelName: '' }));
  const pickVendor = (e) => setForm((f) => ({ ...f, vendorId: e.target.value, hotelName: '' }));

  // total nights across both stays, same as the server works it out
  const nights = useMemo(() => {
    const span = (a, z) => (a && z ? Math.max(0, Math.round((new Date(z) - new Date(a)) / 864e5)) : 0);
    return span(form.checkIn, form.checkOut) + span(form.reCheckIn, form.reCheckOut);
  }, [form.checkIn, form.checkOut, form.reCheckIn, form.reCheckOut]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Guest Name is required.');
    if (!form.checkIn || !form.checkOut) return setError('First check-in and check-out dates are required.');
    if (new Date(form.checkOut) <= new Date(form.checkIn)) return setError('Check Out Date must be after Check-in Date.');
    if (form.reCheckIn && form.reCheckOut && new Date(form.reCheckOut) <= new Date(form.reCheckIn)) {
      return setError('Re-check-out must be after re-check-in.');
    }
    setSaving(true);
    try {
      const toNum = (v) => (v === '' || v === null ? 0 : Number(v) || 0);
      await api.createLead({
        ...form,
        adults: toNum(form.adults),
        rooms: toNum(form.rooms),
        extraBeds: toNum(form.extraBeds),
        childWithBed: toNum(form.childWithBed),
        childNoBed: form.childNoBedAges.trim() ? 1 : 0,
        hotelId: context?.hotelId,
        hotelName: form.hotelName || context?.hotelName,
      });
      closeEnquiry();
      navigate('/enquiry-success', { state: { name: form.name, hotelName: form.hotelName || context?.hotelName } });
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
            <h2 className="text-[20px] font-extrabold text-ink-900">Book now</h2>
            <p className="text-[13px] text-ink-500">Kindly confirm the below booking.</p>
          </div>
          <button onClick={closeEnquiry} aria-label="Close" className="shrink-0 rounded-lg p-1.5 text-ink-500 transition hover:bg-surface hover:text-ink-900"><X size={20} /></button>
        </div>

        <form onSubmit={submit}>
          <div className="m-5 overflow-hidden rounded-xl border border-line sm:m-6">
            <Row label="Guest Name">
              <input required className="field" value={form.name} onChange={set('name')} placeholder="Mrs. Rikta Zamindar" />
            </Row>
            <Row label="City">
              <select className="field" value={form.city} onChange={pickCity}>
                <option value="">Select a city</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Row>

            {cityVendors.length > 0 && (
              <Row label="Vendor" hint="Optional — narrows the hotel list to one supplier.">
                <select className="field" value={form.vendorId} onChange={pickVendor}>
                  <option value="">All vendors in {form.city}</option>
                  {cityVendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </Row>
            )}

            <Row label="Hotel Name"
              hint={form.city && cityHotels.length === 0 ? 'No hotels listed for that selection — type the name instead.' : undefined}>
              {form.city && cityHotels.length > 0 ? (
                <select className="field" value={form.hotelName} onChange={set('hotelName')}>
                  <option value="">Select a hotel</option>
                  {cityHotels.map((h) => <option key={h._id} value={h.name}>{h.name}</option>)}
                </select>
              ) : (
                <input className="field" value={form.hotelName} onChange={set('hotelName')}
                  placeholder={form.city ? 'Hotel name' : 'Select a city first, or type the hotel name'} />
              )}
            </Row>

            <SectionRow label="First Check In" />
            <Row label="Check-in Date">
              <DatePick value={form.checkIn} onChange={setVal('checkIn')} placeholder="Select check-in date" />
            </Row>
            <Row label="Check Out Date">
              <DatePick value={form.checkOut} onChange={setVal('checkOut')} placeholder="Select check-out date" min={form.checkIn} />
            </Row>

            <SectionRow label="Re-Check In (If any)" />
            <Row label="Check-in Date">
              <DatePick value={form.reCheckIn} onChange={setVal('reCheckIn')} placeholder="Optional" />
            </Row>
            <Row label="Check Out Date">
              <DatePick value={form.reCheckOut} onChange={setVal('reCheckOut')} placeholder="Optional" min={form.reCheckIn} />
            </Row>

            <Row label="Total No. of Nights">
              <input readOnly value={nights || ''} placeholder="Calculated from the dates" className="field !bg-surface font-bold" />
            </Row>
            <Row label="No. of Adults (12+ Years)">
              <input type="number" min="0" className="field" placeholder="2" value={form.adults} onChange={(e) => setForm((f) => ({ ...f, adults: num(e.target.value) }))} />
            </Row>
            <Row label="No. of Rooms">
              <input type="number" min="0" className="field" placeholder="1" value={form.rooms} onChange={(e) => setForm((f) => ({ ...f, rooms: num(e.target.value) }))} />
            </Row>
            <Row label="No. Of Extra Beds">
              <input type="number" min="0" className="field" placeholder="0" value={form.extraBeds} onChange={(e) => setForm((f) => ({ ...f, extraBeds: num(e.target.value) }))} />
            </Row>
            <Row label="No. of Child with Bed">
              <input type="number" min="0" className="field" placeholder="0" value={form.childWithBed} onChange={(e) => setForm((f) => ({ ...f, childWithBed: num(e.target.value) }))} />
            </Row>
            <Row label="No. of Child without Bed" hint="Include ages, e.g. 1 of 7 Years">
              <input className="field" value={form.childNoBedAges} onChange={set('childNoBedAges')} placeholder="1 of 7 Years" />
            </Row>
            <Row label="Room Type">
              <input className="field" list="ha-room-types" value={form.roomType} onChange={set('roomType')} placeholder="DELUXE ROOM" />
              <datalist id="ha-room-types">
                {roomTypes.map((r) => <option key={r._id} value={r.name} />)}
              </datalist>
            </Row>
            <Row label="Meal Plan">
              <input className="field" list="ha-meal-plans" value={form.mealPlan} onChange={set('mealPlan')} placeholder="MAP (Breakfast + Dinner)" />
              <datalist id="ha-meal-plans">
                {mealPlans.map((m) => <option key={m._id} value={`${m.code} (${m.name})`} />)}
              </datalist>
            </Row>
            <Row label="Extra Inclusions">
              <input className="field" value={form.extraInclusions} onChange={set('extraInclusions')} placeholder="-" />
            </Row>
            <Row label="Total Amount Payable To You">
              <textarea rows="2" className="field resize-none" value={form.totalAmount} onChange={set('totalAmount')}
                placeholder="INR 2300 X 2 Nights + INR 600 Child without Bed X 2 Nights = INR 5800" />
            </Row>
          </div>

          {error && <p className="mx-5 mb-3 rounded-lg bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700 sm:mx-6">{error}</p>}

          <div className="flex flex-col-reverse gap-2.5 border-t border-line px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button type="button" onClick={closeEnquiry} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn-accent font-bold disabled:opacity-60">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <CalendarCheck size={16} />} Book now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
