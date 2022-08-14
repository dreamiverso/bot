import fs from "fs"
import path from "path"
import { Client, Routes, REST, SlashCommandBuilder } from "discord.js"

import { env } from "~/utils"
import { CommandBuilderFunction, CommandHandlerFunction } from "~/types"

type CommandFileExports = {
  builder: CommandBuilderFunction
  handler: CommandHandlerFunction
}

type CommandWithResolvedBuilder = {
  builder: SlashCommandBuilder
  handler: CommandHandlerFunction
}

class Commands {
  public list: Awaited<CommandWithResolvedBuilder>[] = []

  public rest = new REST({ version: "10" })

  public async init(client: Client<false>) {
    this.rest.setToken(env.DISCORD_BOT_TOKEN)

    const dirents = await fs.promises.readdir(__dirname, {
      withFileTypes: true,
    })

    const commandFiles = dirents.filter(
      (dirent) =>
        dirent.isFile() &&
        dirent.name.endsWith(".ts") &&
        dirent.name !== path.basename(__filename)
    )

    for (const file of commandFiles) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { builder, handler }: CommandFileExports = require(`./${file.name}`)

      // TODO: validate with zod

      const commandWithResolvedBuilder = {
        builder: await builder(new SlashCommandBuilder()),
        handler,
      }

      this.list.push(commandWithResolvedBuilder)
    }

    this.rest.put(Routes.applicationCommands(env.DISCORD_APPLICATION_ID), {
      body: this.list.map((command) => command.builder.toJSON()),
    })

    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand()) return

      const command = this.list.find(
        (command) => command.builder.name === interaction.commandName
      )

      if (command) command.handler(interaction)
    })
  }
}

export default Commands
