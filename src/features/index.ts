/* eslint-disable @typescript-eslint/no-var-requires */

import { Client, REST } from "discord.js"
import glob, { Entry } from "fast-glob"

import {
  CreateComponentResult,
  CreateCommandResult,
  CreateHandlerResult,
  env,
  notifyError,
} from "~/utils"

class Features {
  rest = new REST({ version: "10" }).setToken(env.DISCORD_BOT_TOKEN)

  client: Client

  #components = new Map<string, CreateComponentResult["handler"]>()

  #commands = new Map<string, CreateCommandResult["handler"]>()

  #handlers = new Map<
    CreateHandlerResult["event"],
    CreateHandlerResult["handler"][]
  >()

  constructor(client: Client) {
    this.client = client
    this.#init()
  }

  async #readAndProcess(directory: string, callback: (entry: Entry) => void) {
    const entries = await glob(`${__dirname}/**/${directory}/*.ts`, {
      objectMode: true,
    })

    return entries.map(callback)
  }

  async #processComponentFiles() {
    return this.#readAndProcess("components", (entry) => {
      const { handler, customId } = require(entry.path)
        .default as CreateComponentResult

      if (customId) this.#components.set(customId, handler)
    })
  }

  async #processCommandFiles() {
    return this.#readAndProcess("commands", (entry) => {
      const content = require(entry.path).default as CreateCommandResult
      this.#commands.set(content.builder.name, content.handler)
    })
  }

  async #processHandlerFiles() {
    return this.#readAndProcess("handlers", (entry) => {
      const { event, handler } = require(entry.path)
        .default as CreateHandlerResult

      const otherEventHandlers = this.#handlers.get(event)
      if (!otherEventHandlers) this.#handlers.set(event, [handler])
      else otherEventHandlers.push(handler)
    })
  }

  async #init() {
    await Promise.all([
      this.#processComponentFiles(),
      this.#processCommandFiles(),
      this.#processHandlerFiles(),
    ])

    this.#handlers.forEach((handlers, event) => {
      this.client.on(event, (...args) => {
        handlers.forEach((handler) => {
          try {
            handler(...args)
          } catch (error) {
            notifyError(this.client, {
              kind: "Event handler",
              event: event,
              handler: handler.name,
              error: error instanceof Error ? error.message : String(error),
            })
          }
        })
      })
    })

    this.client.on("interactionCreate", async (interaction) => {
      if (interaction.isCommand()) {
        const command = this.#commands.get(interaction.commandName)
        if (!command) throw Error(`Could not find command ${command}`)

        try {
          command(interaction)
        } catch (error) {
          notifyError(this.client, {
            kind: "Command handler",
            user: interaction.user.username,
            command: interaction.commandName,
            error: error instanceof Error ? error.message : String(error),
          })
        }
      } else if ("customId" in interaction) {
        const handler = this.#components.get(interaction.customId)
        if (handler) handler(interaction)
      } else {
        notifyError(this.client, {
          name: "Unhandled interaction type",
          value: JSON.stringify(interaction.toJSON()),
        })
      }
    })
  }
}

export default Features
