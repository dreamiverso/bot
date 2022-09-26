/* eslint-disable @typescript-eslint/no-var-requires */

import { REST, Routes } from "discord.js"
import path from "path"
import glob from "fast-glob"

import { CreateCommandResult, env } from "~/utils"

const featuresRoute = path.join(__dirname, "../features")
const commandsFiles = glob.sync(`${featuresRoute}/**/command.*.ts`)

const body = commandsFiles.map((route) => {
  const command = require(route).default as CreateCommandResult
  return command.builder.toJSON()
})

const rest = new REST({ version: "10" }).setToken(env.DISCORD_BOT_TOKEN)

rest
  .put(Routes.applicationCommands(env.DISCORD_APPLICATION_ID), {
    body,
  })
  .then(() => {
    console.log(`✅  Synced ${body.length} application commands.`)
  })
  .catch(console.error)
