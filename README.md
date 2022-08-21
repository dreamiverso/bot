# Bot de Discord del Dreamiverso

El código fuente del bot del [servidor de Discord del Dreamiverso](https://discord.dreamiverso.me/).

## Stack

- `node`
- `typescript`
- `postgresql`
- `prisma`
- `heroku`

## Comandos

| Comando   | Desscripción                                           |
| --------- | ------------------------------------------------------ |
| `prepare` | Se ejecuta automáticamente. Configura `husky`.         |
| `dev`     | Inicia el proyecto en modo desarrollo.                 |
| `test`    | Ejecuta la suite de tests.                             |
| `build`   | Crea una versión de producción para ejecutar en local. |
| `start`   | Inicia una versión de producción generada previamente. |
| `publish` | Crea y publica una nueva versión de producción.        |

## Workflows

### Iniciar el proyecto en tu máquina

1. Instala `node` desde la [web oficial](https://nodejs.org/). Este proyecto require la versión `18` o mayor.

```zsh
  node -v
```

2. Instala `postgres` y crea un servidor local con una base de datos vacía. Puedes seguir [esta guía](https://devcenter.heroku.com/articles/heroku-postgresql#local-setup). Cada vez que hagas cambios en el `schema`, tendrás que ejecutar el siguiente comando:

```zsh
  npm run prisma generate
```

3. Crea un archivo `.env` en la raíz del proyecto con las variables de entorno necesarias. [Puedes consultarlas aquí](#variables-de-entorno).

```zsh
  touch .env
```

4. Instala las dependencias.

```zsh
  npm install
```

5. Inicia el proyecto en el entorno de desarrollo.

```zsh
  npm run dev
```

### Actualizar la versión de producción

Ejecuta el siguiente comando y sigue las indicaciones. El proceso de CI/CD ejecutará los tests necesarios y reiniciará el bot con la nueva versión.

```zsh
  npm run publish
```

## Ramas y deployments

Este proyecto consta de dos ramas principales:

- `main` → Rama principal de desarrollo
- `prod` → Rama de producción integrada en el proceso de CI/CD

## Estructura

```
src
├── db
├── features
│   └── {feature}
│       ├── (tests)
│       ├── (types)
│       ├── (utils)
│       ├── (commands.ts)
│       └── (handlers.ts)
├── tests
├── types
└── utils

{} → Nombre arbitrario
() → Opcional
```

### Directorio `db`

Este proyecto utiliza `prisma` para interactuar con una base de datos `postgresql`. `db` contiene el `schema` y `migrations` de `prisma`.

### Directorio `features`

Un sistema basado en el `file system` de `node` para construir funcionalidades del bot. Cada subdirectorio encapsula una funcionalidad, que puede depender de comandos `slash` o de eventos del cliente de Discord.

#### Estructura

Un subdirectorio de funcionalidad debe contener al menos uno de los siguientes archivos:

- `commands.ts` → Para registrar comandos `slash` de Discord
- `handlers.ts` → Para responder a eventos del cliente de Discord

El resto de archivos y directorios son arbitrarios. Puedes aprovechar esto para separar funcionalidades complejas en módulos más pequeños e importarlos en `commands.ts` o `handlers.ts`.

```
src
└── features
    └── {feature}
        ├── (commands).ts
        └── (handlers).ts

{} → Nombre arbitrario
() → Opcional
```

##### `commands.ts`

Permite registrar comandos `slash` de Discord. Exporta una o varias funciones `createCommand` para registrar comandos nuevos. `createCommand` requiere dos funciones asíncronas:

- `builder` → Se resuelve al iniciar el bot y registra el resultado en la API de Discord.
- `handler` → Se invoca cuando se utiliza el comando.

```ts
// src/features/{feature}/commands.ts

import { createCommand } from "~/utils"

export const foo = createCommand({
  async builder(builder) {
    return builder.setName("foo")
  }
  async handler(interaction) {
    await interaction.respond("bar")
  }
})

export const baz = createCommand({
  async builder(builder) {
    return builder.setName("baz")
  }
  async handler(interaction) {
    await interaction.respond("qux")
  }
})
```

##### `handlers.ts`

Permite responder a eventos del cliente de Discord. Exporta una o varias funciones asíncronas con el nombre del evento que ejecutará la función. Puedes consultar la lista de eventos en la [documentación de `discord.js`](https://discord.js.org/#/docs/main/stable/class/Client).

```ts
// src/features/{feature}/handlers.ts

import { FeatureHandler } from "~/types

export const messageCreate: FeatureHandler<"messageCreate"> = async (
  client
) => {
  // Se invoca en client.on("messageCreate")
}

export const messageDelete: FeatureHandler<"messageDelete"> = async (
  client
) => {
  // Se invoca en client.on("messageDelete")
}
```

> Los argumentos de cada función dependen del tipo de evento.
> Para obtener los tipos correctos, asegúrate de que el tipo `Handler` recibe como genérico el nombre del evento.

#### Rutinas

Llamamos rutina a una funcionalidad que se ejecuta en un intervalo de tiempo. Puedes crear una rutina básica con acceso al cliente de Discord de la siguiente manera:

```
src
└── features
    └── routine-example
        └── handlers.ts
```

```ts
// src/features/routine-example/handlers.ts

import { FeatureHandler } from "~/types
import { cron } from "~/utils

export const ready: FeatureHandler<"ready"> = async (client) => {
  cron("* * * * *", async () => {
    console.log(new Date())
  })
}
```

Esta funcionalidad creará una tarea de `node-cron` que se ejecutará cada minuto una vez que el cliente de Discord se inicie correctamente. Puedes consultar la sintaxis de cron [aquí](https://github.com/node-cron/node-cron#cron-syntax).

#### Manejo de errores

Todas las invocaciones de los handlers de eventos y comandos se envuelven en un `try...catch` para no interrumpir la ejecución del bot en caso de error. Los errores atrapados en producción se reportan al equipo de moderación del Dreamiverso.

### Directorio `tests`

TODO: documentar

### Directorio `types`

Un barrel export con tipos que pueden ser usados por cualquier otro archivo del proyecto.

```ts
import { CommandBuilder, CommandHandler } from "~/types"
```

### Directorio `utils`

Un barrel export con utilidades que pueden ser usadas por cualquier otro archivo del proyecto.

```ts
import { env, constants } from "~/utils"
```

## Variables de entorno

El proyecto requiere un archivo `.env` ubicado en la raíz del proyecto para funcionar correctamente. Puedes clonar el archivo `.env.template` y rellenarlo con las variables necesarias.

| Variable                 |  Valor   | Descripción                                                                                                                                                                                                                                                                                    |
| ------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`           | `string` | TODO. Si necesitas este token ponte en contacto con el [equipo de moderación del Dreamiverso](mailto:soporte@dreamiverso.me)                                                                                                                                                                   |
| `DISCORD_BOT_TOKEN`      | `string` | Se obtiene desde [el portal de desarrolladores de Discord](https://discord.com/developers/applications/), dentro de la aplicación del bot, en la sección `Bot > Token`. Si necesitas este token ponte en contacto con el [equipo de moderación del Dreamiverso](mailto:soporte@dreamiverso.me) |
| `DISCORD_APPLICATION_ID` | `string` | Se obtiene desde [el portal de desarrolladores de Discord](https://discord.com/developers/applications/), dentro de la aplicación del bot, en la sección `General Information > Application ID`                                                                                                |
| `DISCORD_SERVER_ID`      | `string` | Se obtiene desde la aplicación de Discord. Necesitarás activar el modo desarrollador en `Ajustes de usuario > Avanzado > Modo desarrollador`. Luego, haz click derecho en el nombre del servidor y selecciona `Copiar ID`.                                                                     |

### Acceder a las variables de entorno

Utilizamos `zod`, entre otras cosas, para asegurar que las variables de entorno existen y tienen un formato correcto. Preferimos esto a declarar las variables de entorno en un archivo `.d.ts` porque `zod` devuelve valores type-safe, así tenemos declaración y validación en un mismo sitio.

```ts
// ⛔ Evita usar `process.env`
process.env.DISCORD_BOT_TOKEN // string | undefined
process.env.THIS_DOESNT_EXIST // string | undefined

// ✅ Mejor importa y utiliza el objeto `env`
import { env } from "~/utils"
env.DISCORD_BOT_TOKEN // string
env.THIS_DOESNT_EXIST // Property 'THIS_DOESNT_EXIST' does not exist [...]
```

## Estilo del código

### Path aliases

Este proyecto implementa un path alias de `typescript` para importar módulos desde el directorio `src`.

```ts
// ⛔ Evita imports relativos de archivos padres
import type { Handler } from "../../types

// ✅ Mejor usa el alias `~/*` para importar desde `src/*`
import type { Handler } from "~/types
```

### Linting y formato

Este proyecto implementa `eslint` como linter, e integra `prettier` para mostrar errores en el formato. Recomendamos instalar los plugins de `eslint` y `prettier` en tu IDE para una mejor experiencia. Un git hook de `husky` se ejecuta antes de cada commit para resolver automáticamente todos los problemas de `eslint`.
