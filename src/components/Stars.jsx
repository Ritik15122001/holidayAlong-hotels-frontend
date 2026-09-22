import { Star } from 'lucide-react';

export default function Stars({ count = 5, size = 13, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${count} star hotel`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={size} className="fill-amber-400 text-amber-400" />
      ))}
    </span>
  );
}
