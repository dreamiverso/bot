import { EmbedBuilder } from "discord.js"
import { oneLine } from "common-tags"

import { constants, createHandler } from "~/utils"

const TITLE = "¡Bienvenid@ al Dreamiverso!"

const DESCRIPTION = oneLine`
  A modo de presentación, y para romper el hielo, 
  nos puedes decir qué te gusta más de Dreams, y qué estás haciendo o quieres hacer. 
  Incluso puedes asignarte un aura o pedírsela a un moderador.
  \n\n¡No dudes en compartir tus creaciones, o pedir ayuda si te hace falta! :D
  \n\nÉchale un ojo a las normas del servidor, 
  seguro que pronto un humano hablará contigo para darte una bienvenida mejor que la que te puedo dar yo.
  \n\n¡Pero no dudes en usarme para lo que necesites!
`

const FOOTER = "¡Beep, boop! Servicio de notificaciones"

const MILESTONE_GIFS = {
  100: "https://raw.githubusercontent.com/Alados5/discord-dreamsbot/master/media/milestone100gif.gif",
  200: "https://raw.githubusercontent.com/Alados5/discord-dreamsbot/master/media/milestone100gif.gif",
  300: "https://raw.githubusercontent.com/Alados5/discord-dreamsbot/master/media/milestone100gif.gif",
  400: "https://raw.githubusercontent.com/Alados5/discord-dreamsbot/master/media/milestone100gif.gif",
  500: "https://raw.githubusercontent.com/Alados5/discord-dreamsbot/master/media/milestone100gif.gif",
} as const

type Milestone = keyof typeof MILESTONE_GIFS

/**
 * Warmly welcomes new users
 */
export default createHandler("guildMemberAdd", async (guildMember) => {
  if (guildMember.user.bot) return

  const generalChannel = guildMember.guild.channels.cache.find(
    (channel) => channel.id === constants.CHANNEL_ID.GENERAL
  )

  if (!generalChannel) return
  if (!generalChannel.isTextBased()) return

  const embed = new EmbedBuilder()
    .setColor(0x8000ff)
    .setTitle(TITLE)
    .setDescription(DESCRIPTION)
    .setThumbnail(guildMember.user.avatarURL())
    .setFooter({
      text: FOOTER,
    })

  generalChannel.send({
    content: `¡Muy buenas, ${guildMember.nickname}!`,
    embeds: [embed],
  })

  const count = guildMember.guild.memberCount - 1

  // Send an extra celebration message every 100 new users
  if (count % 100 !== 0) return

  const gif = MILESTONE_GIFS[(Math.floor(count / 100) * 100) as Milestone]

  // prettier-ignore
  const message = oneLine`
    ${guildMember.guild.roles.everyone}, ¡Es un momento importante para el servidor! \n
    ¡Con la llegada de ${guildMember.nickname}, ya somos ${count} imps en esta comunidad! \n
    (Si veis ${count + 1} miembros es porque yo no cuento, ¡soy un bot!) \n
    ¡Gracias y felicidades a todos! :D
  `

  generalChannel.send({
    content: message,
    files: [gif],
  })
})
