import fs from "fs"
import path from "path"
import { REST, Routes } from "discord.js"

import { env } from "~/utils"

import { CommandCreator } from "./utils"

const currentFileName = path.basename(__filename)

class Commands {
  public list: Awaited<CommandCreator>[] = []
  public rest = new REST({ version: "10" })

  /**
   * Syncs all `.ts` files on the root of the `commands` directory with Discord.
   */
  public async sync() {
    this.rest.setToken(env.DISCORD_BOT_TOKEN)

    const dirents = await fs.promises.readdir(__dirname, {
      withFileTypes: true,
    })

    const commandFiles = dirents.filter(
      (dirent) =>
        dirent.isFile() &&
        dirent.name.endsWith(".ts") &&
        dirent.name !== currentFileName
    )

    for (const file of commandFiles) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const command: CommandCreator = require(`./${file.name}`).default
      const resolvedCommand = await command
      this.list.push(resolvedCommand)
    }

    this.rest.put(Routes.applicationCommands(env.DISCORD_APPLICATION_ID), {
      body: this.list.map((command) => command.builder.toJSON()),
    })

    return this.list
  }
}

export default Commands
