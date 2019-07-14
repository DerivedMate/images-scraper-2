import http from 'http'
import https from 'https'
import { Writable } from 'stream'

const rHttps = /^https:\/\//
const rHttp = /^http:\/\//
export const downloadFile = (url: string, dist: Writable) => {
  if (rHttps.test(url)) https.get(url, res => res.pipe(dist))
  else if (rHttp.test(url)) http.get(url, res => res.pipe(dist))
  else if (/data:\/\//.test(url)) dist.write(url)
}
