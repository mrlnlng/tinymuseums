const AVIF_PROBE =
  'data:image/avif;base64,' +
  'AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZgAAAYRtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAA' +
  'AAAAAAAAAA5waXRtAAAAAAABAAAANGlsb2MAAAAAREAAAgACAAAAAAGoAAEAAAAAAAAAEwABAAAAAAG7AAEAAAAAAAAA' +
  'GAAAADhpaW5mAAAAAAACAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAAFWluZmUCAAAAAAIAAGF2MDEAAAAAw2lwcnAAAACd' +
  'aXBjbwAAABNjb2xybmNseAABAA0ABoAAAAAMYXYxQ4EAHAAAAAAUaXNwZQAAAAAAAAABAAAAAQAAAA5waXhpAAAAAAEI' +
  'AAAAOGF1eEMAAAAAdXJuOm1wZWc6bXBlZ0I6Y2ljcDpzeXN0ZW1zOmF1eGlsaWFyeTphbHBoYQAAAAAMYXYxQ4EgAgAA' +
  'AAAQcGl4aQAAAAADCAgIAAAAHmlwbWEAAAAAAAAAAgABBAGGAwcAAgSCAwSFAAAAGmlyZWYAAAAAAAAADmF1eGwAAgAB' +
  'AAEAAAAzbWRhdBIACgQYAAYVMgkcgKaRAAIhHkgSAAoHOAAGEBDQaTILHIAppppEAACwE3I='

let probe: Promise<boolean> | null = null

// One decode test decides the extension for every sprite, so nothing pays a
// failed request to find out the browser cannot read AVIF.
export function supportsAvif(): Promise<boolean> {
  if (!probe) {
    probe = new Promise<boolean>((resolve) => {
      if (typeof Image === 'undefined') {
        resolve(false)
        return
      }
      const img = new Image()
      img.onload = () => resolve(img.naturalWidth > 0)
      img.onerror = () => resolve(false)
      img.src = AVIF_PROBE
    })
  }
  return probe
}
