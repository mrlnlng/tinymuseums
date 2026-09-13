import { CONFIG } from './config'

export interface HallLayout {
  centerX: number[]
  pedestalX: number[]
  totalLength: number
  known: number
  giftShopX: number | null
  cafeX: number | null
  guestBoardX: number | null
}

function cafeAfterIndex(widths: number[], isComplete: boolean): number | null {
  if (widths.length > 10) return 9
  if (isComplete && widths.length > 0) return widths.length - 1
  return null
}

export function computeLayout(widths: number[], isComplete = false): HallLayout {
  const centerX: number[] = []
  const pedestalX: number[] = []
  let cafeX: number | null = null

  let cursor = CONFIG.lobby.length
  const after = cafeAfterIndex(widths, isComplete)
  widths.forEach((w, i) => {
    centerX.push(cursor + w / 2)
    cursor += w
    if (i >= widths.length - 1) return

    if (after === i) {
      cafeX = cursor + CONFIG.cafe.length / 2
      cursor += CONFIG.cafe.length
    } else {
      if (hasPedestal(i)) pedestalX.push(cursor + CONFIG.piece.gap / 2)
      cursor += CONFIG.piece.gap
    }
  })

  if (isComplete && after === widths.length - 1) {
    cafeX = cursor + CONFIG.cafe.length / 2
    cursor += CONFIG.cafe.length
  }

  const giftShopX = isComplete ? cursor + CONFIG.giftShop.length : null
  const guestBoardX = giftShopX === null ? null : giftShopX + CONFIG.guestBoard.length

  return {
    centerX,
    pedestalX,
    totalLength: guestBoardX ?? cursor + CONFIG.piece.gap,
    known: widths.length,
    giftShopX,
    cafeX,
    guestBoardX,
  }
}

function hasPedestal(index: number): boolean {
  const noise = Math.sin((index + 1) * 12.9898) * 43758.5453
  return noise - Math.floor(noise) < CONFIG.pedestal.frequency
}
