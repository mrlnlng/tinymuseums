/**
 * Tiny WebAudio synthesizer for the pond's chimes, splashes and fanfare.
 * No audio files: the sound setting from SoundProvider is the only switch.
 */

export type PondSfxName =
  | 'cast'
  | 'splash'
  | 'nibble'
  | 'bite'
  | 'hook'
  | 'reelTick'
  | 'streak'
  | 'snap'
  | 'lost'
  | 'plink'
  | 'chime2'
  | 'chime3'
  | 'fanfare'
  | 'treasure'
  | 'coin'

type AudioContextClass = typeof AudioContext

function audioContextClass(): AudioContextClass | null {
  if (typeof window === 'undefined') return null
  const candidate = window as Window & { webkitAudioContext?: AudioContextClass }
  return window.AudioContext ?? candidate.webkitAudioContext ?? null
}

export class PondSfx {
  private context: AudioContext | null = null
  private master: GainNode | null = null
  private enabled = true
  private volume = 0.32

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
    if (!enabled && this.context?.state === 'running') void this.context.suspend().catch(() => {})
    if (enabled && this.context?.state === 'suspended') void this.context.resume().catch(() => {})
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
    if (this.master) this.master.gain.value = this.volume * 0.7
  }

  dispose(): void {
    const context = this.context
    this.context = null
    this.master = null
    if (context) void context.close().catch(() => {})
  }

  unlock(): void {
    if (!this.enabled) return
    const ctx = this.ensure()
    if (ctx?.state === 'suspended') void ctx.resume().catch(() => {})
  }

  private ensure(): AudioContext | null {
    if (this.context) return this.context
    const Class = audioContextClass()
    if (!Class) return null
    const context = new Class()
    const master = context.createGain()
    master.gain.value = this.volume * 0.7
    master.connect(context.destination)
    this.context = context
    this.master = master
    return context
  }

  private tone(
    ctx: AudioContext,
    frequency: number,
    at: number,
    duration: number,
    type: OscillatorType,
    gain: number,
    slideTo?: number,
  ): void {
    const master = this.master
    if (!master) return
    const oscillator = ctx.createOscillator()
    const envelope = ctx.createGain()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, at)
    if (slideTo !== undefined) {
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), at + duration)
    }
    envelope.gain.setValueAtTime(0, at)
    envelope.gain.linearRampToValueAtTime(gain, at + Math.min(0.02, duration / 4))
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration)
    oscillator.connect(envelope)
    envelope.connect(master)
    oscillator.start(at)
    oscillator.stop(at + duration + 0.02)
  }

  private noise(
    ctx: AudioContext,
    at: number,
    duration: number,
    gain: number,
    filter: 'lowpass' | 'highpass',
    cutoff: number,
  ): void {
    const master = this.master
    if (!master) return
    const frames = Math.max(1, Math.floor(ctx.sampleRate * duration))
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const node = ctx.createBiquadFilter()
    node.type = filter
    node.frequency.value = cutoff
    const envelope = ctx.createGain()
    envelope.gain.setValueAtTime(gain, at)
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration)
    source.connect(node)
    node.connect(envelope)
    envelope.connect(master)
    source.start(at)
    source.stop(at + duration)
  }

  play(name: PondSfxName): void {
    if (!this.enabled) return
    const ctx = this.ensure()
    if (!ctx) return
    if (ctx.state === 'suspended') void ctx.resume().catch(() => {})
    const at = ctx.currentTime + 0.01
    switch (name) {
      case 'cast':
        this.noise(ctx, at, 0.24, 0.16, 'lowpass', 1200)
        this.tone(ctx, 260, at, 0.18, 'sine', 0.1, 90)
        break
      case 'splash':
        this.noise(ctx, at, 0.3, 0.22, 'lowpass', 900)
        this.tone(ctx, 180, at, 0.18, 'sine', 0.14, 70)
        break
      case 'nibble':
        this.tone(ctx, 520, at, 0.06, 'sine', 0.07, 420)
        break
      case 'bite':
        this.noise(ctx, at, 0.18, 0.3, 'lowpass', 700)
        this.tone(ctx, 120, at, 0.22, 'triangle', 0.3, 60)
        break
      case 'hook':
        this.tone(ctx, 740, at, 0.1, 'square', 0.09)
        this.tone(ctx, 1100, at + 0.06, 0.12, 'sine', 0.1)
        break
      case 'reelTick':
        this.tone(ctx, 320, at, 0.035, 'square', 0.035, 260)
        break
      case 'streak':
        this.tone(ctx, 660, at, 0.09, 'triangle', 0.09, 880)
        this.tone(ctx, 990, at + 0.07, 0.16, 'triangle', 0.1, 1320)
        break
      case 'snap':
        this.noise(ctx, at, 0.16, 0.4, 'highpass', 900)
        this.tone(ctx, 220, at, 0.28, 'sawtooth', 0.14, 50)
        break
      case 'lost':
        this.tone(ctx, 330, at, 0.2, 'sine', 0.12, 220)
        this.tone(ctx, 220, at + 0.16, 0.35, 'sine', 0.12, 140)
        break
      case 'plink':
        this.tone(ctx, 880, at, 0.16, 'sine', 0.15)
        this.tone(ctx, 1320, at + 0.02, 0.12, 'sine', 0.06)
        break
      case 'chime2':
        this.tone(ctx, 660, at, 0.22, 'triangle', 0.13)
        this.tone(ctx, 990, at + 0.13, 0.3, 'triangle', 0.13)
        break
      case 'chime3':
        this.tone(ctx, 523, at, 0.24, 'triangle', 0.12)
        this.tone(ctx, 659, at + 0.1, 0.26, 'triangle', 0.13)
        this.tone(ctx, 784, at + 0.2, 0.5, 'triangle', 0.15)
        break
      case 'fanfare':
        this.tone(ctx, 523, at, 0.2, 'square', 0.12)
        this.tone(ctx, 659, at + 0.12, 0.2, 'square', 0.12)
        this.tone(ctx, 784, at + 0.24, 0.2, 'square', 0.12)
        this.tone(ctx, 1046, at + 0.36, 0.7, 'triangle', 0.18)
        this.tone(ctx, 523, at + 0.36, 0.7, 'sine', 0.08)
        this.tone(ctx, 784, at + 0.36, 0.7, 'sine', 0.07)
        break
      case 'treasure':
        this.tone(ctx, 1046, at, 0.12, 'sine', 0.13)
        this.tone(ctx, 1318, at + 0.08, 0.12, 'sine', 0.12)
        this.tone(ctx, 1568, at + 0.16, 0.26, 'sine', 0.12)
        break
      case 'coin':
        this.tone(ctx, 988, at, 0.08, 'square', 0.08)
        this.tone(ctx, 1319, at + 0.06, 0.16, 'square', 0.08)
        break
    }
  }
}

export function createPondSfx(): PondSfx {
  return new PondSfx()
}
