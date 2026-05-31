import { defineCommand, runMain } from 'citty'
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
})

runMain(mainCommand)
