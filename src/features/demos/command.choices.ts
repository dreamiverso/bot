import { SlashCommandBuilder } from "discord.js"

import { createCommand, wait } from "~/utils"

const builder = new SlashCommandBuilder()
  .setName("gif")
  .setDescription("Sends a random gif!")
  .addStringOption((option) =>
    option
      .setName("category")
      .setDescription("The gif category")
      .setRequired(true)
      .addChoices(
        { name: "Funny", value: "gif_funny" },
        { name: "Meme", value: "gif_meme" },
        { name: "Movie", value: "gif_movie" }
      )
  )

export default createCommand(builder, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  await interaction.reply("Pong!")
  await wait(2000)
  await interaction.editReply("Pong again!")
})
