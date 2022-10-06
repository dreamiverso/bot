import { ChannelType, ChatInputCommandInteraction } from "discord.js"

export async function handleClearSubcommand(
  interaction: ChatInputCommandInteraction
) {
  if (!interaction.isChatInputCommand()) return

  if (!interaction.channel) {
    throw Error("Expected channel property in interaction")
  }

  if (interaction.channel.type !== ChannelType.GuildText) {
    throw Error("Unexpected channel type (maybe we should support it)")
  }

  const amount = interaction.options.getInteger("cantidad")

  if (!amount) {
    return interaction.reply({
      content: `¡Debes especificar un número mayor a cero como cantidad!`,
      ephemeral: true,
    })
  }

  await interaction.channel.bulkDelete(amount, true)

  return interaction.reply({
    content: `¡Hecho! 🥳 He eliminado ${amount} ${
      amount === 1 ? "mensaje" : "mensajes"
    }`,
    ephemeral: true,
  })
}
