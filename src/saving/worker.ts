import { createFile } from '../output'
import { downloadFile } from '../http'

export abstract class Worker<
  MessageType = string,
  ContextType = { [key: string]: any }
> {
  context: { [key: string]: any } | ContextType = {}

  constructor() {
    process.on('newListener', l => {
      // process.stdout.write(`[Worker]> New worker #${process.pid} connected!`)
      console.log(`[Worker]> New worker #${process.pid} connected!`)
    })

    process.on('message', async (msg: MessageType) => {
      if (!msg) return
      const p = this.onMessage(msg)
      let res =
        p instanceof Promise
          ? await (p as Promise<any>).catch((err: Error) => {
              console.log(
                `[W:${process.pid}]> ERROR: "${err.message}"\nSTACK: ${
                  err.stack
                };\n MESSAGE: ${msg};\n Bailing out!`
              )
              process.disconnect()
            })
          : p
      process.send && process.send(res)
    })
  }

  onMessage(msg: MessageType): Promise<any> | void {
    return void 0
  }
}

new (class extends Worker<[string, string]> {
  onMessage([url, dist]: [string, string]) {
    return new Promise(res => {
      const file = createFile(dist)
      downloadFile(url, file)
      file.on('close', () => res("Here's a postcard!"))
    })
  }
})()
