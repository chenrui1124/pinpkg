import { confirm, log, multiselect, note, select, text } from '@clack/prompts'
import { defineCommand } from 'citty'
import * as pc from 'picocolors'
import * as v from 'valibot'
import { displayName } from '../../package.json'
import { config } from '../config'
import { cleanPackageSpec, isValidPackageSpec, useCancel } from '../utils'

const ValidGroupName = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty('Group name cannot be empty.'),
  v.check(
    name => config.groups.every(group => group.name !== name),
    'A group with this name already exists. Please choose a different name.'
  )
)

const ValidPackageSpecs = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty('Package specifications cannot be empty.'),
  v.transform(specs =>
    specs
      .split(' ')
      .map(spec => spec.trim())
      .filter(spec => spec !== '')
  ),
  v.array(
    v.pipe(
      v.string(),
      v.check(
        isValidPackageSpec,
        ctx =>
          `Invalid package specification ${ctx.input}. Please follow the format: name[@version][#D]`
      )
    )
  )
)

export const groupAddCommand = defineCommand({
  meta: {
    description: 'Add a new package group',
  },
  run: async () => {
    const name = useCancel(
      await text({
        initialValue: '',
        message: 'Enter the name of the package group to add:',
        validate: ValidGroupName,
      })
    )

    const specs = useCancel(
      await text({
        initialValue: '',
        message:
          'Enter the package specifications for the group. Append #D for devDependency, and separate by spaces:',
        placeholder: 'e.g. react @types/react@latest#D',
        validate: ValidPackageSpecs,
      })
    )

    const packages = specs
      .split(' ')
      .map(cleanPackageSpec)
      .filter(spec => spec !== '')

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

const groupEditCommand = defineCommand({
  meta: {
    description: 'Edit an existing package group',
  },
  run: async () => {
    const next = useCancel(
      await select({
        maxItems: 20,
        message: 'Select a package group to edit:',
        options: config.groups.map(group => ({
          value: group,
          label: group.name,
          hint: group.packages.join(', '),
        })),
      })
    )

    const specs = useCancel(
      await text({
        message: `Edit the package specifications for group ${pc.cyan(next.name)}. Append #D for devDependency, and separate by spaces:`,
        initialValue: next.packages.join(' '),
        validate: ValidPackageSpecs,
      })
    )

    const packages = specs
      .split(' ')
      .map(cleanPackageSpec)
      .filter(spec => spec !== '')

    note(
      [`Group name: ${pc.cyan(next.name)}`, `Packages: ${pc.cyan(packages.join(', '))}`].join('\n'),
      'Summary',
      { format: line => line }
    )

    const isConfirmed = useCancel(
      await confirm({
        message: 'Are you sure you want to update this package group with the new specifications?',
      })
    )
    if (isConfirmed) {
      config.groups = config.groups.map(prev =>
        prev.name === next.name ? { name: prev.name, packages } : prev
      )
      log.success(`Package group ${pc.cyan(next.name)} edited successfully!`)
    }
  },
})

const groupListCommand = defineCommand({
  meta: {
    alias: 'ls',
    description: 'List all package groups',
  },
  run: () => {
    if (config.groups.length === 0) {
      return log.info(`No package groups found. Use "${displayName} group add" to create one.`)
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

const groupRemoveCommand = defineCommand({
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

export const groupCommand = defineCommand({
  meta: {
    description: 'Manage package groups',
  },
  subCommands: {
    add: groupAddCommand,
    edit: groupEditCommand,
    list: groupListCommand,
    remove: groupRemoveCommand,
  },
})
