import { STAMP_URL } from '../lib/stamp'

/** The museum's currency, as a small stamp beside an amount. */
export default function Stamp({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={STAMP_URL} alt="" aria-hidden="true" className={className} draggable={false} />
}
