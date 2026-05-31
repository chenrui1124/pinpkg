import { defineCommand } from 'citty'

export const configCommand = defineCommand({
  subCommands: {
    edit: defineCommand({
      meta: {
        description: 'Edit the configuration file',
      },
      run: () => {},
    }),
  },
})
