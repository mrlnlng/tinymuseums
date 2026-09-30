import type Phaser from 'phaser'

const ACTIVE_MINI_GAME = 'hall:minigame'

export function activeMiniGame(game: Phaser.Game): string | null {
  return (game.registry.get(ACTIVE_MINI_GAME) as string | null) ?? null
}

export function launchMiniGame(game: Phaser.Game, key: string, data?: object): void {
  if (activeMiniGame(game) !== null) return

  const hall = game.scene.getScene('hall')
  if (!hall) return

  if (!game.loop.running) game.loop.wake()

  hall.scene.pause('hall')
  game.registry.set(ACTIVE_MINI_GAME, key)
  hall.scene.launch(key, data)

  const mini = game.scene.getScene(key)
  if (!mini) {
    game.registry.set(ACTIVE_MINI_GAME, null)
    hall.scene.resume('hall')
    return
  }

  mini.events.once('shutdown', () => {
    game.registry.set(ACTIVE_MINI_GAME, null)
    hall.scene.resume('hall')
    if (!game.loop.running) game.loop.wake()
  })
}
