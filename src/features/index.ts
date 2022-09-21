/* eslint-disable @typescript-eslint/no-var-requires */

import { Client } from "discord.js"
import glob from "fast-glob"

import {
  CreateCommandResult,
  CreateComponentResult,
  CreateHandlerResult,
  notifyError,
  sendMessageToChannel,
} from "~/utils"
import { CHANNEL_ID } from "~/utils/constants"

const componentsMap = new Map<string, CreateComponentResult["handler"]>()
const commandsMap = new Map<string, CreateCommandResult["handler"]>()
const handlersMap = new Map<
  CreateHandlerResult["event"],
  CreateHandlerResult["handler"][]
>()

/**
 * Reads content of files.
 * Requires a generic with the expected content type
 */
async function readContent<T>(
  directory: string,
  callback: (content: T) => void
) {
  const files = await glob(`${__dirname}/**/${directory}/*.ts`)

  files.forEach((file) => {
    const content: T = require(file).default
    return callback(content)
  })
}

async function getComponents() {
  readContent<CreateComponentResult>("components", ({ handler, customId }) => {
    if (!customId) throw Error("Missing component `customId`")
    componentsMap.set(customId, handler)
  })
}

async function getCommands() {
  readContent<CreateCommandResult>("commands", ({ builder, handler }) => {
    commandsMap.set(builder.name, handler)
  })
}

async function getHandlers() {
  readContent<CreateHandlerResult>("handlers", ({ event, handler }) => {
    const otherEventHandlers = handlersMap.get(event)
    if (!otherEventHandlers) {
      handlersMap.set(event, [handler])
    } else {
      otherEventHandlers.push(handler)
    }
  })
}

function handleEvents(client: Client<boolean>) {
  handlersMap.forEach((handlers, event) => {
    client.on(event, (...args) => {
      handlers.forEach((handler) => {
        try {
          handler(...args)
        } catch (error) {
          notifyError(client, {
            kind: "Event handler",
            event: event,
            handler: handler.name,
            error: error instanceof Error ? error.message : String(error),
          })
        }
      })
    })
  })
}

function handleInteractions(client: Client<boolean>) {
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
      const command = commandsMap.get(interaction.commandName)
      if (!command) throw Error(`Could not find command ${command}`)

      try {
        return command(interaction)
      } catch (error) {
        return notifyError(client, {
          kind: "Command handler",
          user: interaction.user.username,
          command: interaction.commandName,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    } else if ("customId" in interaction) {
      const handler = componentsMap.get(interaction.customId)
      if (!handler) throw Error(`Missing handler ${interaction.customId}`)

      try {
        handler(interaction)
      } catch (error) {
        notifyError(client, {
          kind: "Component handler",
          user: interaction.user.username,
          customId: interaction.customId,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    } else {
      notifyError(client, {
        name: "Unhandled interaction type",
        value: JSON.stringify(interaction.toJSON()),
      })
    }
  })
}

export async function bootstrap(client: Client<boolean>) {
  await Promise.all([getComponents(), getCommands(), getHandlers()])

  handleEvents(client)
  handleInteractions(client)

  sendMessageToChannel(
    client,
    CHANNEL_ID.BOT_DEBUG,
    `Acaban de enchufarme (${new Date().toISOString()})`
  )
}
