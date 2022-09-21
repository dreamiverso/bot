import { APIEmbedField, Client, EmbedBuilder } from "discord.js"
import { stripIndent } from "common-tags"

import { sendMessageToChannel } from "."
import { constants } from "."

const TITLE = "¡Vaya! Algo ha ido mal…"

const DESCRIPTION = stripIndent`
  He detectado un error sin manejar en alguna parte de mi código.
  Para que pueda ofrecer un servicio ininterrumpido, los errores sin manejar son atrapados automáticamente y notifican al equipo de moderación del Dreamiverso.
`

const FOOTER = "¡Beep, boop! Servicio de notificaciones"

export function notifyError(
  client: Client,
  fields: Record<APIEmbedField["name"], APIEmbedField["value"]>
) {
  const processedFields = Object.entries(fields).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  const embed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle(TITLE)
    .setDescription(DESCRIPTION)
    .setTimestamp(Date.now())
    .addFields(processedFields)
    .setFooter({
      text: FOOTER,
    })

  sendMessageToChannel(client, constants.CHANNEL_ID.MODS, {
    embeds: [embed],
  })
}
