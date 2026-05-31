import { log } from '@clack/prompts'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { match } from 'ts-pattern'
import * as v from 'valibot'
import { name } from '../package.json'
import { ParsedConfig } from './schemas'

const CONFIG_DIR_PATH = join(homedir(), `.${name}`)

export const CONFIG_PATH = join(CONFIG_DIR_PATH, 'config.json')

export const DEFAULT_CONFIG: ParsedConfig = { groups: [] } as const

function readConfig() {
  try {
    const content = readFileSync(CONFIG_PATH, 'utf-8')
    return match(v.safeParse(ParsedConfig, content))
      .with({ success: true }, ({ output }) => output)
      .with({ success: false }, ({ issues }) => {
        log.error(v.summarize(issues))
        process.exit(1)
      })
      .exhaustive()
  } catch {
    try {
      mkdirSync(CONFIG_DIR_PATH, { recursive: true })
    } catch (error) {
      log.error(`Failed to create directory at ${CONFIG_DIR_PATH}: ${(error as Error).message}`)
      process.exit(1)
    }
    try {
      writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf-8')
    } catch (error) {
      log.error(`Failed to write JSON file at ${CONFIG_PATH}: ${(error as Error).message}`)
      process.exit(1)
    }
    return DEFAULT_CONFIG
  }
}

export const config = new Proxy(readConfig(), {
  get(target, prop) {
    return Reflect.get(target, prop)
  },
  set(target, key, value) {
    if (Reflect.has(target, key)) {
      const result = Reflect.set(target, key, value)
      writeFileSync(CONFIG_PATH, JSON.stringify(target, null, 2), 'utf-8')
      return result
    }
    return false
  },
  deleteProperty() {
    return false
  },
})
