import { cancel, isCancel } from '@clack/prompts'
import { match } from 'ts-pattern'
import validatePackageName from 'validate-npm-package-name'

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

export function isValidPackageSpec(spec: string) {
  const [name] = parsePackageSpec(spec)
  return validatePackageName(name).validForNewPackages
}

export function cleanPackageSpec(spec: string) {
  return spec
    .trim()
    .replace(/@+(?=#|$)/g, '')
    .replace(/#(.*)/, (_, flags) =>
      match(flags.replace(/[^D]/g, ''))
        .with('', () => '')
        .otherwise(cleaned => `#${cleaned}`)
    )
}

export function useCancel<T>(prompt: T | symbol) {
  if (isCancel(prompt)) {
    cancel('Operation cancelled.')
    process.exit(0)
  }
  return prompt
}
