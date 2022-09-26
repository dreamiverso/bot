import {
  AutocompleteInteraction,
  ClientEvents,
  CommandInteraction,
  ComponentBuilder,
  ContextMenuCommandBuilder,
  Interaction,
  ModalBuilder,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js"

/**
 * TODO: TSDoc
 */
export function createComponent<
  Builder extends ComponentBuilder | ModalBuilder | ContextMenuCommandBuilder
>(builder: Builder, handler: (interaction: Interaction) => void) {
  const builderString = JSON.stringify(builder.toJSON())
  const customIdMatch = builderString.match(/(?<="custom_id":")(.+?)(?=",)/g)

  if (!customIdMatch?.length) {
    throw Error("Missing component custom id")
  }

  return {
    builder,
    handler,
    customId: customIdMatch[0],
  }
}

export type CreateComponent = typeof createComponent
export type CreateComponentResult = ReturnType<CreateComponent>

type SlashCommandBuilderWithoutSubcommands = Omit<
  SlashCommandBuilder,
  "addSubcommand" | "addSubcommandGroup"
>

export function createCommand<
  Builder extends
    | SlashCommandBuilder
    | SlashCommandBuilderWithoutSubcommands
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandOptionsOnlyBuilder
>(
  builder: Builder,
  handler: (interaction: CommandInteraction | AutocompleteInteraction) => void
) {
  return {
    builder,
    handler,
  }
}

/**
 * TODO: TSDoc
 */
export type CreateCommand = typeof createCommand
export type CreateCommandResult = ReturnType<CreateCommand>

/**
 * TODO: TSDoc
 */
export function createHandler<Event extends keyof ClientEvents>(
  event: Event,
  handler: (...args: ClientEvents[Event]) => void
) {
  return {
    event,
    handler,
  }
}

export type CreateHandler = typeof createHandler
export type CreateHandlerResult = ReturnType<CreateHandler>
