import {stdout} from 'stdout-stderr'
import {describe, expect, test} from 'vitest'

import Hello from './index.js'

describe('hello', () => {
  test('runs hello cmd', async () => {
    stdout.start()
    await Hello.run(['friend', '--from=oclif'])
    stdout.stop()

    expect(stdout.output).toContain('hello friend from oclif!')
  })
})
