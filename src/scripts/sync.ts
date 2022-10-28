/* eslint-disable @typescript-eslint/no-var-requires */

import { REST, Routes } from "discord.js"
import { fileURLToPath } from "url"
import path from "path"
import glob from "fast-glob"

import { CreateCommandResult, env } from "~/utils"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const featuresRoute = path.join(__dirname, "../features")
const commandsFiles = glob.sync(`${featuresRoute}/**/command.*.ts`)

const body = commandsFiles
  .map((route) => {
    const command = require(route).default as CreateCommandResult
    return command.builder.toJSON()
  })
  .filter((body) => body)

const rest = new REST({ version: "10" }).setToken(env.DISCORD_BOT_TOKEN)

rest
  .put(
    Routes.applicationGuildCommands(
      env.DISCORD_APPLICATION_ID,
      env.DISCORD_SERVER_ID
    ),
    { body }
  )
  .then(() => {
    console.log(`✅  Synced ${body.length} application commands.`)
  })
  .catch(console.error)
