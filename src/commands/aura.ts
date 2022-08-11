import { createCommand } from "./utils"

export default createCommand({
  async builder(builder) {
    return builder.setName("aura").setDescription("Cambia tu rol")
  },
  async execute(interaction) {
    await interaction.reply("pong!")
  },
})
