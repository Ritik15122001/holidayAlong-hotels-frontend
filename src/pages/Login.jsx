import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Check, ArrowRight, Phone, ShieldCheck } from 'lucide-react';
import { WhatsAppIcon } from '../components/Icons.jsx';
import { Wordmark } from '../components/Logo.jsx';
import { PHONE, PHONE_DISPLAY, EMAIL, waLink } from '../components/Contact.js';
import { useAuth } from '../store/useStore';

const IMG = (id, w = 1400) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const PERKS = [
  'Handpicked luxury hotels across India',
  'Full room and meal-plan tariffs, no mark-ups',
  'One enquiry, a tailored proposal in 24 hours',
];

export default function Login() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const next = state?.next || '/';

  const user = useAuth((s) => s.user);
  const login = useAuth((s) => s.login);

  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (user) return <Navigate to={next} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      await login(form);
      navigate(next, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      {/* form */}
      <div className="flex flex-col justify-center px-5 py-10 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-[400px]">
          <Wordmark size="lg" />

          <h1 className="mt-9 text-[28px] font-extrabold leading-tight text-ink-900 sm:text-[34px]">Sign in</h1>
          <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-500">
            Welcome back. Sign in to browse our hotels, see live tariffs and send an enquiry.
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input required autoFocus type="email" autoComplete="email" className="field !pl-10 !py-3"
                  placeholder="you@email.com" value={form.email} onChange={set('email')} />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input required type={show ? 'text' : 'password'} autoComplete="current-password"
                  className="field !pl-10 !pr-10 !py-3" placeholder="Your password"
                  value={form.password} onChange={set('password')} />
                <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition hover:text-ink-700">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700">{error}</p>}

            <button disabled={busy} className="btn-accent w-full !py-3.5 font-bold disabled:opacity-60">
              {busy ? 'Signing in…' : 'Sign in'} <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-8 rounded-xl border border-line bg-surface p-4">
            <p className="flex items-center gap-2 text-[13px] font-bold text-ink-900">
              <ShieldCheck size={15} className="text-brand-600" /> Need an account?
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">
              Access is set up by our team. Get in touch and we will create your login.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={`tel:${PHONE}`} className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-[12.5px] font-bold text-ink-900 transition hover:border-brand-300 hover:text-brand-700">
                <Phone size={14} className="text-brand-600" /> {PHONE_DISPLAY}
              </a>
              <a href={waLink('Hi! I would like an account for the Holiday Along Hotels website.')} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-2 text-[12.5px] font-bold text-white transition hover:bg-[#1db954]">
                <WhatsAppIcon size={14} /> WhatsApp
              </a>
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-[12.5px] font-bold text-ink-900 transition hover:border-brand-300 hover:text-brand-700">
                <Mail size={14} className="text-brand-600" /> Email us
              </a>
            </div>
          </div>

          <p className="mt-6 text-[12px] leading-relaxed text-ink-400">
            We never take online payments. Your account is only used to show tariffs and handle your enquiries.
          </p>
        </div>
      </div>

      {/* visual */}
      <div className="relative hidden lg:block">
        <img src={IMG(4502973)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900/92 via-ink-900/68 to-brand-900/50" />
        <div className="relative flex h-full flex-col justify-end p-12 xl:p-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent-500">Members only</p>
          <h2 className="mt-4 max-w-lg text-[32px] font-extrabold leading-tight text-white xl:text-[40px]">
            Real tariffs.<br />Real people. No payment.
          </h2>
          <ul className="mt-8 space-y-3.5">
            {PERKS.map((t) => (
              <li key={t} className="flex items-center gap-3 text-[15px] text-white/80">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15 text-accent-500 backdrop-blur">
                  <Check size={15} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
