import { REST, Routes } from "discord.js"

import { env } from "~/utils"

const rest = new REST({ version: "10" }).setToken(env.DISCORD_BOT_TOKEN)

rest
  .put(
    Routes.applicationGuildCommands(
      env.DISCORD_APPLICATION_ID,
      env.DISCORD_SERVER_ID
    ),
    { body: [] }
  )
  .then(() => {
    console.log("✅  Removed all application commands.")
  })
  .catch(console.error)
