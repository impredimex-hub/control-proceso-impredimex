# HANDOVER.md — Guía técnica de mantenimiento

Lo que necesita saber quien reciba esta aplicación para operarla, corregirla y
extenderla sin depender de quien la construyó.

**Versión de la aplicación:** 1.5.0
**Última actualización de este documento:** 24 de noviembre de 2026
**Desarrollo original:** Victor Moreno

---

## Antes de modificar nada

1. Lee este documento completo
2. Lee [`README.md`](./README.md)
3. Lee en [`SPECS.md`](./SPECS.md) la sección «Lo que enseñó la versión
   anterior», la tabla de estado y al menos SPEC-001, SPEC-004, SPEC-007 y
   SPEC-010
4. Revisa las últimas entradas de [`CHANGELOG.md`](./CHANGELOG.md)

La aplicación es parte de una suite. **Cualquier cambio que toque inicio de
sesión, permisos o personal afecta también a RRHH, EPP, Mantenimiento e
Ingeniería de Procesos.**

---

## Servicios externos

Ninguna credencial vive en este repositorio.

| Servicio | Qué contiene |
|---|---|
| GitHub `impredimex-hub` | Código y hospedaje (GitHub Pages) de las cinco apps y el portal |
| Firebase `impredimex-suite` | Inicio de sesión y padrón de personal de toda la suite |
| Firebase `impredimex-procesos` | Base de datos de esta aplicación |

A qué cuenta de Google pertenece hoy `impredimex-procesos` se confirma en el
plan de traspaso de cuentas que acompaña la entrega de la suite.

---

## Identificadores y direcciones

**GitHub**
- Repositorio: https://github.com/impredimex-hub/control-proceso-impredimex
- Aplicación: https://impredimex-hub.github.io/control-proceso-impredimex/
- Portal de la suite: https://impredimex-hub.github.io/
- Rama publicada: `main`, carpeta raíz

**Firebase — datos de esta app**
- Proyecto: `impredimex-procesos`
- Realtime Database: `https://impredimex-procesos-default-rtdb.firebaseio.com`,
  nodo raíz `cal`
- Authentication: proveedor **Anónimo** habilitado. La app lo necesita para
  leer y escribir; si se deshabilita sin reemplazarlo, la app abre pero muestra
  «Sin acceso a la base»

**Firebase — suite**
- Proyecto: `impredimex-suite`
- Firestore, colección `colaboradores` (una ficha por nómina)
- Authentication: cuentas `<nómina>@impredimex.local`

**Ingeniería de Procesos no usa este proyecto.** Su base es `proceso-pwa`. El
parecido de nombres viene de que esta app se llama «Control de Procesos».

---

## Cómo se publica un cambio

No hay compilación. El `index.html` se sirve tal cual desde GitHub Pages.

**Desde GitHub web:** abrir el archivo, editar con el lápiz, confirmar el
commit en `main`. GitHub Pages publica en uno o dos minutos.

**Desde una copia local:**

```
git clone https://github.com/impredimex-hub/control-proceso-impredimex.git
# editar index.html
git commit -am "Descripción del cambio"
git push
```

En cada cambio, subir la versión en `CACHE` de `sw.js` (`calidad-vX.Y.Z`) a la
misma de `CHANGELOG.md`. El service worker borra las copias con otro nombre al
activarse, así ningún teléfono se queda con la versión anterior.

Después de publicar, recargar sin caché (Ctrl+Shift+R). En un teléfono con la
app instalada puede hacer falta cerrarla y abrirla dos veces.

### Probar sin afectar producción

Producción y cualquier copia de prueba **escriben en la misma base**. Una
inspección o un hallazgo de prueba aparece en el foco, en Acciones y en el
Historial de todos. Para borrarlo: Firebase → `impredimex-procesos` → Realtime
Database → `cal/hallazgos` o `cal/inspecciones` → el registro → eliminar.

Para probar localmente hace falta servir el archivo por HTTP (por ejemplo, Live
Server de VS Code).

---

## Cómo entra una persona

1. Escribe su nómina y su clave. La app arma `<nómina>@impredimex.local` y
   valida contra Authentication de `impredimex-suite`
2. Lee su ficha en `colaboradores/<nómina>`: debe estar `ACTIVO` y tener
   `calidad` en `apps`
3. Toma su papel de `roles.calidad`. Sin papel, entra como `INSPECTOR`
4. Abre una sesión anónima en `impredimex-procesos` y se suscribe a `cal/`

Si la persona ya inició sesión en el portal o en otra app de la suite, entra
directo: la sesión se comparte porque todas viven en `impredimex-hub.github.io`
(SPEC-013).

### Dar acceso a una persona

1. **Que exista en el padrón.** RRHH la da de alta en su Directorio
2. **Que tenga cuenta.** Firebase Console → `impredimex-suite` → Authentication →
   Agregar usuario. Correo `<nómina>@impredimex.local`, clave inicial que se le
   entrega a la persona
3. **Que tenga permiso.** En la app de RRHH, Directorio → icono de llave de la
   persona → Control de Procesos → elegir `Inspector`, `Supervisor` o
   `Administrador`. El selector escribe el valor en mayúsculas, que es como lo
   compara esta app

Los cambios de papel surten efecto en el siguiente inicio de sesión.

### Restablecer una clave

Igual que en el resto de la suite: el botón «Restablecer contraseña» de la
consola no sirve, porque manda un correo a `@impredimex.local`.

1. Firebase Console → `impredimex-suite` → Authentication → buscar
   `<nómina>@impredimex.local` → Borrar cuenta
2. Agregar usuario con el mismo identificador y una clave nueva

Ninguna app guarda el identificador interno de la cuenta, así que borrarla y
crearla otra vez no afecta sus permisos ni su historial.

---

## Datos

Todo vive bajo `cal/` en la Realtime Database de `impredimex-procesos`. Detalle
en la SPEC-010.

| Ruta | Quién escribe | Qué guarda |
|---|---|---|
| `cal/inspecciones/<id>` | Inspector, Admin | Etapa, turno, máquina, etiqueta, `etiquetaNombre`, `etiquetaCliente`, `etiquetaEnGaleria`, fecha (local, `AAAA-MM-DD`), `ts`, `inspectorNomina`, `inspectorNombre`, `resultado`, `variables`, `variablesDesviadas` y, si no pasó, `hallazgoId` |
| `cal/hallazgos/<id>` | Inspector, Admin; al cerrar, Supervisor o Admin | Lo de la inspección más `defecto`, `causa`, `causaDeterminada`, `metros`, `paro`, `obs`, `estado`; al cerrar, `correccion`, `cerradoPorNomina`, `cerradoPorNombre`, `fechaCierre`, `tsCierre` |
| `cal/matriz/<defecto>@<máquina>` | Admin | `defecto`, `maquina` (vacía = todas), `vars: [{nombre, peso}]`, `actualizadoPor`, `actualizadoEn` |
| `cal/merma` | Admin | `datos[línea][defecto][AAAA-MM] = metros`, `registros`, `ultimoMes`, `cargadoPor`, `cargadoEn` |
| `cal/merma2/<id>` | Los tres papeles | Cada rechazo de Merma 2: `folio`, `etiqueta`, `etiquetaNombre`, `etiquetaCliente`, `etiquetaEnGaleria`, `maquina`, nómina y nombre de supervisor, operador e inspector, `defecto`, `metros`, `bobinas`, `fecha`, `turno`, `ts`, `capturoNomina`, `capturoNombre` (SPEC-017) |
| `cal/merma2Folios/<folio>` | Los tres papeles | El `<id>` del rechazo con ese folio. Se escribe junto con el rechazo; es lo que impide repetir un folio. Si se borra un rechazo a mano en la consola, hay que borrar también su folio aquí |
| `cal/etiquetas/<Etiq>` | Admin | Los 15 campos de la galería con el nombre de su encabezado (`Etiq`, `Nombre_etiq`, `Tipo`, … `Tipo_tinta`), más `actualizadoPor`, `actualizadoEn` y `origen` (`excel` o `manual`). Los vacíos no se guardan |

La columna «Quién escribe» es lo que permite la pantalla. **Las reglas de la
base no lo hacen cumplir** (ver Seguridad).

### La galería de etiquetas

Son unas 5 600 etiquetas y pesan cerca de 1.7 MB. No se descargan al abrir la
app, sino al entrar por primera vez a la pestaña Galería, y no quedan
escuchando cambios (SPEC-015). Si se cambia a una lectura en vivo (`.on`),
cada apertura de la app descargaría ese peso: revisar antes el consumo del
plan.

Para corregir muchas etiquetas a la vez, lo más simple es subir un Excel solo
con esas filas: agrega o actualiza, nunca borra. Para borrar una etiqueta hay
que hacerlo en la consola de Firebase; la app no lo permite a propósito.

### La semilla incrustada

`index.html` trae en la constante `DATOS` la merma de 2025 y 2026 agregada por
línea, defecto y mes, los 40 defectos y las 20 máquinas. Mientras nadie cargue
un archivo en la pestaña Merma, el foco usa esa semilla. Cuando se carga uno,
la de `cal/merma` la sustituye por completo.

Detalles conocidos de la semilla, que no afectan el funcionamiento:
- Trae líneas que no están en el catálogo de máquinas (`LAM`, `PEG`,
  `PEG1 ` con espacio al final). Sus datos no aparecen en ningún selector
- En RT6 · RAYA hay un registro con mes `2006-06`, casi seguro un error de
  captura de `2026-06` en el archivo original. Al estar fuera de toda ventana
  de foco, solo se ve en la pestaña Comportamiento

---

## Seguridad

**Estado actual.** `database.rules.json` dice:

```json
{ "rules": { ".read": "auth != null", ".write": "auth != null" } }
```

Una sesión anónima cumple `auth != null`, y cualquiera puede abrir una con la
configuración pública de `index.html`. En la práctica, **cualquier persona con
la dirección puede leer y escribir todo `cal/` sin pasar por la suite.** Los
papeles (quién inspecciona, quién cierra, quién edita la matriz) solo se
aplican en la pantalla.

**Cómo cerrarlo.** Mantenimiento ya resolvió lo mismo (SPEC-061 de su
repositorio). El worker de Cloudflare `mantoapp-push` valida la sesión de la
suite y entrega una credencial firmada con nómina y papel, y las reglas
deciden con ella. Para esta app haría falta:

1. Agregar al worker una cuenta de servicio de `impredimex-procesos` y aceptar
   `app: 'calidad'` en `/credencial`
2. En `index.html`, cambiar `signInAnonymously()` por la credencial del worker
3. Reescribir `database.rules.json` con los permisos de la tabla de Datos
4. Deshabilitar el proveedor Anónimo en `impredimex-procesos`

**App Check** está preparado en el código y apagado: `APPCHECK_SITE_KEY` vacía.

La configuración de Firebase que aparece en `index.html` es pública por diseño;
no es un secreto. Lo que protege los datos son las reglas.

**Para cambiar las reglas:** Firebase → `impredimex-procesos` → Realtime
Database → Reglas. Antes de publicar, copiar las vigentes a un archivo y probar
el cambio en el simulador de la misma pantalla. Mantener `database.rules.json`
igual a lo publicado.

---

## Solución de problemas

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| «Tu cuenta no tiene acceso a Control de Procesos» | Falta `calidad` en `apps` | Asignarlo desde RRHH (Directorio → llave) |
| Entra pero no ve la pestaña Inspección | Tiene papel `SUPERVISOR` | Es lo esperado: el supervisor atiende, no inspecciona |
| «Sin acceso a la base. Avisa a sistemas.» | El proveedor Anónimo está deshabilitado en `impredimex-procesos`, o las reglas cambiaron | Revisar Authentication y Reglas del proyecto |
| El foco dice «Sin historia suficiente» | La máquina no tiene merma ni hallazgos en ningún periodo revisado | Normal para máquinas sin registros; se llena con hallazgos |
| «Todavía no hay variables asociadas» | La matriz está vacía para esos defectos | Capturarla en la pestaña Matriz (solo Admin) |
| Un cambio publicado no se ve en el teléfono | Copia guardada por el service worker | Confirmar que se subió `CACHE` en `sw.js`; cerrar y abrir la app dos veces |
| El turno o la fecha salen mal | La hora o la zona horaria del teléfono están mal | Ajustar el teléfono a la hora automática. El turno y la fecha salen de su reloj (SPEC-016) |
| En Merma 2, «no está en el padrón de RRHH» | La nómina no existe en `colaboradores` o se tecleó mal | Revisar la nómina; si es alguien nuevo, que RRHH lo dé de alta |
| En Merma 2, «está dado de baja en RRHH» | La ficha tiene `estatus` distinto de `ACTIVO` | Es lo esperado; si la persona sigue trabajando, RRHH corrige su estatus |
| «La etiqueta … no está en la galería» | No se ha dado de alta | Darla de alta en Galería; la inspección se puede registrar igual |
| La pantalla de marca IMPREDIMEX dura hasta 8 s | La nota de sesión compartida quedó vieja | Se quita sola; aparece la contraseña (SPEC-013) |

---

## Pendientes

Lo que falta de cada especificación está en [`SPECS.md`](./SPECS.md), en la
tabla de estado y en la sección «Lo que falta» de cada una. Lo que depende de
decisiones de Calidad está en «Trabajo pendiente de definir», al final de ese
documento.
