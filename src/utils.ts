import { cancel, isCancel } from '@clack/prompts'

/**
 * @test ./test/utils.test.ts
 */
export function parsePackageSpec(
  packName: string
): readonly [name: string, version: string, flags: string] {
  const [nameAndVersion, flags = ''] = packName.split('#')
  const atIndex = nameAndVersion.lastIndexOf('@')
  const [name, version] =
    atIndex === 0 || atIndex === -1
      ? [nameAndVersion, '']
      : [nameAndVersion.slice(0, atIndex), nameAndVersion.slice(atIndex + 1)]

  return [name, version, flags] as const
}

export function useCancel<T>(prompt: T | symbol) {
  if (isCancel(prompt)) {
    cancel('Operation cancelled.')
    process.exit(0)
  }
  return prompt
}
