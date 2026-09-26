import { Send } from 'lucide-react';
import { useEnquiry } from '../store/useStore';

/** Booking action. `waText` is accepted and ignored so callers need no change. */
export default function CtaBar({ variant = 'row', context = {}, className = '' }) {
  const openEnquiry = useEnquiry((s) => s.openEnquiry);
  const stack = variant === 'stack';

  return (
    <div className={`flex gap-2.5 ${stack ? 'flex-col' : 'flex-wrap items-center'} ${className}`}>
      <button onClick={() => openEnquiry(context)} className={`btn-accent ${stack ? 'w-full !py-3.5' : ''} font-bold`}>
        <Send size={16} /> Book now
      </button>
    </div>
  );
}
