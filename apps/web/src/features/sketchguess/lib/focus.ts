const GRID = 6

export interface Focus {
  x: number
  y: number
}

// A zoomed clue should land on detail, not blank sky, so the centre is drawn from
// the busiest cells of the ink map. Edge cells are skipped so the view stays inside the painting.
export function pickFocus(
  ink: ArrayLike<number>,
  width: number,
  height: number,
  random: () => number = Math.random,
): Focus {
  const cells: { x: number; y: number; weight: number }[] = []
  for (let gy = 1; gy < GRID - 1; gy++) {
    for (let gx = 1; gx < GRID - 1; gx++) {
      const x0 = Math.floor((gx * width) / GRID)
      const x1 = Math.floor(((gx + 1) * width) / GRID)
      const y0 = Math.floor((gy * height) / GRID)
      const y1 = Math.floor(((gy + 1) * height) / GRID)
      let weight = 0
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) weight += ink[y * width + x]
      cells.push({ x: (gx + 0.5) / GRID, y: (gy + 0.5) / GRID, weight })
    }
  }

  const inked = cells.filter((cell) => cell.weight > 0).sort((a, b) => b.weight - a.weight)
  const pool = inked.length > 0 ? inked : cells
  const busiest = pool.slice(0, Math.max(1, Math.ceil(pool.length / 3)))
  const chosen = busiest[Math.floor(random() * busiest.length)]
  return { x: chosen.x, y: chosen.y }
}
