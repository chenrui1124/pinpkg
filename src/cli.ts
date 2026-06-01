import { intro } from '@clack/prompts'
import { defineCommand, runMain } from 'citty'
import * as pc from 'picocolors'
import { description, displayName, version } from '../package.json'
import { configCommand } from './subcommands/config'
import { groupCommand } from './subcommands/group'
import { restoreCommand } from './subcommands/restore'
import { useCommand } from './subcommands/use'

const mainCommand = defineCommand({
  meta: {
    name: displayName,
    version,
    description,
  },
  subCommands: {
    config: configCommand,
    group: groupCommand,
    restore: restoreCommand,
    use: useCommand,
  },
  default: 'use',
  setup: () => intro(pc.bgCyanBright(pc.black(` ${displayName} `))),
})

runMain(mainCommand)
