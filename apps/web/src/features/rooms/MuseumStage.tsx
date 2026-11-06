'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import { useSound } from '@/features/sound/components/SoundProvider'
import { createStage, type Stage } from './stage'
import type { Arrival, DoorRef, RoomDef } from './types'

type ActiveRoom = Pick<RoomDef, 'className'>

interface StageContextValue {
  stage: Stage | null
  setActiveRoom: Dispatch<SetStateAction<ActiveRoom | null>>
}

const StageContext = createContext<StageContextValue | null>(null)

export default function MuseumStage({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const characterRef = useRef<HTMLDivElement>(null)
  const sound = useSound()
  const soundRef = useRef(sound)
  soundRef.current = sound
  const [stage, setStage] = useState<Stage | null>(null)
  const [activeRoom, setActiveRoom] = useState<ActiveRoom | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const overlay = overlayRef.current
    const character = characterRef.current
    if (!canvas || !overlay || !character) return

    const created = createStage({
      hosts: { canvas, overlay, character },
      sound: () => soundRef.current,
    })
    setStage(created)
    return () => {
      setStage(null)
      created.dispose()
    }
  }, [])

  const className = activeRoom?.className ? `museum ${activeRoom.className}` : 'museum'

  return (
    <StageContext.Provider value={{ stage, setActiveRoom }}>
      <div className={className}>
        <div className="hall-host" ref={canvasRef} />
        <div className="hall-overlay" ref={overlayRef} />
        <div className="hall-character" ref={characterRef} />
        {children}
      </div>
    </StageContext.Provider>
  )
}

interface RoomOptions<Art> {
  room: RoomDef<Art>
  arrival: Arrival
  isSuspended?: () => boolean
  onExit(to: DoorRef): void
}

export function useRoom<Art>({ room, arrival, isSuspended = () => false, onExit }: RoomOptions<Art>) {
  const context = useContext(StageContext)
  if (!context) throw new Error('useRoom must be used inside MuseumStage')
  const { stage, setActiveRoom } = context
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isSuspendedRef = useRef(isSuspended)
  isSuspendedRef.current = isSuspended
  const onExitRef = useRef(onExit)
  onExitRef.current = onExit
  const arrivalRef = useRef(arrival)
  arrivalRef.current = arrival
  const arrivalKey = arrival.kind === 'door' ? `door:${arrival.door}` : 'opening'

  useEffect(() => {
    setIsReady(false)
    setError(null)
    if (!stage) return

    const handle = stage.enter(room, arrivalRef.current, {
      isSuspended: () => isSuspendedRef.current(),
      onReady: () => setIsReady(true),
      onError: (message) => setError(message),
      onExit: (to) => onExitRef.current(to),
    })
    setActiveRoom(room)

    return () => {
      handle.dispose()
      setActiveRoom((active) => (active === room ? null : active))
    }
  }, [stage, room, arrivalKey, setActiveRoom])

  return { isReady, error }
}
