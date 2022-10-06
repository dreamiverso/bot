import { ChatInputCommandInteraction } from "discord.js"

export async function handleSendSubcommand(
  interaction: ChatInputCommandInteraction
) {
  if (!interaction.isChatInputCommand()) return

  const content = interaction.options.getString("contenido")

  if (!content) {
    return interaction.reply({
      content: `¡Debes escribir un mensaje!`,
      ephemeral: true,
    })
  }

  if (!interaction.channel) {
    throw Error("Expected channel property in interaction")
  }

  await Promise.all([
    interaction.channel.send(content),
    interaction.reply({
      content: `¡Hecho! 🥳`,
      ephemeral: true,
    }),
  ])
}
