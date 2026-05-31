import { log, text } from '@clack/prompts'
import { defineCommand } from 'citty'
import { spawnSync } from 'node:child_process'
import * as v from 'valibot'
import { CONFIG_PATH } from '../config'
import { useCancel } from '../utils'

export const configCommand = defineCommand({
  subCommands: {
    edit: defineCommand({
      meta: {
        description: 'Edit the configuration file',
      },
      run: async () => {
        const program = useCancel(
          await text({
            message: 'Please open it in your favorite editor and edit the JSON content.',
            placeholder: 'eg: code -w (Visual Studio Code), edit (Microsoft Edit) etc.',
            validate: v.pipe(v.string(), v.trim(), v.nonEmpty('Editor command cannot be empty.')),
          })
        )

        try {
          const result = spawnSync(`${program} "${CONFIG_PATH}"`, {
            shell: true,
            stdio: 'inherit',
          })
          if (result.error) {
            log.error(`Failed to open editor: ${result.error.message}`)
            process.exit(1)
          }
          if ((result.status ?? 0) !== 0) {
            log.error(`Editor exited with code: ${result.status ?? 1}`)
          }
        } catch {
          log.error(`Failed to open config file with command: ${program} "${CONFIG_PATH}"`)
        }

        // [TODO] Validate the config file after editing and show error if it's invalid
      },
    }),
  },
})
