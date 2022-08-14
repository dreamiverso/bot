import fs from "fs"
import path from "path"
import { Client } from "discord.js"

/**
 * Simplified `Handler` type as apparently TS suffers using the real one here
 */
type Handler = (...args: unknown[]) => Promise<void>

class Handlers {
  public list: Record<string, Handler[]> = {}

  public async init(client: Client<false>) {
    const dirents = await fs.promises.readdir(__dirname, {
      withFileTypes: true,
    })

    const handlerFiles = dirents.filter(
      (dirent) =>
        dirent.isFile() &&
        dirent.name.endsWith(".ts") &&
        dirent.name !== path.basename(__filename)
    )

    for (const file of handlerFiles) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const handlers: Record<string, Handler> = require(`./${file.name}`)

      // TODO: validate with zod

      Object.entries(handlers).forEach(([event, handler]) => {
        if (event in this.list) {
          this.list[event].push(handler)
        } else {
          this.list[event] = [handler]
        }
      })
    }

    for (const [event, handlers] of Object.entries(this.list)) {
      client.on(event, (...args) => {
        handlers.forEach((handler) => handler(...args))
      })
    }
  }
}

export default Handlers
