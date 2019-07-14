import cl from 'cluster'
import { EventEmitter } from 'events'
import fs from 'fs'
import { cpus } from 'os'
import { resolve } from 'path'
import repl from 'repl'

interface ParalioConfiguration<Context = { [key: string]: any }> {
  max?: number
  string?: string[] | string
  workerPath: string
  context?: Context
  onstringLoaded?: (string: string) => string[]
}

export class Paralio extends EventEmitter {
  workers: number = 0
  input: [string, string][]
  _input: [string, string][] = []
  max: number
  workerPath: string

  constructor(input: [string, string][]) {
    super()
    this.input = input
    this.max = cpus().length
    this.workerPath = resolve(__dirname, "./worker")
    this.run()
  }

  on(event: 'start', listener: (app: Paralio) => any): any
  on(event: 'end', listener: (app: Paralio) => any): any
  on(
    event: 'consume',
    listener: (items: [string[], string | undefined]) => any
  ): any
  on(event: string, listener: (...args: any[]) => any): any {
    super.on(event, listener)
  }

  emit(event: 'start', data: Paralio): any
  emit(event: 'end', data: Paralio): any
  emit(event: 'consume', data: [[string, string][], [string, string] | undefined]): any
  emit(event: string, data: any): any {
    return super.emit(event, data)
  }

  consume() {
    const item = this._input.pop()
    this.emit('consume', [this._input, item])
    return item || null
  }

  end() {
    return this._input.length <= 0
  }

  run() {
    this._input = this.input.slice()
    this.initWorkers()
  }

  initWorkers() {
    cl.setupMaster({
      exec: this.workerPath,
    })
    for (let i = 0; i < this.max; i++) {
      if (this._input.length <= 0) break
      const wk = cl.fork()
      this.workers++

      wk.on('message', this.initOnMessage(wk))
      wk.send(this.package())
    }

    this.emit('start', this)
  }

  package(): [string, string] | null {
    return this.consume()
  }

  initOnMessage(w: cl.Worker) {
    return () => {
      if (this.end()) {
        w.kill()
        if (--this.workers <= 0) {
          this.emit('end', this)
        }
      } else {
        w.send(this.package())
      }
    }
  }
}
