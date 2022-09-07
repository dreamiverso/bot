import { createHandler, cron } from "~/utils"

import { getLevelAndAuras } from "../utils"

export default createHandler("ready", async () => {
  cron("0 * * * *", async () => {
    console.log("updating all autoaura subscriptions every hour")

    const endolledUsers = await db.user.findMany({
      select: {
        idPSN: true,
      },
      where: {
        autoaura: {
          not: null,
        },
      },
    })

    endolledUsers.forEach(async (user) => {
      const { level, auras } = await getLevelAndAuras(user.idPSN)

      // TODO: assign role based on this values
      console.log(`will update user ${user} with new scrape data`, level, auras)
    })
  })
})
