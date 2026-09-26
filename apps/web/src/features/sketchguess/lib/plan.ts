export const ROUND_SPREAD = 1000

function shuffle<T>(items: T[], random: () => number): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
  return items
}

export function randomRound(random: () => number = Math.random): number {
  return Math.floor(random() * ROUND_SPREAD)
}

// The server answers round k with painting k mod poolSize, so rounds with distinct
// residues are distinct paintings; the rest of k only changes the decoys.
export function planGame(
  poolSize: number,
  count: number,
  options: { first?: number; avoid?: ReadonlySet<number>; random?: () => number } = {},
): number[] {
  const { first, avoid = new Set<number>(), random = Math.random } = options
  const rounds = first === undefined ? [] : [first]
  const used = new Set(rounds.map((round) => round % poolSize))

  const open = [...Array(poolSize).keys()].filter((residue) => !used.has(residue))
  const fresh = shuffle(open.filter((residue) => !avoid.has(residue)), random)
  const seen = shuffle(open.filter((residue) => avoid.has(residue)), random)
  const variants = Math.max(1, Math.floor(ROUND_SPREAD / poolSize))

  for (const residue of [...fresh, ...seen]) {
    if (rounds.length >= count) break
    rounds.push(residue + poolSize * Math.floor(random() * variants))
  }
  return rounds
}
