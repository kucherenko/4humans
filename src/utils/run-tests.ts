import { spawnSync } from 'node:child_process'

export function runTests(
  config: { install: string; test: { command: string } },
  { install = false }: { install: boolean },
) {
  if (install) {
    spawnSync(config.install, {
      shell: true,
    })
  }

  return spawnSync(config.test.command, {
    shell: true,
  })
}
