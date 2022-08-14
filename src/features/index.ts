import fs from "fs"
import path from "path"
import { Client } from "discord.js"

/**
 * Simplified `Handler` type as apparently TS suffers using the real one here
 */
type FeatureHandler = (...args: unknown[]) => Promise<void>

class Features {
  public list: Record<string, FeatureHandler[]> = {}

  public async init(client: Client<false>) {
    const dirents = await fs.promises.readdir(__dirname, {
      withFileTypes: true,
    })

    const featureFiles = dirents.filter(
      (dirent) =>
        dirent.isFile() &&
        dirent.name.endsWith(".ts") &&
        dirent.name !== path.basename(__filename)
    )

    for (const file of featureFiles) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const features: Record<string, FeatureHandler> = require(`./${file.name}`)

      // TODO: validate with zod

      Object.entries(features).forEach(([event, feature]) => {
        if (event in this.list) {
          this.list[event].push(feature)
        } else {
          this.list[event] = [feature]
        }
      })
    }

    for (const [event, features] of Object.entries(this.list)) {
      client.on(event, (...args) => {
        features.forEach((handler) => handler(...args))
      })
    }
  }
}

export default Features
