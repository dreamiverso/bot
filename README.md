# Bot de Discord del Dreamiverso

El código fuente del bot del [servidor de Discord del Dreamiverso](https://discord.dreamiverso.me/).

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

2. Crea un archivo `.env` en la raíz del proyecto con las variables de entorno necesarias. [Puedes consultarlas aquí](#variables-de-entorno).

```zsh
  touch .env
```

3. Instala las dependencias.

```zsh
  npm install
```

4. Inicia el proyecto en el entorno de desarrollo.

```zsh
  npm run dev
```

### Actualizar la versión de producción

Ejecuta el siguiente comando y sigue las indicaciones. El proceso de CI/CD ejecutará los tests necesarios y reiniciará el bot con la nueva versión.

```zsh
  npm run publish
```

## Estructura

```
src
├── commands
│   ├── {command}.ts
│   └── index.ts
├── features
│   ├── {feature}.ts
│   └── index.ts
├── types
├── utils
└── index.ts
```

### Directorio `commands`

Un sistema basado en archivos para integrar `slash commands`. Cada archivo dentro del directorio encapsula un comando.

```
commands
└── {command}.ts
    ├── `export async builder`
    └── `export async handler`
```

Cada archivo debe exportar dos funciones asíncronas para ser registrado correctamente:

- `builder`: se resuelve al iniciar el bot y registra el resultado en la API de Discord.
- `handler`: se invoca cuando se utiliza el comando.

```ts
import type { CommandBuilder, CommandHandler } from "~/types"

export const builder: CommandBuilder = async (builder) => {
  return builder.setName("name").setDescription("description")
}

export const handler: CommandHandler = async (interaction) => {
  interaction.reply("Howdy!")
}
```

### Directorio `features`

Un sistema basado en archivos para integrar funcionalidades que dependen de eventos del cliente de Discord. Cada archivo dentro del directorio encapsula una funcionalidad y puede depender de varios eventos.

```
features
└── {feature}.ts
    └── `export async {event}` → `client.on({event})`
```

Cada archivo puede exportar varias funciones asíncronas que se integran con los eventos del cliente de Discord. Cuando se recibe un evento, el listener correspondiente llama a todas las funciones asociadas a ese evento en paralelo.

```ts
import type { FeatureHandler } from "~/types"

export const ready: FeatureHandler<"ready"> = async (ctx) => {
  // Se invoca en client.on("ready")
}

export const messageCreate: FeatureHandler<"messageCreate"> = async (ctx) => {
  // Se invoca en client.on("messageCreate")
}

export const messageDelete: FeatureHandler<"messageDelete"> = async (ctx) => {
  // Se invoca en client.on("messageDelete")
}
```

> El nombre de las funciones debe coincidir con al menos uno de los eventos del cliente de Discord.
> Puedes consultarlos aquí TODO

> El argumento `ctx` es un objeto cuyas propiedades dependen del tipo de evento.
> Para obtener los tipos correctos, asegúrate de que el tipo `FeatureHandler`
> recibe como genérico el nombre del evento.


### Directorio `types`

TODO: Documentar

### Directorio `utils`

Un barrel export con utilidades que pueden ser usadas por cualquier otro archivo del proyecto.

```ts
import { env, constants } from "~/utils"
```

## Variables de entorno

El proyecto requiere un archivo `.env` ubicado en la raíz del proyecto para funcionar correctamente. Puedes clonar el archivo `.env.template` y rellenarlo con las variables necesarias.

| Variable                 |  Valor   | Descripción                                                                                                                                                                                                                                                                                    |
| ------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
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
import type { FeatureHandler } from "../../types

// ✅ Mejor usa el alias `~/*` para importar desde `src/*`
import type { FeatureHandler } from "~/types
```

### Linting y formato

Este proyecto implementa `eslint` como linter, e integra `prettier` para mostrar errores en el formato. Recomendamos instalar los plugins de `eslint` y `prettier` en tu IDE para una mejor experiencia. Un git hook de `husky` se ejecuta antes de cada commit para resolver automáticamente todos los problemas de `eslint`.
