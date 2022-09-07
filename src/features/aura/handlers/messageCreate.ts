import { constants, createHandler } from "~/utils"

import { findPlayStationId, getLevelAndAuras } from "../utils"

/**
 * Tries to get the PlayStation Network id on each new message in the nicknames channel.
 * Automatically starts the autoaura enrollment funnel for new users.
 * Skips users who already went through the funnel.
 */
export default createHandler("messageCreate", async (message) => {
  if (message.author.bot) return
  if (message.channel.id !== constants.CHANNEL_ID.NICKNAMES) return

  const id = findPlayStationId(message.content)

  // Could not find any id on this message
  if (!id) return

  const existingUser = await db.user.findUnique({
    select: {
      autoaura: true,
    },
    where: {
      idDiscord: message.author.id,
    },
  })

  // User has already been asked
  if (existingUser?.autoaura) return

  // TODO ask for consent
  // Here we assume user wants to endoll to autoaura
  await message.reply({
    content: "Oye quieres suscribirte al autoaura?",
  })

  await message.author.send({
    content: "Oye quieres suscribirte al autoaura",
  })

  const consents = true

  const levelAurasPromise = getLevelAndAuras(id)

  const createUserPromise = db.user.create({
    data: {
      idDiscord: message.author.id,
      idPSN: id,
      autoaura: consents
        ? constants.AUTOAURA_SUBSCRIPTION_STATE.ENROLLED
        : constants.AUTOAURA_SUBSCRIPTION_STATE.DECLINED,
    },
  })

  const [levelAndAuras] = await Promise.all([
    levelAurasPromise,
    createUserPromise,
  ])

  // TODO: assign role based on this values
  console.log("autoaura subscription flow scrape result", levelAndAuras)
})