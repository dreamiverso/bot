# Bot de Discord del Dreamiverso

El código fuente del bot del [servidor de Discord del Dreamiverso](https://discord.dreamiverso.me/).

## Stack

- `node`
- `typescript`
- `postgresql`
- `prisma`
- `railway`

## Comandos

| Comando | Desscripción                                                    |
| ------- | --------------------------------------------------------------- |
| `dev`   | Inicia el proyecto en el entorno de desarrollo.                 |
| `sync`  | Sincroniza los comandos del bot con la API de Discord.          |
| `lint`  | Ejecuta ESLint para mostrar errores en el código. |
| `start` | Inicia el proyecto en el entorno de producción.                 |
| `check` | Comprueba la validez de los tipos de TypeScript.                |

## Workflows

### Iniciar el proyecto en tu máquina

1. Instala `node` desde la [web oficial](https://nodejs.org/). Este proyecto require la versión `16` o mayor.

```zsh
  node -v
```

2. Instala `postgresql` y crea un servidor local con una base de datos vacía. Puedes seguir [esta guía](https://devcenter.heroku.com/articles/heroku-postgresql#local-setup). Cada vez que hagas cambios en el `schema`, tendrás que ejecutar el siguiente comando:

```zsh
  npm run prisma generate
```

3. Solicita una invitación al servidor de sandbox del Dreamiverso a [soporte@dreamiverso.me](mailto:soporte@dreamiverso.me) o al equipo de moderación en el [servidor de Discord](https://discord.dreamiverso.me).

4. Crea una aplicación de bot desde el [portal de desarrolladores de Discord](https://discord.com/developers/applications).

5. Clona el respositorio y crea un archivo `.env.development` en la raíz del proyecto con las variables de entorno necesarias. [Puedes consultarlas aquí](#variables-de-entorno).

```zsh
  touch .env
```

6. Instala las dependencias.

```zsh
  npm install
```

7. Inicia el proyecto en el entorno de desarrollo.

```zsh
  npm run dev
```

## Estructura

```
src
├── db
├── features
├── scripts
└── utils
```

### Directorio `db`

Este proyecto utiliza `prisma` para interactuar con una base de datos `postgresql`. `db` contiene el `schema` y `migrations` de `prisma`.

### Directorio `features`

Un sistema basado en el `file system` de `node` para construir funcionalidades del bot. Cada subdirectorio encapsula una funcionalidad, que puede depender de comandos `slash`, componentes o eventos del cliente de `discord.js`.

#### Estructura

```
src
└── features
    └── **
        ├── command.*.ts
        ├── component.*.ts
        └── handler.*.ts
```

Un subdirectorio de `features` debe contener al menos uno de los siguientes archivos:

- `command.*.ts` → Para registrar comandos `slash` de Discord
- `component.*.ts` → Para crear componentes de Discord
- `handler.*.ts` → Para responder a eventos del cliente de `discord.js`

El resto de archivos y directorios son arbitrarios. Puedes aprovechar esto para separar funcionalidades complejas en módulos más pequeños.

##### `command.*.ts`

Permite registrar un comando `slash` de Discord. Debe incluir un `export default` de la función `createCommand`. Requiere dos argumentos:

- `builder` → Un builder de comandos de `discord.js`
- `handler` → La función a invocar cuando se ejecute el comando

```ts
import { SlashCommandBuilder } from "discord.js"

import { createCommand } from "~/utils"

const builder = new SlashCommandbuilder()
  .setName("marco")
  .setDescription("Responde sin mucho entusiasmo")

export default createCommand(builder, async (interaction) => {
  interaction.reply("Polo")
})
```

Al recibir una interacción, la aplicación buscará y ejecutará el `handler` correspondiente. Al igual que en `discord.js`, para acceder a determinadas propiedades necesitarás comprobar el tipo de interacción métodos como `interaction.isChatInputCommand` o `interaction.isButton`.

##### `component.*.ts`

Permite crear un componente de Discord. Debe incluir un `export default` de la función `createComponent`. Requiere dos argumentos:

- `builder` → Un builder de componente de `discord.js`
- `handler` → La función a invocar cuando se interactúe con el componente

```ts
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js

import { createComponent } from "~/utils"

const builder = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId("id-único")
    .setLabel('¡Púlsame!')
    .setStyle(ButtonStyle.Primary),
)

export default createComponent(builder, (interaction) => {
  interaction.reply("Así me gusta")
})
```

Los componentes se envían como respuesta a la interación de un usuario con un comando `slash` o con otro componente. Por ejemplo, en la siguiente feature:

```
src
└── features
    └── demo
        ├── command.demoCommand.ts
        └── component.demoButton.ts
```

El bot enviará el componente `demoButton` desde el comando `demoCommand` así:

```ts
// src/features/test/command.demoCommand.ts

import { SlashCommandBuilder } from "discord.js"

import { createCommand } from "~/utils"

import componentDemoButton from "./component.demoButton"

const builder = new SlashCommandbuilder()
  .setName("botón")
  .setDescription("Responde con un botón")

export default createComponent(builder, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  interaction.reply({
    components: [componentDemoButton.builder],
  })
})
```

Si añades nuevos builders de comandos o modificas los ya existentes, deberás sincronizarlos con la API de Discord mediante el comando `sync`. El proceso de sincronizado debe pasar por la cache de Discord, por lo que tardará un rato en mostrarse en la aplicación.

Sincronizar comandos solo actualiza la información de los builders. Los cambios en los handlers no dependen de la API de Discord, por lo que no requiren el comando `sync` y se actualizan cada vez que se guarda el archivo de comando.

##### `handler.*.ts`

Permite responder a eventos del cliente de `discord.js`. Debe incluir un `export default` de la función `createHandler`. Requiere dos argumentos:

- `event` → El nombre del evento de `discord.js` que ejecutará la función. Puedes consultar la lista de eventos en la [documentación de `discord.js`](https://discord.js.org/#/docs/main/stable/class/Client).
- `handler` → La función a invocar cuando se reciba el evento.

```ts
// src/features/**/handler.*.ts
import { createHandler } from "~/utils"

export default createHandler("messageCreate", async (message) => {
  interaction.reply("¡Hay un mensaje nuevo!")
})
```

#### Rutinas

Llamamos rutina a una funcionalidad que se ejecuta en un intervalo de tiempo mediante un cron job. Puedes crear una rutina básica con acceso al cliente de `discord.js` de la siguiente manera:

```
src
└── features
    └── routine
        └── handler.ready.ts
```

```ts
// src/features/routine/handler.ready.ts

import { createHandler, cron } from "~/utils

export default createHandler("ready", async (client) => {
  cron("* * * * *", async () => {
    console.log("Me ejecuto cada minuto")
  })
})
```

Esta funcionalidad creará una tarea de `node-cron` que se ejecutará cada minuto una vez que el cliente de Discord se inicie correctamente. Puedes consultar la sintaxis de cron [aquí](https://github.com/node-cron/node-cron#cron-syntax) o usar [este editor online](https://crontab.guru/examples.html).

#### Manejo de errores

Todas las invocaciones de los handlers de eventos y comandos se envuelven en un `try...catch` para no interrumpir la ejecución del bot en caso de error. Los errores atrapados en producción se reportan al equipo de moderación del Dreamiverso.

### Directorio `scripts`

Contiene diferentes scripts ejecutables mediante comandos definidos en el `package.json`.

```ts
import { CommandBuilder, CommandHandler } from "~/types"
```

### Directorio `utils`

Un barrel export con utilidades que pueden ser usadas por cualquier otro archivo del proyecto.

```ts
import { env, constants } from "~/utils"
```

## Variables de entorno

El proyecto requiere un archivo `.env.development` para funcionar correctamente. Puedes clonar el archivo `.env.template` y rellenarlo con las variables necesarias.

| Variable                 |  Valor   | Descripción                                                                                                                                                                                     |
| ------------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`           | `string` | La connection string de tu base de datos local.                                                                                                                                                 |
| `DISCORD_BOT_TOKEN`      | `string` | Se obtiene desde [el portal de desarrolladores de Discord](https://discord.com/developers/applications/), dentro de la aplicación del bot, en la sección `Bot > Token`.                         |
| `DISCORD_APPLICATION_ID` | `string` | Se obtiene desde [el portal de desarrolladores de Discord](https://discord.com/developers/applications/), dentro de la aplicación del bot, en la sección `General Information > Application ID` |
| `DISCORD_SERVER_ID`      | `string` | El ID del servidor de sandbox del Dreamiverso. Si lo necesitas, ponte en contacto con el [equipo de moderación del Dreamiverso](mailto:soporte@dreamiverso.me)                                  |

### Acceder a las variables de entorno

Utilizamos `zod`, entre otras cosas, para asegurar que las variables de entorno existen y tienen un formato correcto.

```ts
// ⛔ Evita usar `process.env`
process.env.DISCORD_BOT_TOKEN // string | undefined
process.env.THIS_DOESNT_EXIST // string | undefined

// ✅ Mejor importa y utiliza el objeto `env`
import { env } from "~/utils"
env.DISCORD_BOT_TOKEN // string
env.THIS_DOESNT_EXIST // Property 'THIS_DOESNT_EXIST' does not exist [...]
```
