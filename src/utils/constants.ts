type Values<T extends Record<string, unknown>> = T[keyof T]

export const CHANNEL_ID =
  process.env.NODE_ENV === "development"
    ? ({
        GENERAL: "1006996010142289922",
        NICKNAMES: "1007016335261315213",
        MODS: "1010917282987397160",
        BOT_DEBUG: "1022195706037018725",
        PROJECTS_GUIDE: "1030543854149046333",
        WELCOME: "1036283648720257144",
      } as const)
    : ({
        GENERAL: "530381279749865484",
        NICKNAMES: "565634081157545987",
        MODS: "552435323108589579",
        BOT_DEBUG: "688107638239920282",
        PROJECTS_GUIDE: "673198900357759017",
        WELCOME: "552804145866866698",
      } as const)

export type CHANNEL_ID = Values<typeof CHANNEL_ID>

export const CATEGORY_ID =
  process.env.NODE_ENV === "development"
    ? ({
        PROJECTS: "1027700509324365856",
      } as const)
    : ({
        PROJECTS: "552432711072088074",
      } as const)

export type CATEGORY_ID = Values<typeof CATEGORY_ID>
