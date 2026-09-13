export default function Message({ m, k }: { m?: string; k?: string }) {
  if (!m) return null
  return <p className={`notice ${k === 'bad' ? 'bad' : 'ok'}`}>{m}</p>
}
