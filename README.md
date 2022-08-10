# Bot de Discord del Dreamiverso

El código fuente del bot del [servidor de Discord del Dreamiverso](https://discord.dreamiverso.me/).

## Variables de entorno

El proyecto requiere un archivo `.env` ubicado en la raíz del proyecto para funcionar correctamente. Puedes clonar el archivo `.env.template` y rellenarlo con las variables necesarias.

| Variable                 |  Valor   | Descripción                                                                                                                                                                                                                                                                                    |
| ------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DISCORD_BOT_TOKEN`      | `string` | Se obtiene desde [el portal de desarrolladores de Discord](https://discord.com/developers/applications/), dentro de la aplicación del bot, en la sección `Bot > Token`. Si necesitas este token ponte en contacto con el [equipo de moderación del Dreamiverso](mailto:soporte@dreamiverso.me) |
| `DISCORD_APPLICATION_ID` | `string` | Se obtiene desde [el portal de desarrolladores de Discord](https://discord.com/developers/applications/), dentro de la aplicación del bot, en la sección `General Information > Application ID`                                                                                                |
| `DISCORD_SERVER_ID`       | `string` | Se obtiene desde la aplicación de Discord. Necesitarás activar el modo desarrollador en `Ajustes de usuario > Avanzado > Modo desarrollador`. Luego, haz click derecho en el nombre del servidor y selecciona `Copiar ID`.                                                                     |

### Acceder a las variables de entorno

Utilizamos `zod` para asegurar que las variables de entorno existen y tienen un formato correcto. Preferimos esto a declarar las variables de entorno en un archivo `.d.ts` porque `zod` devuelve valores type-safe, así tenemos declaración y validación en un mismo sitio.

```tsx
// ⛔ Evita usar `process.env`
process.env.DISCORD_BOT_TOKEN // string | undefined
process.env.THIS_DOESNT_EXIST // string | undefined
// ✅ Mejor importa y utiliza el objeto `env`
import { env } from "~/utils"
env.DISCORD_BOT_TOKEN // string
env.THIS_DOESNT_EXIST // Property 'THIS_DOESNT_EXIST' does not exist [...]
```
