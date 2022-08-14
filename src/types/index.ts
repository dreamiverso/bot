import {
  CacheType,
  ClientEvents,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js"

/**
 * Any exported function from `src/handlers/*.ts` files
 */
export type Handler<T extends keyof ClientEvents> = (
  ...args: ClientEvents[T]
) => Promise<void>

/**
 * The exported `builder` function from `src/commands/*.ts` files
 */
export type CommandBuilderFunction = (
  builder: SlashCommandBuilder
) => Promise<SlashCommandBuilder>

/**
 * The exported `execute` function from `src/commands/*.ts` files
 */
export type CommandHandlerFunction = (
  interaction: CommandInteraction<CacheType>
) => Promise<void>