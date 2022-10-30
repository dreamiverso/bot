import { env } from "~/utils"

type Values<T extends Record<string, unknown>> = T[keyof T]

export const CHANNEL_ID =
  env.NODE_ENV === "development"
    ? ({
        GENERAL: "1006996010142289922",
        NICKNAMES: "1007016335261315213",
        MODS: "1010917282987397160",
        BOT_DEBUG: "1022195706037018725",
        PROJECTS_GUIDE: "1030543854149046333",
        WELCOME: "1036283648720257144",
      } as const)
    : ({
        GENERAL: "",
        NICKNAMES: "",
        MODS: "",
        BOT_DEBUG: "",
        PROJECTS_GUIDE: "",
        WELCOME: "1036283648720257144",
      } as const)

export type CHANNEL_ID = Values<typeof CHANNEL_ID>

export const CATEGORY_ID =
  env.NODE_ENV === "development"
    ? ({
        PROJECTS: "1027700509324365856",
      } as const)
    : ({
        PROJECTS: "",
      } as const)

export type CATEGORY_ID = Values<typeof CATEGORY_ID>
