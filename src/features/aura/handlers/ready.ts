import { createHandler, cron } from "~/utils"

import { getIndreamsUserData } from "../utils"

export default createHandler("ready", async (client) => {
  cron("0 * * * *", async () => {
    console.log("updating all autoaura subscriptions every hour")

    const intents = await db.autoauraIntent.findMany()

    const promises = intents.map(async (intent) => {
      console.log("Updating autoaura with intent", intent)

      const user = client.users.resolve(intent.idDiscord)

      // User no longer exists on the server
      if (!user) {
        await db.autoauraIntent.delete({
          where: {
            id: intent.id,
          },
        })

        return console.log(`Autoaura user no longer exists`, intent)
      }

      // User went through enrollemnt but declined autoaura
      if (!intent.idPSN) return

      const { level, auras } = await getIndreamsUserData(intent.idPSN)

      // TODO: assign role based on this values
      console.log(`will update user ${user} with new scrape data`, level, auras)
    })

    await Promise.all(promises)

    console.log("updated all autoaura subscriptions")
  })
})
