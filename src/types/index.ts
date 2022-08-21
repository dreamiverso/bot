import {
  CacheType,
  ClientEvents,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js"

/**
 * An event handler from feature files
 */
export type Handler<T extends keyof ClientEvents> = (
  ...args: ClientEvents[T]
) => Promise<void>

export type CommandBuilder = (
  builder: SlashCommandBuilder
) => Promise<SlashCommandBuilder>

export type CommandHandler = (
  interaction: CommandInteraction<CacheType>
) => Promise<void>

/**
 * An exported command object from feature files
 */
export type Command = {
  builder: CommandBuilder
  handler: CommandHandler
}
