import { CommandBuilder, CommandHandler } from "~/types"

export const builder: CommandBuilder = async (builder) => {
  return builder.setName("aura").setDescription("Cambia tu rol")
}

export const handler: CommandHandler = async (interaction) => {
  await interaction.reply("pong!")
}
