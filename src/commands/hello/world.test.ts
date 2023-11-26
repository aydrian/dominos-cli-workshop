import {stdout} from 'stdout-stderr'
import {describe, expect, test} from 'vitest'

import World from './world.js'

describe('hello world', () => {
  test('runs hello world cmd', async () => {
    stdout.start()
    await World.run(['hello:world'])
    stdout.stop()

    expect(stdout.output).toContain('hello world!')
  })
})
