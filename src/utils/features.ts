import {
  ClientEvents,
  CommandInteraction,
  ComponentBuilder,
  Interaction,
  ModalBuilder,
  SlashCommandBuilder,
} from "discord.js"

/**
 * TODO: Documentation
 * TODO: The `Builder` generic is here because I think we could use it to narrow the interaction type
 */
export function createComponent<
  Builder extends ComponentBuilder | ModalBuilder
>(builder: Builder, handler: (interaction: Interaction) => void) {
  const builderString = JSON.stringify(builder.toJSON())
  const customIdMatch = builderString.match(/(?<="custom_id":")(.+?)(?=",)/g)

  return {
    builder,
    handler,
    customId: customIdMatch && customIdMatch[0],
  }
}

export type CreateComponent = typeof createComponent
export type CreateComponentResult = ReturnType<CreateComponent>

/**
 * TODO: Documentation
 */
export function createCommand(
  builder: SlashCommandBuilder,
  handler: (interaction: CommandInteraction) => void
) {
  return {
    builder,
    handler,
  }
}

export type CreateCommand = typeof createCommand
export type CreateCommandResult = ReturnType<CreateCommand>

/**
 * TODO: Documentation
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
