import { exec } from "child_process"
import { join } from 'path'

export const runner = (command: string) => {
  return new Promise((resolve, reject) => {
    const path = join(__dirname, "../../dockerfiles")
    const instance = exec(command, { cwd: path })

    instance.stdout?.on("data", (chunk: Buffer) => {
      console.log(`${chunk.toString()}`)
    })

    instance.stderr?.on("data", (chunk: Buffer) => {
      console.log(`${chunk.toString()}`)
    })

    instance.on("exit", (code) => {
      if (code === 0) {
        resolve(`successfully executed`)
      } else {
        reject(`non-zero error code`)
      }
    })
  })
}