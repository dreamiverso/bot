import { stripIndent } from "common-tags"
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  GuildMemberRoleManager,
} from "discord.js"

import { createComponent } from "~/utils"
import { CATEGORY_ID } from "~/utils/constants"

enum ID {
  CREATE = "confirmCreateProject",
  CANCEL = "cancelCreateProject",
}

const builder = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId(ID.CREATE)
    .setStyle(ButtonStyle.Primary)
    .setLabel("Crear proyecto"),
  new ButtonBuilder()
    .setCustomId(ID.CANCEL)
    .setStyle(ButtonStyle.Secondary)
    .setLabel("Cancelar")
)

export default createComponent(builder, async (interaction) => {
  if (!interaction.isButton()) return
  if (!interaction.guild) return
  if (!interaction.member) return

  if (!(interaction.member.roles instanceof GuildMemberRoleManager)) {
    throw Error("Unhandled code path: member roles property is id array")
  }

  const { fields } = interaction.message.embeds[0].data

  if (!fields) {
    throw Error("missing create component fields")
  }

  const { roleName, channelName, visibility } = fields.reduce(
    (accumulator, field) => {
      switch (field.name) {
        case "Nombre del rol":
          accumulator.roleName = field.value
          break
        case "Nombre del canal":
          accumulator.channelName = field.value
          break
        case "Visibilidad del canal":
          accumulator.visibility = field.value
          break
      }

      return accumulator
    },
    {
      roleName: "",
      channelName: "",
      visibility: "",
    }
  )

  switch (interaction.customId) {
    case ID.CANCEL:
      return interaction.update({
        embeds: [],
        components: [],
        content: "Has cancelado la creación del proyecto",
      })
    case ID.CREATE: {
      await interaction.update({
        embeds: [],
        components: [],
        content: "⏳ Creando proyecto…",
      })

      const channel = await interaction.guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: CATEGORY_ID.PROJECTS,
        topic: `Proyecto creado por ${interaction.user.username}`,
      })

      const role = await interaction.guild.roles.create({
        name: roleName,
        color: "#95a5a6",
        mentionable: true,
      })

      await interaction.member.roles.add(role)

      await interaction.editReply({
        embeds: [],
        components: [],
        content: stripIndent`
          ✅ ¡Canal de proyecto creado!
          ✅ ¡Rol de proyecto creado y asignado!
          ¡Todo listo! 🥳 Disfruta del nuevo proyecto
        `,
      })

      return channel.send({
        content: stripIndent`
          ¡Aquí está, "${role}"! ¡Llena este canal de creatividad!
          Puedes editar el nombre, el tema y los miembros de este proyecto con los comandos de \`/proyecto\`.
        `,
      })
    }
    default:
      throw Error(`unhandled interaction ${interaction.customId}`)
  }
})
