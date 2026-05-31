import { confirm, log, note, text } from '@clack/prompts'
import { defineCommand } from 'citty'
import * as pc from 'picocolors'
import * as v from 'valibot'
import { config } from '../config'
import { PackageSpec } from '../schemas'
import { useCancel } from '../utils'

export const groupCommand = defineCommand({
  subCommands: {
    add: defineCommand({
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
    }),

    list: defineCommand({
      meta: {
        alias: 'ls',
        description: 'List all package groups',
      },
      run: () => {},
    }),

    remove: defineCommand({
      meta: {
        alias: 'rm',
        description: 'Remove one or more package groups',
      },
      run: () => {},
    }),
  },
})
