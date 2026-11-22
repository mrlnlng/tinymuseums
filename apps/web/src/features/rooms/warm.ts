import * as THREE from 'three'
import { yieldToMain } from '@/shared/lib/yield'

/**
 * Uploads a scene's textures one task at a time and compiles its shaders, so the first frame
 * draws without one long freeze. The frame itself is unchanged.
 */
export async function warmUp(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera): Promise<void> {
  const textures = new Set<THREE.Texture>()
  scene.traverse((node) => {
    const material = (node as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined
    if (!material) return
    for (const m of Array.isArray(material) ? material : [material]) {
      for (const value of Object.values(m)) if (value instanceof THREE.Texture) textures.add(value)
      const uniforms = (m as THREE.ShaderMaterial).uniforms
      if (uniforms) for (const uniform of Object.values(uniforms)) if (uniform.value instanceof THREE.Texture) textures.add(uniform.value)
    }
  })
  for (const texture of textures) {
    renderer.initTexture(texture)
    await yieldToMain()
  }
  await renderer.compileAsync(scene, camera).catch(() => {})
}
