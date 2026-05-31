import * as v from 'valibot'
import validatePackageName from 'validate-npm-package-name'
import { parsePackageSpec } from './utils'

export const PackageSpec = v.pipe(
  v.string(),
  v.trim(),
  v.check(spec => {
    const [name] = parsePackageSpec(spec)
    return validatePackageName(name).validForNewPackages
  })
)

export const ParsedConfig = v.pipe(
  v.string(),
  v.parseJson(),
  v.object({
    groups: v.array(
      v.object({
        name: v.pipe(v.string(), v.trim()),
        packages: v.array(PackageSpec),
      })
    ),
  })
)
export type ParsedConfig = v.InferOutput<typeof ParsedConfig>
