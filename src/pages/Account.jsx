import { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../store/useStore';

const IMG = (id, w = 1200) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const PERKS = [
  'See full room and meal-plan tariffs',
  'Save time — your details pre-fill every enquiry',
  'Get our contracted rates, not public prices',
];

export default function Account({ mode = 'login' }) {
  const isSignup = mode === 'signup';
  const navigate = useNavigate();
  const { state } = useLocation();
  const next = state?.next || '/hotels';

  const user = useAuth((s) => s.user);
  const login = useAuth((s) => s.login);
  const signup = useAuth((s) => s.signup);

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (user) return <Navigate to={next} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      if (isSignup) await signup(form);
      else await login({ email: form.email, password: form.password });
      navigate(next, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-[1fr_1.05fr]">
      {/* form */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-[400px]">
          <h1 className="text-[26px] font-extrabold leading-tight text-ink-900 sm:text-[32px]">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-500">
            {isSignup
              ? 'Sign up free to unlock hotel details, room tariffs and meal-plan rates.'
              : 'Sign in to view hotel details and live tariffs.'}
          </p>

          {state?.next && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-brand-50 px-4 py-3 text-[13px] text-brand-800">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand-600" />
              Hotel details and tariffs are available to registered guests. It takes about 20 seconds.
            </p>
          )}

          <form onSubmit={submit} className="mt-6 space-y-3.5">
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
                  className="field !pl-10 !pr-10" placeholder={isSignup ? 'At least 6 characters' : 'Your password'}
                  value={form.password} onChange={set('password')}
                />
                <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700">{error}</p>}

            <button disabled={busy} className="btn-accent w-full !py-3 disabled:opacity-60">
              {busy ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'} <ArrowRight size={16} />
            </button>
          </form>

          <p className="mt-5 text-center text-[13.5px] text-ink-500">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <Link
              to={isSignup ? '/login' : '/signup'}
              state={state}
              className="font-bold text-brand-700 hover:underline"
            >
              {isSignup ? 'Sign in' : 'Create one free'}
            </Link>
          </p>

          <p className="mt-4 text-center text-[12px] leading-relaxed text-ink-400">
            We never take online payments. Your account is only used to show tariffs and handle your enquiries.
          </p>
        </div>
      </div>

      {/* visual */}
      <div className="relative hidden lg:block">
        <img src={IMG(4502973)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900/90 via-ink-900/65 to-brand-900/50" />
        <div className="relative flex h-full flex-col justify-end p-12">
          <h2 className="text-[30px] font-extrabold leading-tight text-white">
            Real tariffs.<br />Real people. No payment.
          </h2>
          <ul className="mt-6 space-y-3">
            {PERKS.map((t) => (
              <li key={t} className="flex items-center gap-3 text-[14.5px] text-white/80">
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
