import { ChannelType } from "discord.js"
import { stripIndent } from "common-tags"

import { createHandler, cron, env, constants } from "~/utils"

import {
  formatChannelName,
  pipe,
  projectRolePrefix,
  removeProject,
  removeProjectRolePrefix,
} from "./utils"

const ONE_WEEK = 604800000
const TWO_MONTHS = 5270400000

const WARN_INACTIVE = "```md\n<PROYECTO INACTIVO>\n```"
const WARN_ARCHIVED = "```md\n<PROYECTO ARCHIVADO>\n```"

/**
 * Schedule a cron job every minute on development
 * and every day on production
 */
const schedule = env.NODE_ENV === "development" ? "* * * * *" : "0 0 * * *"

export default createHandler("ready", async (client) => {
  cron(schedule, async () => {
    const guild = client.guilds.cache.find(
      (guild) => guild.id === env.DISCORD_SERVER_ID
    )

    if (!guild) {
      throw Error("Could not find guild")
    }

    const projects = guild.channels.cache.filter(
      (channel) => channel.parentId === constants.CATEGORY_ID.PROJECTS
    )

    const projectRoles = guild.roles.cache.filter((role) =>
      projectRolePrefix.test(role.name)
    )

    projects.forEach(async (project) => {
      if (project.type !== ChannelType.GuildText) return

      const messagesCol = await project.messages.fetch({ limit: 1 })
      const lastMessage = messagesCol.first()
      const timestamp = lastMessage?.createdAt ?? project.createdAt
      const diff = new Date().getTime() - timestamp.getTime()

      const projectRole = projectRoles.find((role) => {
        const name = pipe(removeProjectRolePrefix, formatChannelName)(role.name)
        return project.name === name
      })

      if (!projectRole) {
        throw Error(`Could not find role for project ${project.name}`)
      }

      const channelName = pipe(
        removeProjectRolePrefix,
        formatChannelName
      )(projectRole.name)

      // Two months have passed and last message is not a warning from purge process. Warn members
      // TODO: please make this beautiful
      if (
        !lastMessage ||
        (lastMessage.author.id === client.application.id &&
          ![WARN_ARCHIVED, WARN_INACTIVE].includes(lastMessage.content))
      ) {
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

      if (lastMessage.author.id !== client.application.id) return

      // A month has passed since the archive warning. Delete project
      if (diff > TWO_MONTHS / 2 && lastMessage.content === WARN_ARCHIVED) {
        return removeProject(project, projectRole)
      }

      // A week have passed since the inactive warn. Archive project
      if (diff > ONE_WEEK && lastMessage.content === WARN_INACTIVE) {
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
      }
    })
  })
})
