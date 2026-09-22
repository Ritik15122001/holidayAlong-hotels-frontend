import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, LogIn, UserRound, ArrowLeft } from 'lucide-react';
import { useAuth, useAuthModal } from '../store/useStore';

/**
 * Gate for pages only registered guests may see.
 * Instead of bouncing to another route, it shows a locked panel and
 * pops the sign-in modal over it, so the guest stays where they are.
 */
export default function RequireAuth({ children }) {
  const token = useAuth((s) => s.token);
  const openAuth = useAuthModal((s) => s.openAuth);
  const modalOpen = useAuthModal((s) => s.open);

  useEffect(() => {
    if (!token) openAuth({ mode: 'login' });
  }, [token, openAuth]);

  if (token) return children;

  return (
    <div className="bg-surface">
      <div className="container-x flex min-h-[calc(100vh-64px)] flex-col items-center justify-center py-16 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-600 text-white shadow-lift">
          <Lock size={26} />
        </span>
        <h1 className="mt-6 text-[24px] font-extrabold leading-tight text-ink-900 sm:text-[30px]">
          Hotel details are for registered guests
        </h1>
        <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-500">
          Sign in or create a free account to see the rooms, amenities and full room &amp; meal-plan tariffs for this property.
          It takes about 20 seconds and there is never any payment.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          <button onClick={() => openAuth({ mode: 'login' })} className="btn-accent !px-6 !py-3 font-bold">
            <LogIn size={16} /> Sign in
          </button>
          <button onClick={() => openAuth({ mode: 'signup' })} className="btn-outline !px-6 !py-3 font-bold">
            <UserRound size={16} /> Create free account
          </button>
        </div>

        {!modalOpen && (
          <Link to="/hotels" className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-brand-700 hover:underline">
            <ArrowLeft size={15} /> Back to all hotels
          </Link>
        )}
      </div>
    </div>
  );
}
