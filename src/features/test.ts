import { FeatureHandler } from "~/types"

export const ready: FeatureHandler<"ready"> = async (client) => {
  console.log("ready from test file event handler!")
}

export const interactionCreate: FeatureHandler<"interactionCreate"> = async (
  interaction
) => {
  return
}

export const messageCreate: FeatureHandler<"messageCreate"> = async (
  message
) => {
  if (message.author.bot) return
}
