import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Check, ArrowRight, ExternalLink } from 'lucide-react';
import { useAuth, useAuthModal } from '../store/useStore';

const IMG = (id, w = 700) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const PERKS = [
  'Full room & meal-plan tariffs',
  'Contracted rates, not public prices',
  'Your details pre-fill every enquiry',
];

export default function AuthModal() {
  const { mode, hotelName, setMode, closeAuth } = useAuthModal();
  const login = useAuth((s) => s.login);
  const signup = useAuth((s) => s.signup);

  const isSignup = mode === 'signup';
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeAuth();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [closeAuth]);

  useEffect(() => setError(''), [mode]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      if (isSignup) await signup(form);
      else await login({ email: form.email, password: form.password });
      closeAuth();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-ink-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && closeAuth()}
    >
      <div className="max-h-[94vh] w-full max-w-[860px] overflow-hidden rounded-t-2xl bg-white shadow-panel sm:rounded-2xl">
        <div className="grid max-h-[94vh] overflow-y-auto sm:grid-cols-[1fr_0.82fr] sm:overflow-visible">

          {/* form side */}
          <div className="order-2 px-5 py-6 sm:order-1 sm:px-8 sm:py-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[21px] font-extrabold leading-tight text-ink-900 sm:text-[24px]">
                  {isSignup ? 'Create your free account' : 'Sign in to continue'}
                </h2>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-500">
                  {hotelName
                    ? <>Tariffs for <span className="font-semibold text-ink-900">{hotelName}</span> are available to registered guests.</>
                    : 'Hotel details and live tariffs are available to registered guests.'}
                </p>
              </div>
              <button onClick={closeAuth} aria-label="Close" className="-mr-1 shrink-0 rounded-lg p-1.5 text-ink-400 transition hover:bg-surface hover:text-ink-900 sm:hidden">
                <X size={20} />
              </button>
            </div>

            {/* tabs */}
            <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-surface p-1">
              {[['login', 'Sign in'], ['signup', 'Create account']].map(([m, label]) => (
                <button key={m} onClick={() => setMode(m)}
                  className={`rounded-lg py-2.5 text-[13.5px] font-bold transition ${
                    mode === m ? 'bg-white text-ink-900 shadow-card' : 'text-ink-500 hover:text-ink-900'}`}>
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="mt-5 space-y-3">
              {isSignup && (
                <div>
                  <label className="label">Full name *</label>
                  <div className="relative">
                    <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                    <input required className="field !pl-10" placeholder="Your name" value={form.name} onChange={set('name')} />
                  </div>
                </div>
              )}

              <div>
                <label className="label">Email *</label>
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input required type="email" autoComplete="email" className="field !pl-10" placeholder="you@email.com" value={form.email} onChange={set('email')} />
                </div>
              </div>

              {isSignup && (
                <div>
                  <label className="label">Phone</label>
                  <div className="relative">
                    <Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                    <input className="field !pl-10" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
                  </div>
                </div>
              )}

              <div>
                <label className="label">Password *</label>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    required minLength={6} type={show ? 'text' : 'password'}
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    className="field !pl-10 !pr-10"
                    placeholder={isSignup ? 'At least 6 characters' : 'Your password'}
                    value={form.password} onChange={set('password')}
                  />
                  <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition hover:text-ink-700">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700">{error}</p>}

              <button disabled={busy} className="btn-accent w-full !py-3 font-bold disabled:opacity-60">
                {busy ? 'Please wait…' : isSignup ? 'Create account & continue' : 'Sign in & continue'}
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
              <p className="text-[12px] text-ink-400">No online payment, ever.</p>
              <Link
                to={isSignup ? '/signup' : '/login'}
                onClick={closeAuth}
                className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-brand-700 hover:underline"
              >
                Open full page <ExternalLink size={13} />
              </Link>
            </div>
          </div>

          {/* visual side */}
          <div className="relative order-1 min-h-[150px] sm:order-2 sm:min-h-full">
            <img src={IMG(4502973)} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-ink-900/88 via-ink-900/62 to-brand-900/45" />
            <button onClick={closeAuth} aria-label="Close"
              className="absolute right-3 top-3 hidden rounded-lg bg-white/15 p-1.5 text-white backdrop-blur transition hover:bg-white/25 sm:block">
              <X size={18} />
            </button>
            <div className="relative flex h-full flex-col justify-end p-6 sm:p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent-500">Members see more</p>
              <h3 className="mt-2 text-[19px] font-extrabold leading-tight text-white sm:text-[22px]">
                Real tariffs.<br className="hidden sm:block" /> Real people.
              </h3>
              <ul className="mt-4 space-y-2.5">
                {PERKS.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-[13px] leading-snug text-white/80">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/15 text-accent-500 backdrop-blur">
                      <Check size={12} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
