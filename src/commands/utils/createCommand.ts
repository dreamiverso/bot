import { SlashCommandBuilder } from "@discordjs/builders"
import { CacheType, CommandInteraction } from "discord.js"

export type CommandBuilderFunction = (
  builder: SlashCommandBuilder
) => Promise<SlashCommandBuilder>

export type CommandExecuteFunction = (
  interaction: CommandInteraction<CacheType>
) => Promise<void>

/**
 * A type-safe shim for Discord's `SlashCommandBuilder`.
 * ```ts
 * import { createCommand } from "./utils"
 *
 * export default createCommand({
 *   async builder(builder) {
 *     return builder.setName("name").setDescription("description")
 *   },
 *   async execute(interaction) {
 *     await interaction.reply("foo")
 *   },
 *  })
 * ```
 *
 * When building complex commands you might find more readable to declare
 * the `builder` and `execute` functions outside of `createCommand`.
 * You can retain typings using `CommandBuilderFunction` and `CommandExecuteFunction` types.
 *
 * ```ts
 * import {
 *   createCommand,
 *   CommandBuilderFunction,
 *   CommandExecuteFunction,
 * } from "./utils"
 *
 * const builder: CommandBuilderFunction = async (builder) => {
 *   // Long, complex logic
 *   return builder.setName("name").setDescription("description")
 * }
 *
 * const execute: CommandExecuteFunction = async (interaction) => {
 *   // Long, complex logic
 *   await interaction.reply("foo")
 * }
 *
 * export default createCommand({
 *   builder,
 *   execute,
 * })
 * ```
 */
export async function createCommand({
  builder,
  execute,
}: {
  /**
   * Receives an `SlashCommandBuilder` instance. Use it to build your command.
   * Supports async operations in order to mirror `execute` functionality.
   */
  builder: CommandBuilderFunction
  /**
   * Called when the command is successfully invoked from the Discord server.
   */
  execute: CommandExecuteFunction
}) {
  const slashCommandBuilder = new SlashCommandBuilder()

  return {
    builder: await builder(slashCommandBuilder),
    execute,
  }
}

export type CommandCreator = ReturnType<typeof createCommand>
