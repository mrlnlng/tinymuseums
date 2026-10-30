interface Layer {
  visible: boolean
  userData: Record<string, unknown>
}

/** Empty export metadata must never resolve an unnamed scene node (such as an eye). */
export function setCostumeVisibility<T extends Layer>(
  costumes: ReadonlyMap<string, readonly T[]>,
  hidden: Set<T>,
  find: (name: string) => T | undefined,
  dress: string | null,
  bow: string | null,
): void {
  for (const node of hidden) node.visible = true
  hidden.clear()
  for (const [id, parts] of costumes) {
    for (const part of parts) {
      part.visible = part.userData.part === 'bow' ? bow === id : dress === id
      if (!part.visible) continue
      for (const name of String(part.userData.hides ?? '').split(',').map(name => name.trim()).filter(Boolean)) {
        const node = find(name)
        if (node?.visible) { node.visible = false; hidden.add(node) }
      }
    }
  }
}
