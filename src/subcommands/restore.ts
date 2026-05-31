import { confirm, log } from '@clack/prompts'
import { defineCommand } from 'citty'
import { config, DEFAULT_CONFIG } from '../config'
import { useCancel } from '../utils'

export const restoreCommand = defineCommand({
  meta: {
    description: 'Restore the config to its initial state',
  },

  async run() {
    const isConfirmed = useCancel(
      await confirm({
        message:
          'Are you sure you want to restore the config to its initial state? This will delete all your groups and their packages.',
      })
    )
    if (!isConfirmed) return

    const isConfirmedAgain = useCancel(
      await confirm({
        message: 'This action cannot be undone. Are you absolutely sure?',
      })
    )
    if (!isConfirmedAgain) return

    if (isConfirmed && isConfirmedAgain) {
      Object.assign(config, DEFAULT_CONFIG)
      log.success('Config restored to its initial state.')
    }
  },
})
