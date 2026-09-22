import { Link } from 'react-router-dom';

const SIZE = { sm: 'h-7', md: 'h-8 sm:h-9', lg: 'h-10 sm:h-12' };

/** Brand wordmark — orange "Holiday", navy "Along" with the rising swoosh. */
export function Wordmark({ size = 'md', onDark = false, className = '' }) {
  return (
    <img
      src={onDark ? '/logo-dark.png' : '/logo.png'}
      alt="Holiday Along Hotels"
      width="560"
      height="121"
      className={`${SIZE[size] || SIZE.md} w-auto select-none ${className}`}
    />
  );
}

export default function Logo({ to = '/', ...props }) {
  return (
    <Link to={to} className="shrink-0" aria-label="Holiday Along Hotels — home">
      <Wordmark {...props} />
    </Link>
  );
}
