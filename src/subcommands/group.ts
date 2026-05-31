import { confirm, log, multiselect, note, text } from '@clack/prompts'
import { defineCommand } from 'citty'
import * as pc from 'picocolors'
import * as v from 'valibot'
import { name } from '../../package.json'
import { config } from '../config'
import { PackageSpec } from '../schemas'
import { useCancel } from '../utils'

export const groupAddCommand = defineCommand({
  meta: {
    description: 'Add a new package group',
  },
  run: async () => {
    const name = useCancel(
      await text({
        initialValue: '',
        message: 'Enter the name of the package group to add:',
        validate: v.pipe(
          v.string(),
          v.trim(),
          v.nonEmpty('Group name cannot be empty.'),
          v.check(
            name => config.groups.every(group => group.name !== name),
            'A group with this name already exists. Please choose a different name.'
          )
        ),
      })
    )

    const packageSpecs = useCancel(
      await text({
        initialValue: '',
        message:
          'Enter the package specifications for the group. Append #D for devDependency, and separate by spaces:',
        placeholder: 'e.g. react @types/react@latest#D',
        validate: v.pipe(
          // TODO
          v.string(),
          v.trim(),
          v.nonEmpty('Package specifications cannot be empty.'),
          v.transform(specs => specs.split(' ').filter(spec => spec.trim() !== '')),
          v.array(
            PackageSpec(
              'Invalid package specification format. Please follow the format: name[@version][#D]'
            )
          )
        ),
      })
    )

    const packages = packageSpecs
      .split(' ')
      .map(spec => spec.trim().replace(/#(.*)/, (_, flags) => '#' + flags.replace(/[^D]/g, '')))

    note(
      [`Group name: ${pc.cyan(name)}`, `Packages: ${pc.cyan(packages.join(', '))}`].join('\n'),
      'Summary',
      { format: line => line }
    )

    const isConfirmed = useCancel(
      await confirm({
        message: 'Are you sure you want to add this package group?',
      })
    )

    if (isConfirmed) {
      config.groups = config.groups.concat([{ name, packages }])
      log.success(`Package group ${pc.cyan(name)} added successfully!`)
    }
  },
})

export const groupListCommand = defineCommand({
  meta: {
    alias: 'ls',
    description: 'List all package groups',
  },
  run: () => {
    if (config.groups.length === 0) {
      return log.info(`No package groups found. Use "${name} group add" to create one.`)
    }
    note(
      config.groups
        .map(group => [pc.cyan(group.name), group.packages.join(', ')].join('\n'))
        .join('\n\n'),
      `Groups (${config.groups.length})`,
      { format: line => line }
    )
  },
})

export const groupRemoveCommand = defineCommand({
  meta: {
    alias: 'rm',
    description: 'Remove one or more package groups',
  },
  run: async () => {
    const toDelete = useCancel(
      await multiselect({
        message: 'Select items to remove:',
        options: config.groups.map(group => ({
          label: group.name,
          value: group.name,
          hint: group.packages.join(', '),
        })),
      })
    )

    const isConfirmed = useCancel(
      await confirm({
        message: `Are you sure you want to remove the selected group(s)? This action cannot be undone.\n${toDelete.join('\n')}`,
      })
    )
    if (!isConfirmed) return

    const toDeleteSet = new Set(toDelete)
    config.groups = config.groups.filter(group => !toDeleteSet.has(group.name))
    log.info(`Removed ${toDelete.length} group(s) completely.`)
  },
})
