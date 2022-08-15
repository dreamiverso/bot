import { PrismaClient } from "@prisma/client"

import { env } from "./env"

declare global {
  // eslint-disable-next-line no-var
  var db: PrismaClient
}

export const db = global.db || new PrismaClient()

if (env.NODE_ENV !== "production") global.db = db
