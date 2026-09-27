export function cleanText(value: unknown, { multiline }: { multiline: boolean }): string {
  if (typeof value !== 'string') return ''
  let text = value.normalize('NFC').replace(/\r\n?/g, '\n')
  text = multiline
    ? text.replace(/[^\P{Cc}\n]/gu, '').replace(/\n{3,}/g, '\n\n')
    : text.replace(/\p{Cc}/gu, ' ').replace(/\s+/g, ' ')
  return text.trim()
}
