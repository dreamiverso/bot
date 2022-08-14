import { CommandBuilderFunction, CommandHandlerFunction } from "~/types"

export const builder: CommandBuilderFunction = async (builder) => {
  return builder.setName("aura").setDescription("Cambia tu rol")
}

export const handler: CommandHandlerFunction = async (interaction) => {
  await interaction.reply("pong!")
}
