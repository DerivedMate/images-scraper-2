import fs from 'fs-extra'
import { resolve } from 'path'

export const loadURLs = () => {
  const arg = process.argv[2]
  const isURL = new RegExp('https?://w+.w{2,3}.*')
  if (typeof arg === 'undefined')
    throw new Error(
      `Did you forget to pass path to the urls file? I'm outta here!`
    )
  return fs
    .readFile(resolve(__dirname, arg), 'utf-8')
    .then(JSON.parse)
    .then(json => {
      if (!Array.isArray(json))
        throw new Error(
          "You gave me something else than a string array! I'm outta here!"
        )
      return json as string[]
    })
    .catch(err => {
      debugger
      return []
    })
}

export const getDist = () => {
  const arg = process.argv[3]
  if (typeof arg === 'undefined')
    throw new Error(
      "Ya forgot to gimme the dist path... the 2nd arg... I'm outta here!"
    )
  return resolve(__dirname, arg) as string
}
