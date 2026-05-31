import * as v from 'valibot'
import { describe, expect, test } from 'vitest'
import { PackageSpec } from '../src/schemas'

describe('PackageSpec', () => {
  test('bare name', () => {
    expect(v.safeParse(PackageSpec(), 'nanoid').success).toBe(true)
  })

  test('scoped name', () => {
    expect(v.safeParse(PackageSpec(), '@scope/pkg').success).toBe(true)
  })

  test('with version', () => {
    expect(v.safeParse(PackageSpec(), 'nanoid@latest').success).toBe(true)
  })

  test('scoped with version', () => {
    expect(v.safeParse(PackageSpec(), '@scope/pkg@^2.0.0').success).toBe(true)
  })

  test('with flags', () => {
    expect(v.safeParse(PackageSpec(), 'nanoid#D').success).toBe(true)
  })

  test('with version and flags', () => {
    expect(v.safeParse(PackageSpec(), 'nanoid@1.0.0#DP').success).toBe(true)
  })

  test('scoped with version and flags', () => {
    expect(v.safeParse(PackageSpec(), '@scope/pkg@latest#D').success).toBe(true)
  })

  test('leading/trailing whitespace trimmed', () => {
    expect(v.safeParse(PackageSpec(), '  nanoid#D  ').success).toBe(true)
  })

  test('empty string', () => {
    expect(v.safeParse(PackageSpec(), '').success).toBe(false)
  })

  test('just spaces', () => {
    expect(v.safeParse(PackageSpec(), '   ').success).toBe(false)
  })

  test('uppercase letters', () => {
    expect(v.safeParse(PackageSpec(), 'NANOID').success).toBe(false)
  })

  test('leading dot', () => {
    expect(v.safeParse(PackageSpec(), '.nanoid').success).toBe(false)
  })

  test('leading underscore', () => {
    expect(v.safeParse(PackageSpec(), '_nanoid').success).toBe(false)
  })

  test('leading dash', () => {
    expect(v.safeParse(PackageSpec(), '-nanoid').success).toBe(false)
  })

  test('symbols in name', () => {
    expect(v.safeParse(PackageSpec(), 'nanoid!').success).toBe(false)
  })

  test('reserved name', () => {
    expect(v.safeParse(PackageSpec(), 'node_modules').success).toBe(false)
  })
})
