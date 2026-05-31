import { describe, expect, test } from 'vitest'
import { parsePackageSpec } from '../src/utils'

describe('parsePackageSpec', () => {
  test('bare package name', () => {
    expect(parsePackageSpec('nanoid')).toEqual(['nanoid', '', ''])
  })

  test('package name with version (tag)', () => {
    expect(parsePackageSpec('nanoid@latest')).toEqual(['nanoid', 'latest', ''])
  })

  test('package name with version (semver)', () => {
    expect(parsePackageSpec('nanoid@3.3.12')).toEqual(['nanoid', '3.3.12', ''])
  })

  test('scoped package', () => {
    expect(parsePackageSpec('@scope/pkg')).toEqual(['@scope/pkg', '', ''])
  })

  test('scoped package with version', () => {
    expect(parsePackageSpec('@scope/pkg@latest')).toEqual(['@scope/pkg', 'latest', ''])
  })

  test('scoped package with semver range', () => {
    expect(parsePackageSpec('@scope/pkg@^2.0.0')).toEqual(['@scope/pkg', '^2.0.0', ''])
  })

  test('package with flag', () => {
    expect(parsePackageSpec('nanoid#D')).toEqual(['nanoid', '', 'D'])
  })

  test('package with multiple flags', () => {
    expect(parsePackageSpec('nanoid#DP')).toEqual(['nanoid', '', 'DP'])
  })

  test('package with version and flag', () => {
    expect(parsePackageSpec('nanoid@latest#D')).toEqual(['nanoid', 'latest', 'D'])
  })

  test('package with version and multiple flags', () => {
    expect(parsePackageSpec('nanoid@3.3.12#DP')).toEqual(['nanoid', '3.3.12', 'DP'])
  })

  test('scoped package with flag', () => {
    expect(parsePackageSpec('@scope/pkg#D')).toEqual(['@scope/pkg', '', 'D'])
  })

  test('scoped package with version and flag', () => {
    expect(parsePackageSpec('@scope/pkg@latest#D')).toEqual(['@scope/pkg', 'latest', 'D'])
  })

  test('scoped package with version and multiple flags', () => {
    expect(parsePackageSpec('@scope/pkg@^1.0.0#DP')).toEqual(['@scope/pkg', '^1.0.0', 'DP'])
  })

  test('no flags when # has empty trailing', () => {
    expect(parsePackageSpec('nanoid#')).toEqual(['nanoid', '', ''])
  })

  test('nested scope-like path is not scoped', () => {
    expect(parsePackageSpec('foo@bar')).toEqual(['foo', 'bar', ''])
  })
})
