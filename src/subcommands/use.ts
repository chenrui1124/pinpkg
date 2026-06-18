import { autocompleteMultiselect, confirm, log, select, text } from '@clack/prompts'
import { defineCommand, runCommand } from 'citty'
import { spawnSync } from 'node:child_process'
import { config } from '../config'
import { parsePackageSpec, useCancel } from '../utils'
import { groupAddCommand } from './group'

export const useCommand = defineCommand({
  meta: {
    description: 'Select one or more package groups and add their packages to the current project',
  },
  setup: async ctx => {
    if (config.groups.length <= 0) {
      const shouldAdd = useCancel(
        await confirm({
          message: 'No stores found. Would you like to add one?',
        })
      )
      if (shouldAdd) {
        await runCommand(groupAddCommand, ctx)
        return
      } else {
        process.exit(0)
      }
    }

    const selectedGroups = useCancel(
      await autocompleteMultiselect({
        maxItems: 20,
        message: 'Choose packages to add to your project:',
        options: config.groups.map(group => ({
          value: group,
          label: group.name,
          hint: group.packages.join(', '),
        })),
        required: true,
      })
    )

    const packageManager = useCancel(
      await select({
        message: 'Select your package manager:',
        options: [
          {
            label: 'npm',
            value: 'npm',
          },
          {
            label: 'yarn',
            value: 'yarn',
          },
          {
            label: 'pnpm',
            value: 'pnpm',
          },
          {
            label: 'bun',
            value: 'bun',
          },
        ],
      })
    )

    const packages = selectedGroups.flatMap(group => group.packages)

    const [deps, devDeps] = packages.reduce<[string[], string[]]>(
      ([a, b], spec) => {
        const [, , flags] = parsePackageSpec(spec)
        const name = spec.replace(/#.*$/, '')
        flags.includes('D') ? b.push(name) : a.push(name)
        return [a, b]
      },
      [[], []]
    )

    const command = useCancel(
      await text({
        message:
          'The following command will be executed to install the selected packages. You can edit it if needed.',
        initialValue: [
          deps.length > 0 ? `${packageManager} add ${deps.join(' ')}` : '',
          '&&',
          devDeps.length > 0 ? `${packageManager} add -D ${devDeps.join(' ')}` : '',
        ].join(' '),
      })
    )

    const result = spawnSync(command, {
      shell: true,
      stdio: 'inherit',
    })
    if (result.error) {
      log.error(`Failed to run command: ${result.error.message}`)
      process.exit(1)
    }

    process.exit(result.status ?? 1)
  },
})
