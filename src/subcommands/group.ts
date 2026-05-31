import { defineCommand } from 'citty'

export const groupCommand = defineCommand({
  subCommands: {
    add: defineCommand({
      meta: {
        description: 'Add a new package group',
      },
      run: () => {},
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
