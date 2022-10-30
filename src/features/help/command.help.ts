import { oneLine, stripIndent } from "common-tags"
import { EmbedBuilder, SlashCommandBuilder } from "discord.js"

import { constants, createCommand } from "~/utils"

function code(string: string) {
  return `\`${string}\``
}

const description = oneLine`
  Aquí tienes mis comandos básicos y cómo usarlos, ¡espero que te sean útiles!
`

const auraDescription = stripIndent`
  Utiliza este comando para gestionar tu rol de aura en el servidor.
  - ${code("/aura")} ${code("tipo: Animación")}
  - ${code("/aura")} ${code("tipo: Gestión")}
  - ${code("/aura")} ${code("tipo: Ninguna")}
`

const searchDescription = stripIndent`
  Utiliza este comando para buscar y compartir contenido publicado en Dreams con el resto del servidor.
  - ${code("/buscar")} ${code("tipo: Usuario")} ${code("término: Alados5")}
  - ${code("/buscar")} ${code("tipo: Sueño")} ${code("término: Starfarmer")}
  - ${code("/buscar")} ${code("tipo: Elemento")} ${code("término: Brújula")}
`

const iconsDescription = stripIndent`
  Recibe el enlace a la web oficial de iconos de Dreams de Media Molecule.
`

const inviteDescription = stripIndent`
  Recibe la invitación al servidor de Discord del Dreamiverso.
`

const builder = new SlashCommandBuilder()
  .setName("ayuda")
  .setDescription("Recibe información sobre los comandos del bot.")

export default createCommand(builder, (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const guideChannel = interaction.guild?.channels.cache.find(
    (channel) => channel.id === constants.CHANNEL_ID.PROJECTS_GUIDE
  )

  const welcomeChannel = interaction.guild?.channels.cache.find(
    (channel) => channel.id === constants.CHANNEL_ID.WELCOME
  )

  if (!guideChannel) {
    throw Error("Could not find projects guide channel")
  }

  if (!welcomeChannel) {
    throw Error("Could not find welcome channel")
  }

  const projectsDescription = oneLine`
    Un grupo de comandos para gestionar proyectos del servidor.
    Dispones de más información en el canal ${guideChannel}.
  `

  const moreInfoDescription = oneLine`
    Dispones de más información sobre el servidor y el bot en el canal ${welcomeChannel}.
  `

  const embed = new EmbedBuilder()
    .setColor(0x8000ff)
    .setTitle("Ayuda")
    .setDescription(description)
    .addFields(
      {
        name: "Comando `/aura`",
        value: auraDescription,
      },
      {
        name: "Comando `/buscar`",
        value: searchDescription,
      },
      {
        name: "Comando `/proyecto`",
        value: projectsDescription,
      },
      {
        name: "Comando `/iconos`",
        value: iconsDescription,
      },
      {
        name: "Comando `/invitar`",
        value: inviteDescription,
      },
      {
        name: "Más información",
        value: moreInfoDescription,
      }
    )

  interaction.reply({
    ephemeral: true,
    embeds: [embed],
  })
})
