import { SlashCommandBuilder } from "discord.js"

import { createCommand, wait } from "~/utils"

// prettier-ignore
const builder = new SlashCommandBuilder()
	.setName('questionnaire')
	.setDescription('Asks you a series of questions!')
	.addStringOption(option => option.setName('input').setDescription('Your name?'))
	.addBooleanOption(option => option.setName('bool').setDescription('True or False?'))
	.addUserOption(option => option.setName('target').setDescription('Closest friend?'))
	.addChannelOption(option => option.setName('destination').setDescription('Favourite channel?'))
	.addRoleOption(option => option.setName('role').setDescription('Least favourite role?'))
	.addIntegerOption(option => option.setName('int').setDescription('Sides to a square?'))
	.addNumberOption(option => option.setName('num').setDescription('Value of Pi?'))
	.addMentionableOption(option => option.setName('mentionable').setDescription('Mention something!'))
	.addAttachmentOption(option => option.setName('attachment').setDescription('Best meme?'));

export default createCommand(builder, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  await interaction.deferReply()
  await wait(4000)
  await interaction.editReply("Pong!")
  await interaction.followUp({
    content: "Pong again!",
    ephemeral: true,
  })

  const string = interaction.options.getString("input")
  const boolean = interaction.options.getBoolean("bool")
  const user = interaction.options.getUser("target")
  const member = interaction.options.getMember("target")
  const channel = interaction.options.getChannel("destination")
  const role = interaction.options.getRole("role")
  const integer = interaction.options.getInteger("int")
  const number = interaction.options.getNumber("num")
  const mentionable = interaction.options.getMentionable("mentionable")
  const attachment = interaction.options.getAttachment("attachment")

  console.log({
    string,
    boolean,
    user,
    member,
    channel,
    role,
    integer,
    number,
    mentionable,
    attachment,
  })
})
