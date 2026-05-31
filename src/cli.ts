import { intro } from '@clack/prompts'
import { defineCommand, runMain } from 'citty'
import * as pc from 'picocolors'
import { name } from '../package.json'
import { configEditCommand } from './subcommands/config'
import { groupAddCommand, groupListCommand, groupRemoveCommand } from './subcommands/group'
import { restoreCommand } from './subcommands/restore'
import { useCommand } from './subcommands/use'

const mainCommand = defineCommand({
  subCommands: {
    config: defineCommand({
      subCommands: {
        edit: configEditCommand,
      },
    }),
    group: defineCommand({
      subCommands: {
        add: groupAddCommand,
        list: groupListCommand,
        remove: groupRemoveCommand,
      },
    }),
    restore: restoreCommand,
    use: useCommand,
  },
  default: 'use',
  setup: () => intro(pc.bgCyanBright(pc.black(` ${name} `))),
})

runMain(mainCommand)
