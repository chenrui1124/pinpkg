import { defineCommand } from 'citty'

export const useCommand = defineCommand({
  meta: {
    description: 'Select one or more package groups and add their packages to the current project',
  },
})
