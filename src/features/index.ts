/* eslint-disable @typescript-eslint/no-var-requires */

import { Client } from "discord.js"
import { fileURLToPath } from "url"
import path from "path"
import glob from "fast-glob"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import {
  constants,
  CreateCommandResult,
  CreateComponentResult,
  CreateHandlerResult,
  env,
  notifyError,
  sendMessageToChannel,
} from "~/utils"

const componentsMap = new Map<string, CreateComponentResult["handler"]>()
const commandsMap = new Map<string, CreateCommandResult["handler"]>()
const handlersMap = new Map<CreateHandlerResult["event"], CreateHandlerResult["handler"][]>() // prettier-ignore

/**
 * Reads content of files.
 * Requires a generic with the expected content type
 */
async function readContent<T>(
  kind: "command" | "component" | "handler",
  callback: (content: T) => void
) {
  const files = await glob(`${__dirname}/**/${kind}.*.ts`)

  files.forEach(async (file) => {
    const content = await import(file)
    if (content?.default) return callback(content.default as T)
  })
}

async function getComponents() {
  return readContent<CreateComponentResult>("component", ({ handler, ids }) => {
    if (!ids.length) throw Error("Missing component `ids`")
    ids.forEach((id) => componentsMap.set(id, handler))
  })
}

async function getCommands() {
  return readContent<CreateCommandResult>("command", ({ builder, handler }) => {
    commandsMap.set(builder.name, handler)
  })
}

async function getHandlers() {
  return readContent<CreateHandlerResult>("handler", ({ event, handler }) => {
    const otherEventHandlers = handlersMap.get(event)
    if (!otherEventHandlers) {
      handlersMap.set(event, [handler])
    } else {
      otherEventHandlers.push(handler)
    }
  })
}

function initHandlers(client: Client<true>) {
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

function initInteractions(client: Client<true>) {
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() || interaction.isAutocomplete()) {
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
      if (!handler) return

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
    }
  })
}

export async function bootstrap(client: Client<true>) {
  await Promise.all([getComponents(), getCommands(), getHandlers()])

  initHandlers(client)
  initInteractions(client)

  if (env.NODE_ENV !== "production") return

  sendMessageToChannel(
    client,
    constants.CHANNEL_ID.BOT_DEBUG,
    `Acaban de enchufarme (${new Date().toISOString()})`
  )
}
