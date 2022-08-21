import { APIEmbedField, Client, EmbedBuilder, RestOrArray } from "discord.js"
import { stripIndent } from "common-tags"

import { sendMessageToChannel } from "."
import { constants } from "."

const TITLE = "¡Vaya! Algo ha ido mal…"

const DESCRIPTION = stripIndent`
  He detectado un error sin manejar en alguna parte de mi código.
  Para que pueda ofrecer un servicio ininterrumpido, los errores sin manejar son atrapados automáticamente y notifican al equipo de moderación del Dreamiverso.
`

const FOOTER = "Servicio de notificaciones"

export function notifyError(
  client: Client,
  ...field: RestOrArray<APIEmbedField>
) {
  const embed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle(TITLE)
    .setDescription(DESCRIPTION)
    .setTimestamp(Date.now())
    .addFields(...field)
    .setTimestamp()
    .setFooter({
      text: FOOTER,
    })

  sendMessageToChannel(client, constants.CHANNEL_ID.MODS, {
    embeds: [embed],
  })
}
