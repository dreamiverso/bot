import got from "got"
import { Window } from "happy-dom"
import { z } from "zod"

import { createHandler, db, cron } from "~/utils"

const window = new Window()
const schema = z.object({ length: z.number() })

const ROUTINE_ID = "indreams-icons"
const ICONS_URL = "https://docs.indreams.me/en/help/getting-started/icons"

export default createHandler("ready", async () => {
  cron("0 0 * * *", async () => {
    const data = await got(ICONS_URL).text()

    window.document.body.innerHTML = data

    const { length } = window.document.querySelectorAll(".allicons__icon")

    if (!length) throw Error("missing icons on scraper routine")

    const routine = await db.routine.findUnique({
      select: {
        payload: true,
      },
      where: {
        id: ROUTINE_ID,
      },
    })

    if (!routine) {
      return db.routine.create({
        data: {
          id: ROUTINE_ID,
          payload: { length },
        },
      })
    }

    const payload = schema.parse(routine.payload)

    if (payload.length !== length) {
      console.log("length changed and should notify!")
    }

    db.routine.update({
      where: {
        id: ROUTINE_ID,
      },
      data: {
        payload: { length },
      },
    })
  })
})
