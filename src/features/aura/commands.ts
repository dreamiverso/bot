import { Command } from "~/types"

export const aura: Command = {
  async builder(builder) {
    return builder.setName("aura").setDescription("Cambia tu aura")
  },
  async handler(interaction) {
    await interaction.reply("aura!!!!")
  },
}
