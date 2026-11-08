'use client'

import FishingView, { type PondGameProps } from './FishingView'

export type { PondGameProps }

/** The pond room mounts this into its own full-screen host. */
export default function PondGame(props: PondGameProps) {
  return <FishingView {...props} />
}
