import pptr from 'puppeteer'
import { loadURLs, getDist } from './input'
import { hash, inProd, filterReps } from './helpers'
import { downloadFile } from './http'
import { createFile } from './output'
import { resolve } from 'path'
import { Paralio } from './saving/master'
;(async () => {
  const urls: string[] = await loadURLs()
  const outDist = getDist()
  const browser = await pptr.launch({
    headless: inProd,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  })

  await Promise.all(
    urls.map(
      async url =>
        new Promise<[string, string][]>(async res => {
          const page = await browser.newPage()
          const images: [string, string][] = []
          page.on('response', e => {
            if (e.request().resourceType() !== 'image') return
            const rImageType = /image\/(\w+)/
            const contentType = e.headers()['content-type']
            if (e.ok()) {
              const matches = rImageType.exec(contentType)
              images.push([e.url(), matches ? matches[1] : 'jpg'])
            }
          })
          page.on('load', () => {
            res(filterReps(images))
            // if (!page.isClosed()) page.close()
          })
          await page
            .goto(url, {
              timeout: 0,
              waitUntil: 'domcontentloaded',
            })
            .then(() =>
              page.evaluate(() => {
                for(let i = 1; i < 51; i++) {
                  window.setTimeout(() => {
                    document.documentElement.scrollBy(0, innerHeight / 2)
                  }, 150*i)
                }
              })
            )
        })
    )
  )
    .then(x => {
      browser.close()
      return x
    })
    .then(sites => {
      const input = sites.reduce((acc, arr) => {
        acc.push(
          ...arr.map(
            ([url, ext]) =>
              [url, resolve(outDist, `${hash()}.${ext}`)] as [string, string]
          )
        )
        return acc
      }, [])
      const master = new Paralio(input)
      master.on('consume', ([xs, x]) => {
        console.log(x)
        if(xs.length === 0) {
          setTimeout(() => {
            console.log("I'm done!")
            process.exit(0)
          }, 4000)
        }
      })
    })
})()
