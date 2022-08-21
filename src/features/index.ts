/* eslint-disable @typescript-eslint/no-var-requires */

import fs from "fs"
import path from "path"
import { Client, Routes, SlashCommandBuilder, REST } from "discord.js"

import { env } from "~/utils"
import { Command, CommandHandler } from "~/types"

type ProcessedCommand = {
  builder: SlashCommandBuilder
  handler: CommandHandler
}

/**
 * Simplified `Handler` type as apparently TS suffers using the real one here
 */
type FeatureHandler = (...args: unknown[]) => Promise<void>

class Features {
  public rest = new REST({ version: "10" })

  public handlersList: Record<string, FeatureHandler[]> = {}

  public commandsList: ProcessedCommand[] = []

  private processCommandsFile(file: string) {
    const commands: Record<string, Command> = require(file)

    Object.values(commands).forEach(async (command) => {
      const builder = await command.builder(new SlashCommandBuilder())

      const handler: CommandHandler = async (interaction) => {
        try {
          command.handler(interaction)
        } catch (error) {
          console.log(error)
        }
      }

      this.commandsList.push({ builder, handler })
    })
  }

  private processHandlersFile(file: string) {
    const handlers: Record<string, FeatureHandler> = require(file)

    Object.entries(handlers).forEach(([event, handler]) => {
      if (event in this.handlersList) {
        this.handlersList[event].push(handler)
      } else {
        this.handlersList[event] = [handler]
      }
    })
  }

  private registerCommands() {
    this.rest.put(Routes.applicationCommands(env.DISCORD_APPLICATION_ID), {
      body: this.commandsList.map((command) => command.builder.toJSON()),
    })
  }

  private registerHandlers(client: Client<false>) {
    for (const [event, features] of Object.entries(this.handlersList)) {
      client.on(event, (...args) => {
        features.forEach((handler) => {
          try {
            handler(...args)
          } catch (error) {
            console.warn(`Error on ${event} handler ${handler.name}: ${error}`)
          }
        })
      })
    }
  }

  public async init(client: Client<false>) {
    this.rest.setToken(env.DISCORD_BOT_TOKEN)

    const dirents = await fs.promises.readdir(__dirname, {
      withFileTypes: true,
    })

    const directories = dirents.filter((dirent) => dirent.isDirectory())

    await Promise.all(
      directories.map(async (directory) => {
        const directoryPath = path.join(__dirname, directory.name)
        const files = await fs.promises.readdir(directoryPath)
        const commandsFile = files.find((file) => file === "commands.ts")
        const handlersFile = files.find((file) => file === "handlers.ts")

        if (commandsFile) {
          this.processCommandsFile(path.join(directoryPath, commandsFile))
        }

        if (handlersFile) {
          this.processHandlersFile(path.join(directoryPath, handlersFile))
        }
      })
    )

    this.registerCommands()
    this.registerHandlers(client)
  }
}

export default Features
