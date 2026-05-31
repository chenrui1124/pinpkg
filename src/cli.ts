import { intro } from '@clack/prompts'
import { defineCommand, runMain } from 'citty'
import * as pc from 'picocolors'
import { name } from '../package.json'
import { configCommand } from './subcommands/config'
import { groupCommand } from './subcommands/group'
import { useCommand } from './subcommands/use'

const mainCommand = defineCommand({
  subCommands: {
    config: configCommand,
    group: groupCommand,
    use: useCommand,
  },
  default: 'use',
  setup: () => intro(pc.bgCyanBright(pc.black(` ${name} `))),
})

runMain(mainCommand)
