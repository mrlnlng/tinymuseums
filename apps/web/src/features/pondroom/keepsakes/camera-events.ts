const OPEN_EVENT = 'tiny:open-camera'

export type CameraView = 'camera' | 'album'

/** The camera and album open over any room; the host lives inside the museum's stage. */
export function openCamera(view: CameraView = 'camera'): void {
  window.dispatchEvent(new CustomEvent<CameraView>(OPEN_EVENT, { detail: view }))
}

export function onOpenCamera(listener: (view: CameraView) => void): () => void {
  const handle = (event: Event) => listener((event as CustomEvent<CameraView>).detail)
  window.addEventListener(OPEN_EVENT, handle)
  return () => window.removeEventListener(OPEN_EVENT, handle)
}
