import { constants, createHandler } from "~/utils"

import { findPlayStationId } from "./utils"

/**
 * Tries to get the PlayStation Network ID on each new message in the nicknames channel.
 * If an ID is found, notifies the user of our autoaura feature.
 * Skips users who already have been notified.
 */
export default createHandler("messageCreate", async (message) => {
  if (message.author.bot) return
  if (message.channel.id !== constants.CHANNEL_ID.NICKNAMES) return

  const id = findPlayStationId(message.content)

  // Could not find any id on this message
  if (!id) return

  const intent = await db.autoauraIntent.findUnique({
    where: {
      idDiscord: message.author.id,
    },
  })

  // User has already been asked
  if (intent) return

  await message.author.send({
    content:
      "Oye quieres suscribirte al autoaura? Te digo como en este mensaje pero lo tienes que hacer tu con el comando",
  })

  await db.autoauraIntent.create({
    data: {
      idDiscord: message.author.id,
    },
  })
})
