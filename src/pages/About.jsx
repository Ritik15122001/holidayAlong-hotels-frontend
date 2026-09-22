import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Send, CheckCircle2, Sparkles, Star, BadgeIndianRupee, Headset } from 'lucide-react';
import { WhatsAppIcon } from '../components/Icons.jsx';
import { api } from '../api';
import CtaBar from '../components/CtaBar.jsx';
import { PHONE, PHONE_DISPLAY, EMAIL, waLink } from '../components/Contact.js';

const IMG = (id, w = 900) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const PILLARS = [
  { icon: ShieldCheck, title: 'Verified properties', text: 'Every hotel is inspected and contracted directly — no third-party resellers.', image: IMG(1134176, 700) },
  { icon: Clock, title: '24-hour response', text: 'Enquiries are answered by a real person within one business day.', image: IMG(2869215, 700) },
  { icon: MapPin, title: 'Across India', text: 'Goa, Jaipur, Udaipur, Agra, Delhi, Mumbai, Munnar and the Himalayas — more added each season.', image: IMG(6129967, 700) },
];

export default function About() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      await api.createLead({ ...form, message: form.message || 'General enquiry from Contact page' });
      setSent(true);
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  return (
    <>
      <section className="relative overflow-hidden bg-ink-900">
        <img src={IMG(4502973, 1600)} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900/92 via-ink-900/70 to-ink-900/40" />
        <div className="container-x relative py-16 sm:py-24">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[12px] font-bold text-white backdrop-blur"><Sparkles size={14} className="text-accent-500" /> About Holiday Along Hotels</span>
          <h1 className="mt-5 max-w-2xl text-[30px] font-extrabold leading-tight text-white sm:text-[44px]">
            A travel desk,<br /> not a booking engine.
          </h1>
          <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-white/70">
            We curate a small collection of hotels and resorts, negotiate transparent room and meal-plan tariffs, and handle every stay personally. You browse, you enquire, we take it from there.
          </p>
          <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3 text-center">
            {[['10+', 'Curated hotels'], ['8', 'Destinations'], ['4.6★', 'Guest rating']].map(([v, l]) => (
              <div key={l} className="rounded-2xl border border-white/15 bg-white/10 px-2 py-4 backdrop-blur">
                <p className="text-[20px] font-extrabold text-white sm:text-[24px]">{v}</p>
                <p className="mt-1 text-[11.5px] text-white/60">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-12 sm:py-14">
        <div className="grid gap-4 sm:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, text, image }) => (
            <article key={title} className="group overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:shadow-lift">
              <div className="relative h-40 overflow-hidden">
                <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/10 to-transparent" />
                <span className="absolute bottom-4 left-4 flex items-center gap-2.5 text-[15px] font-extrabold text-white">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur"><Icon size={17} /></span> {title}
                </span>
              </div>
              <p className="p-5 text-[13.5px] leading-relaxed text-ink-500">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="border-y border-line bg-surface py-12 sm:py-14">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid grid-cols-2 gap-3">
            <img src={IMG(1268871, 600)} alt="Poolside cabana" loading="lazy" className="h-48 w-full rounded-2xl object-cover sm:h-60" />
            <img src={IMG(7534561, 600)} alt="Suite living room" loading="lazy" className="mt-6 h-48 w-full rounded-2xl object-cover sm:h-60" />
            <img src={IMG(67468, 600)} alt="Hotel dining" loading="lazy" className="h-40 w-full rounded-2xl object-cover sm:h-48" />
            <img src={IMG(3889843, 600)} alt="Resort pool" loading="lazy" className="-mt-6 h-40 w-full rounded-2xl object-cover sm:h-48" />
          </div>
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-accent-500"><Star size={13} className="fill-accent-500" /> Our story</p>
            <h2 className="mt-3 text-[24px] font-extrabold leading-tight text-ink-900 sm:text-[30px]">Built for travellers who want a straight answer</h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-500">
              We started Holiday Along Hotels because comparing Indian hotels online had become exhausting — inflated strike-through prices, meal plans hidden behind jargon and no one to actually call.
            </p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-500">
              So we did it the other way round. We contract a small set of properties we would stay in ourselves, publish the real room and meal-plan tariffs on the page, and put a person at the end of every enquiry.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[[BadgeIndianRupee, 'Transparent tariffs', 'Room, meal plan and extra-bed rates published upfront.'],
                [Headset, 'One point of contact', 'The same stay expert from enquiry to check-in.']].map(([Icon, t, d]) => (
                <div key={t} className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><Icon size={18} /></span>
                  <div>
                    <p className="text-[14px] font-bold text-ink-900">{t}</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-ink-500">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x grid gap-6 py-12 sm:py-14 lg:grid-cols-2">
        <div>
          <h2 className="text-[22px] font-extrabold text-ink-900 sm:text-[26px]">Get in touch</h2>
          <p className="mt-1.5 text-[14px] leading-relaxed text-ink-500">Planning a holiday, a family celebration or a group offsite? Tell us what you have in mind.</p>
          <CtaBar className="mt-5" waText="Hi! I'd like to plan a stay in India." />
          <div className="mt-5 space-y-2.5">
            {[
              [Phone, 'Phone', PHONE_DISPLAY, `tel:${PHONE}`],
              [WhatsAppIcon, 'WhatsApp', 'Chat with our travel desk', waLink()],
              [Mail, 'Email', EMAIL, `mailto:${EMAIL}`],
              [MapPin, 'Office', '12 Harbour Lane, Fort, Mumbai 400001', null],
              [Clock, 'Hours', 'Mon – Sat, 9:30 am – 7:00 pm IST', null],
            ].map(([Icon, label, value, href]) => (
              <div key={label} className="flex items-start gap-3 rounded-xl border border-line bg-white px-4 py-3.5">
                <Icon size={17} className="mt-0.5 shrink-0 text-brand-600" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{label}</p>
                  {href ? <a href={href} className="text-[14px] font-semibold text-ink-900 hover:text-brand-700">{value}</a> : <p className="text-[14px] font-semibold text-ink-900">{value}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5 sm:p-6">
          {sent ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
              <CheckCircle2 size={40} className="mb-4 text-emerald-600" />
              <h3 className="text-[19px] font-extrabold text-ink-900">Thank you.</h3>
              <p className="mt-2 text-[14px] text-ink-500">Our team will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3.5">
              <h3 className="text-[17px] font-bold text-ink-900">Send us a message</h3>
              <div><label className="label">Name *</label><input required className="field" value={form.name} onChange={set('name')} /></div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <div><label className="label">Email *</label><input required type="email" className="field" value={form.email} onChange={set('email')} /></div>
                <div><label className="label">Phone *</label><input required className="field" value={form.phone} onChange={set('phone')} /></div>
              </div>
              <div><label className="label">Message</label><textarea rows="5" className="field resize-none" value={form.message} onChange={set('message')} placeholder="Destination, dates, number of guests…" /></div>
              {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">{error}</p>}
              <button disabled={saving} className="btn-accent w-full"><Send size={15} /> {saving ? 'Sending…' : 'Send message'}</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
