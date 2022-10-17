import { ChannelType, Client, Message } from "discord.js"
import { stripIndent } from "common-tags"
import dayjs from "dayjs"

import { createHandler, cron, env, constants, wait } from "~/utils"

import {
  formatChannelName,
  pipe,
  projectRolePrefix,
  removeProject,
  removeProjectRolePrefix,
} from "./utils"

const WARN_ARCHIVED = "```md\n<PROYECTO ARCHIVADO>\n```"
const WARN_INACTIVE = "```md\n<PROYECTO INACTIVO>\n```"
const WARN_DELETE = "```md\n<PROYECTO MARCADO PARA SER ELIMINADO>\n```"

function getLastMessageType(
  client: Client<true>,
  message: Message | undefined
) {
  if (!message) return "OTHER"
  if (message.author.id !== client.application.id) return "OTHER"
  if (message.content === WARN_INACTIVE) return "WARN_INACTIVE"
  if (message.content === WARN_ARCHIVED) return "WARN_ARCHIVED"
  if (message.content === WARN_DELETE) return "WARN_DELETE"
  return "OTHER"
}

export default createHandler("ready", async (client) => {
  cron("0 0 * * *", async () => {
    const guild = client.guilds.cache.find(
      (guild) => guild.id === env.DISCORD_SERVER_ID
    )

    if (!guild) {
      throw Error("Could not find guild")
    }

    // Revalidate cache
    await guild.members.fetch({ force: true })

    const projects = guild.channels.cache.filter(
      (channel) =>
        channel.parentId === constants.CATEGORY_ID.PROJECTS &&
        channel.id !== constants.CHANNEL_ID.PROJECTS_GUIDE
    )

    const projectRoles = guild.roles.cache.filter((role) =>
      projectRolePrefix.test(role.name)
    )

    projects.forEach(async (project) => {
      await wait(3000)

      if (project.type !== ChannelType.GuildText) return

      const projectRole = projectRoles.find((role) => {
        const name = pipe(removeProjectRolePrefix, formatChannelName)(role.name)
        return project.name === name
      })

      if (!projectRole) {
        throw Error(`Could not find role for project ${project.name}`)
      }

      const messagesCol = await project.messages.fetch({ limit: 1 })
      const lastMessage = messagesCol.first()
      const lastDate = dayjs(lastMessage?.createdAt ?? project.createdAt)
      const messageType = getLastMessageType(client, lastMessage)

      const channelName = pipe(
        removeProjectRolePrefix,
        formatChannelName
      )(projectRole.name)

      switch (messageType) {
        case "WARN_DELETE":
          if (!dayjs().subtract(1, "week").isAfter(lastDate)) return
          return removeProject(project, projectRole)
        case "WARN_ARCHIVED":
          // prettier-ignore
          if (!dayjs().subtract(1, "month").subtract(1, "day").isAfter(lastDate)) return

          await project.send({
            content: stripIndent`
              ¡Alerta, ${projectRole}!
              No se ha respondido al aviso de inactividad.

              Esta es la última fase del proceso de purga de proyectos inactivos.
              Para detenerlo, cualquier mensaje por este canal bastará.
              Si no se dice nada por este canal en menos de **24 HORAS**, ESTE PROYECTO VA A SER ELIMINADO.
              Este es el último aviso, **¡si no hay actividad durante 24 horas no habrá vuelta atrás!**

              ¿Está abandonado este proyecto? También se puede eliminar inmediatamente con el comando \`/proyecto eliminar ${channelName}\`.
            `,
          })

          return project.send(WARN_DELETE)
        case "WARN_INACTIVE":
          if (!dayjs().subtract(1, "week").isAfter(lastDate)) return

          await project.send({
            content: stripIndent`
              ¡Alerta, ${projectRole}!
              No se ha respondido al aviso de inactividad.

              Esta es la segunda fase del proceso de purga de proyectos inactivos.
              Para detenerlo, cualquier mensaje por este canal bastará.
              Ahora el canal quedará invisible menos para moderación y los miembros este proyecto.
              Para restaurarlo se puede usar el comando \`/proyecto editar visibilidad ${channelName}\` o contactar con moderación.
              Si no se dice nada por este canal en menos de **UN MES**, ESTE PROYECTO VA A SER ELIMINADO.
              Este es el último aviso, **¡si no hay actividad durante un mes no habrá vuelta atrás!**

              ¿Está abandonado este proyecto? También se puede eliminar inmediatamente con el comando \`/proyecto eliminar ${channelName}\`.
            `,
          })

          await project.permissionOverwrites.create(
            project.guild.roles.everyone,
            { ViewChannel: false }
          )

          await project.permissionOverwrites.create(projectRole, {
            ViewChannel: true,
          })

          return project.send(WARN_ARCHIVED)
        case "OTHER":
          if (!dayjs().subtract(2, "month").isAfter(lastDate)) return

          await project.send({
            content: stripIndent`
              ¡Atención, ${projectRole}!
              Esto es un aviso por inactividad:
              No se ha detectado ningún mensaje en los últimos dos meses en este proyecto.

              Esta es la primera fase del proceso de purga de proyectos inactivos.
              Para detenerlo, cualquier mensaje por este canal bastará.
              Si no se responde a este mensaje en menos de **UNA SEMANA**, este proyecto quedará **ARCHIVADO** durante **UN MES**.
              Si dentro de ese mes tampoco hay actividad, el proyecto será **ELIMINADO**.

              ¿Está abandonado este proyecto? También se puede eliminar inmediatamente con el comando \`/proyecto eliminar ${channelName}\`.
            `,
          })

          return project.send(WARN_INACTIVE)
      }
    })
  })
})
