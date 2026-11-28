# HANDOVER.md — Guía técnica de mantenimiento

Lo que necesita saber quien reciba esta aplicación para operarla, corregirla y
extenderla sin depender de quien la construyó.

**Versión de la aplicación:** 1.26.0
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
| `cal/inspecciones/<id>` | Inspector, Admin | Etapa (`arranque` en registros viejos; `proceso` = seguimiento a corrida), `op`, `master`, `corridaId`, `puntos`, `puntosNoCumple` (SPEC-028), turno, `hora` (SPEC-027), máquina, etiqueta, `operadorNomina`, `operadorNombre`, `etiquetaNombre`, `etiquetaCliente`, `etiquetaEnGaleria`, fecha (local, `AAAA-MM-DD`), `ts`, `inspectorNomina`, `inspectorNombre`, `resultado`, `variables`, `variablesDesviadas` y, si no pasó, `hallazgoId` |
| `cal/hallazgos/<id>` | Inspector, Admin; al cerrar, Supervisor o Admin | Lo de la inspección más `defecto`, `causa`, `causaDeterminada`, `metros`, `paro`, `obs`, `estado`; al cerrar, `correccion`, `cerradoPorNomina`, `cerradoPorNombre`, `fechaCierre`, `tsCierre` |
| `cal/arranques/<id>` | Los tres papeles | Arranque de calidad (SPEC-028): máquina, `area`, `formato`, `op`, etiqueta, operador, auditor, fecha, hora, turno, `requisitos`, `puntos` (`r`, `medida`, `nominal`, `tol`, `grado`, `gradoMin`, `estandar`), `areaLibre`, `comentarios`, `resultado` (`liberado` / `no liberado`), `motivos`, `intento` y, si se liberó, `corridaId` |
| `cal/corridas/<AAAA-MM-DD>_<id>` | Los tres papeles | La fecha es la de liberación (desde la v1.22.0; las de prueba anteriores no la traen). Corrida abierta por un arranque liberado: máquina, `op`, etiqueta, `arranqueId`, `liberoNomina`, `liberoNombre`, fecha, hora, `estado` (`activa` / `cerrada`), `revisiones`, `masters` (el más alto revisado), `ultimaHora`, `ultimoResultado`, `ultimoOperadorNomina`, `ultimoOperadorNombre`; al cerrar, `cerrada*` y `motivoCierre` (`terminada` / `nuevo arranque`) |
| `cal/merma2Recuperados/<id>` | Admin | Folios recuperados de `merma2Borrados` (SPEC-030): folio, quién y cuándo lo recuperó, cuándo se había borrado y el motivo |
| `cal/borrados/<tipo>/<id>` | Admin | Copia de lo borrado (SPEC-029): `corridas`, `hallazgos`, `inspecciones`, `arranques`, `correcciones` (de hallazgos reabiertos) o `accionesMerma` (lo recuperado y la acción de un defecto), con `borradoPorNomina`, `borradoPorNombre`, `borradoEn` y `motivo`. Sirve para recuperar un registro |
| `cal/especificaciones/<área>/<punto>` | Admin | Lo que cambió del formato de arranque: `std`, `seg`, `tol` (mm), `gradoMin`, y quién y cuándo. Lo que no está aquí viene del código (`FORMATOS_BASE`) |
| `cal/matriz/<defecto>@<máquina>` | Admin | `defecto`, `maquina` (vacía = todas), `vars: [{nombre, peso}]`, `actualizadoPor`, `actualizadoEn` |
| `cal/merma` | Ya nadie (hasta la v1.7.0, Admin) | La última carga del cargador anterior: `datos[línea][defecto][AAAA-MM] = metros`, `registros`, `ultimoMes`, `cargadoPor`, `cargadoEn`. Si existe, es la base histórica del foco (SPEC-018) |
| `cal/merma2/<AAAA-MM-DD>_<id>` | Los tres papeles (formulario); Admin (Excel) | Cada rechazo. La clave empieza con su fecha para leer un mes sin índices; los de antes de la v1.8.0 tienen clave sin fecha. Campos: `origen` (`formulario` o `excel`), `ordenProduccion` (SPEC-024), `accionesQuitado` (quitado de la lista de Acciones de merma, con `porNomina`, `porNombre`, `en`, `motivo`; SPEC-029 v1.25.0), `folio` (automático, `año-N`, SPEC-026), `folioAnterior` (el que tenía antes de renumerar), `folioArchivo` (el del Excel de donde se cargó), `folio`, `etiqueta`, `etiquetaNombre`, `etiquetaCliente`, `etiquetaEnGaleria`, `maquina` (de inspección), `maquinaGenera` (la que genera el defecto; con ella cuenta el foco, SPEC-021), nómina y nombre de supervisor, operador e inspector, `defectos: [{defecto, numero, etiquetas, metros, bobinas}]` (cada defecto puede traer además `recuperadoEtiquetas`, `recuperadoMetros`, `accion`, `accionPorNomina`, `accionPorNombre` y `accionEn`, registrados en Acciones, SPEC-023), `etiquetasTotal`, `metrosTotal`, `bobinasTotal`, `medDes` y `repeticiones` (copia de las medidas con que se calcularon los metros, SPEC-020), `fecha`, `turno`, `ts`, `capturoNomina`, `capturoNombre` (SPEC-017) |
| `cal/merma2Folios/<folio>` | Los tres papeles | El `<id>` del rechazo con ese folio. Es lo que impide repetir un folio |
| `cal/merma2Contador/<año>` | Se escribe solo | Último consecutivo de folio del año. Al capturar se sube con transacción (SPEC-026). «Renumerar folios por fecha» lo deja en el total del año |
| `cal/merma2Ediciones/<clave>/<n>` | Admin, al editar | `antes` (el rechazo como estaba), `editadoPorNomina`, `editadoPorNombre`, `editadoEn` (SPEC-019) |
| `cal/merma2Borrados/<clave>` | Admin, al borrar | Copia de cada rechazo borrado con `borradoPorNomina`, `borradoPorNombre`, `borradoEn` y `motivo` (SPEC-019) |
| `cal/mermaResumen/<máquina>/<defecto>/<AAAA-MM>` | Se escribe solo | Metros de los rechazos sumados por mes. Es lo que lee el foco, para no descargar todos los rechazos en cada apertura. Cada rechazo suma aquí en la misma escritura en que se guarda (SPEC-018) |
| `cal/defectosCatalogo` | Admin, una vez por versión | `version`, `aplicadoPor`, `aplicadoEn`, `quitados` |
| `cal/defectos/<id>` | Admin | `numero`, `nombre`, `creadoPor`, `creadoEn` y, si se renombró, `editadoPor`, `editadoEn` (SPEC-022) |
| `cal/defectosRenombrados/<anterior>` | Admin, al renombrar | Nombre nuevo; el foco lo aplica a la base histórica |
| `cal/etiquetasBorradas/<Etiq>` | Admin, al borrar | La etiqueta como estaba, más `borradoPorNomina`, `borradoPorNombre`, `borradoEn` |
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
con esas filas: agrega o actualiza, nunca borra. Una por una, el administrador
las edita o las borra desde la tabla (SPEC-022); al borrar se guarda una copia
en `cal/etiquetasBorradas`.

### El catálogo de defectos

Vive en `cal/defectos` (con `numero` y `nombre`) y se administra en Galería →
Defectos (SPEC-022). La lista oficial está en el código (`DEFECTOS_OFICIALES`)
con su versión (`VERSION_CATALOGO`); si se cambia la lista en el código, hay
que subir la versión para que la app la aplique, y la versión aplicada queda
en `cal/defectosCatalogo`, con los defectos que se quitaron. Al
**renombrar** un defecto la app lo cambia en rechazos, hallazgos y matriz,
recalcula el resumen y anota el renombre en `cal/defectosRenombrados` para la
base histórica. Al **borrar**, lo ya registrado lo conserva. Si se borra
`cal/defectos` completo en la consola, el siguiente administrador que entre lo
vuelve a sembrar con la lista oficial.

### De dónde sale el foco (SPEC-018)

Una sola fuente de metros por máquina, defecto y mes:
- **Desde el primer mes con rechazos registrados**, los rechazos (formulario y
  Excel), a través de `cal/mermaResumen`.
- **Antes de ese mes**, la base histórica: `cal/merma` si existe, y si no, la
  semilla incrustada.

La pestaña Merma le dice al administrador desde qué mes se usan los rechazos.

### Borrar o corregir un rechazo

Desde la app (SPEC-019), pestaña Merma → tabla, columnas solo del
administrador:
- **Editar** carga el rechazo en el formulario. Al guardar, ajusta el foco con
  la diferencia y guarda la versión anterior en `cal/merma2Ediciones/<clave>`.
- **Borrar**, con motivo, quita el rechazo, libera el folio, resta sus metros
  del foco y guarda una copia en `cal/merma2Borrados`.

**Recuperar uno borrado por error**, en la consola de Firebase:
1. Copiar el registro de `cal/merma2Borrados/<clave>` a `cal/merma2/<clave>`
   (la misma clave), quitando `borradoPorNomina`, `borradoPorNombre`,
   `borradoEn` y `motivo`.
2. Crear `cal/merma2Folios/<folio>` con el valor `<clave>`.
3. En la app, **Recalcular resumen**.

Si alguien borra un rechazo directo en la consola, hay que borrar también su
folio en `cal/merma2Folios` y luego **Recalcular resumen**.

### La semilla incrustada

`index.html` trae en la constante `DATOS` la merma de 2025 y 2026 agregada por
línea, defecto y mes, los 40 defectos y las 20 máquinas. Es la base histórica
del foco mientras no exista `cal/merma`, y solo para los meses anteriores al
primer rechazo registrado.

Detalles conocidos de la semilla, que no afectan el funcionamiento:
- Trae líneas que no están en el catálogo de máquinas (`LAM`, `PEG`,
  `PEG1 ` con espacio al final). Sus datos no aparecen en ningún selector
- En RT6 · RAYA hay un registro con mes `2006-06`, casi seguro un error de
  captura de `2026-06` en el archivo original. Al estar fuera de toda ventana
  de foco, solo se ve en la pestaña Comportamiento

---

## Seguridad

**Estado actual** (publicado el 24 de noviembre de 2026; antes eran
`true`/`true`, abiertas a cualquiera):

```json
{ "rules": { ".read": false, ".write": false,
             "cal": { ".read": "auth != null", ".write": "auth != null" } } }
```

Los nodos de la versión anterior, fuera de `cal/`, quedan cerrados para todos.
Respaldarlos (Datos → ⋮ → Exportar JSON) antes de decidir borrarlos.

Una sesión anónima cumple `auth != null`, y cualquiera puede abrir una con la
configuración pública de `index.html`. En la práctica, **quien tenga la
dirección todavía puede leer y escribir `cal/` sin pasar por la suite.** Los
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
| Los metros no se calculan y piden escribirse a mano | La etiqueta no está en la galería, o le falta `Med_des` o `Repeticiones` (o son 0) | Completar la etiqueta en Galería → Editar. Fórmula: (etiquetas × (Med_des / 100)) / Repeticiones (SPEC-020) |
| El foco no cambia después de borrar un rechazo en la consola | El resumen todavía tiene sus metros | Pestaña Merma → Recalcular resumen |
| Una carga de Excel dice que un folio «ya está registrado» | Ese folio ya se capturó (en el formulario o en otra carga) | Es lo esperado: una carga nunca sobrescribe. Si el registrado está mal, borrarlo en la consola y volver a cargar |
| En Merma, «no está en el padrón de RRHH» | La nómina no existe en `colaboradores` o se tecleó mal | Revisar la nómina; si es alguien nuevo, que RRHH lo dé de alta |
| En Merma, «está dado de baja en RRHH» | La ficha tiene `estatus` distinto de `ACTIVO` | Es lo esperado; si la persona sigue trabajando, RRHH corrige su estatus |
| «La etiqueta … no está en la galería» | No se ha dado de alta | Darla de alta en Galería; la inspección se puede registrar igual |
| La pantalla de marca IMPREDIMEX dura hasta 8 s | La nota de sesión compartida quedó vieja | Se quita sola; aparece la contraseña (SPEC-013) |

---

## Pendientes

Lo que falta de cada especificación está en [`SPECS.md`](./SPECS.md), en la
tabla de estado y en la sección «Lo que falta» de cada una. Lo que depende de
decisiones de Calidad está en «Trabajo pendiente de definir», al final de ese
documento.
