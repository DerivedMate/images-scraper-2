import { Writable } from 'stream'
import fs from 'fs-extra'

export const createFile = (dist: string): Writable =>
  fs.createWriteStream(dist, {
    encoding: 'utf-8',
  })
