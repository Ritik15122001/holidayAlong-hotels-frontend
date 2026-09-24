import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin, ShieldCheck, Send, LogIn, LogOut, UserRound } from 'lucide-react';
import Logo from './Logo.jsx';
import { WhatsAppIcon } from './Icons.jsx';
import { FloatingCta } from './CtaBar.jsx';
import { PHONE, PHONE_DISPLAY, EMAIL, waLink } from './Contact.js';
import { useEnquiry, useAuth } from '../store/useStore';
import BookingModal from './BookingModal.jsx';

const links = [
  { to: '/', label: 'Home' },
  { to: '/hotels', label: 'Hotels' },
  { to: '/about', label: 'About & Contact' },
];

function Header() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const { pathname } = useLocation();
  const openEnquiry = useEnquiry((s) => s.openEnquiry);
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  useEffect(() => { setOpen(false); setMenu(false); }, [pathname]);

  const initials = (user?.name || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) =>
                `rounded-lg px-3.5 py-2 text-[14px] font-semibold transition ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-surface hover:text-ink-900'}`}>
              {l.label}
            </NavLink>
          ))}
          <span className="mx-2 h-6 w-px bg-line" />
          <a href={waLink()} target="_blank" rel="noreferrer" title="Chat on WhatsApp"
            className="grid h-10 w-10 place-items-center rounded-lg bg-[#25D366] text-white transition hover:bg-[#1db954]">
            <WhatsAppIcon size={19} />
          </a>
          <a href={`tel:${PHONE}`}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-line px-3 text-[14px] font-semibold text-ink-900 transition hover:border-brand-300 hover:text-brand-700">
            <Phone size={15} className="text-brand-600" /> {PHONE_DISPLAY}
          </a>
          <div className="relative">
              <button onClick={() => setMenu((v) => !v)}
                className="flex h-10 items-center gap-2 rounded-lg border border-line px-2.5 text-[14px] font-semibold text-ink-900 transition hover:border-brand-300">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-[11px] font-bold text-white">{initials}</span>
                <span className="max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
              </button>
              {menu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                  <div className="absolute right-0 top-12 z-20 w-56 rounded-xl border border-line bg-white p-1.5 shadow-lift">
                    <div className="border-b border-line px-3 py-2.5">
                      <p className="truncate text-[13.5px] font-bold text-ink-900">{user.name}</p>
                      <p className="truncate text-[12px] text-ink-500">{user.email}</p>
                    </div>
                    <button onClick={() => { logout(); setMenu(false); }}
                      className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] font-semibold text-ink-700 hover:bg-surface">
                      <LogOut size={15} /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          <button onClick={() => openEnquiry({})} className="btn-accent h-10 !py-0 font-bold"><Send size={15} />Book now</button>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <a href={waLink()} target="_blank" rel="noreferrer" aria-label="WhatsApp"
            className="grid h-10 w-10 place-items-center rounded-lg bg-[#25D366] text-white"><WhatsAppIcon size={18} /></a>
          <a href={`tel:${PHONE}`} aria-label="Call"
            className="grid h-10 w-10 place-items-center rounded-lg border border-line text-brand-700"><Phone size={17} /></a>
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="grid h-10 w-10 place-items-center rounded-lg border border-line text-ink-700">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-white px-4 py-3 lg:hidden">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) => `block rounded-lg px-3 py-3 text-[15px] font-semibold ${isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700'}`}>
              {l.label}
            </NavLink>
          ))}
          <div className="mt-2 border-t border-line pt-2">

                <div className="flex items-center gap-2.5 px-3 py-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-600 text-[12px] font-bold text-white">{initials}</span>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-bold text-ink-900">{user.name}</p>
                    <p className="truncate text-[12px] text-ink-500">{user.email}</p>
                  </div>
                </div>
                <button onClick={logout} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-3 text-[15px] font-semibold text-ink-700">
                  <LogOut size={16} /> Sign out
                </button>
          </div>
          <button onClick={() => openEnquiry({})} className="btn-accent mt-2 w-full !py-3 font-bold"><Send size={16} /> Book now</button>
        </div>
      )}
    </header>
  );
}

const FOOT_IMG = (id, w = 700) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const FOOT_DEST = [
  { city: 'Goa', image: FOOT_IMG(2506988, 400) },
  { city: 'Jaipur', image: FOOT_IMG(2869215, 400) },
  { city: 'Udaipur', image: FOOT_IMG(4502973, 400) },
  { city: 'Munnar', image: FOOT_IMG(6129967, 400) },
];

function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden bg-ink-900">
      <img src={FOOT_IMG(1134176, 1600)} alt="" aria-hidden="true" loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-900/85 via-ink-900/95 to-ink-900" />

      <div className="relative">
        <div className="container-x grid gap-10 py-14 lg:grid-cols-[1.25fr_0.7fr_1.1fr_1fr]">
          <div>
            <Logo onDark />
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-white/60">
              Handpicked luxury hotels and resorts across India, with transparent room and meal-plan tariffs and a human travel desk.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[12px] font-bold text-white backdrop-blur">
              <ShieldCheck size={14} className="text-accent-500" /> Verified properties only
            </span>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-accent-500">Explore</h4>
            <ul className="space-y-2.5 text-[14px] text-white/65">
              {links.map((l) => <li key={l.to}><Link to={l.to} className="transition hover:text-white">{l.label}</Link></li>)}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-accent-500">Top destinations</h4>
            <div className="grid grid-cols-2 gap-2.5">
              {FOOT_DEST.map(({ city, image }) => (
                <Link key={city} to="/hotels" className="group relative h-[68px] overflow-hidden rounded-xl">
                  <img src={image} alt={city} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink-900/85 to-ink-900/10" />
                  <span className="absolute inset-x-0 bottom-0 px-2.5 py-2 text-[12.5px] font-bold text-white">{city}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-accent-500">Contact</h4>
            <ul className="space-y-3 text-[14px] text-white/65">
              <li><a href={`tel:${PHONE}`} className="flex items-start gap-2.5 transition hover:text-white"><Phone size={16} className="mt-0.5 shrink-0 text-brand-300" /> {PHONE_DISPLAY}</a></li>
              <li>
                <a href={waLink()} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-3 py-2 text-[13px] font-bold text-white transition hover:bg-[#1eb455]">
                  <WhatsAppIcon size={16} /> Chat on WhatsApp
                </a>
              </li>
              <li><a href={`mailto:${EMAIL}`} className="flex items-start gap-2.5 break-all transition hover:text-white"><Mail size={16} className="mt-0.5 shrink-0 text-brand-300" /> {EMAIL}</a></li>
              <li className="flex items-start gap-2.5"><MapPin size={16} className="mt-0.5 shrink-0 text-brand-300" /> 12 Harbour Lane, Mumbai 400001</li>
            </ul>
          </div>
        </div>

        <div className="container-x flex flex-col items-center justify-between gap-2 border-t border-white/10 py-5 text-[12px] text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Holiday Along Hotels</p>
          <p>Booking requests handled by a real team — no online payments</p>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const open = useEnquiry((s) => s.open);
  const refresh = useAuth((s) => s.refresh);
  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1"><Outlet /></main>
      <Footer />
      <FloatingCta />
      {open && <BookingModal />}
    </div>
  );
}
