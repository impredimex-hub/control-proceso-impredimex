# CHANGELOG

Todos los cambios notables de Control de Procesos (`control-proceso-impredimex`)
se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el
versionado sigue [Semantic Versioning](https://semver.org/lang/es/).

Las versiones 1.0.0 a 1.2.0 se registraron al adoptar este archivo, a partir del
historial del repositorio y de `SPECS.md`.

---

## [1.23.1] — 2026-11-27

### Cambiado

- El botón de borrar (SPEC-029) ahora es un círculo rojo con una «B» blanca, y
  en las tablas va en la última columna.

### Agregado

- **Borrar varios folios de una vez** en «Acciones de merma»: casilla por
  folio, «seleccionar todos» en el encabezado y botón «Borrar seleccionados».
  Un solo motivo y una sola escritura.
- Caché del service worker a `calidad-v1.23.1`.

---

## [1.23.0] — 2026-11-27

### Agregado

- **Borrar, solo administrador** (SPEC-029), con un botón discreto en:
  - **Corridas activas**: borra la corrida; su arranque y sus seguimientos se
    quedan.
  - **Acciones de la inspección**: borra el hallazgo; la inspección que lo
    originó se queda.
  - **Acciones de merma**: borra el folio de rechazo completo, igual que en la
    pestaña Merma.
  - **Inspecciones registradas**: borra la inspección (y su hallazgo, si abrió
    uno; la corrida se recalcula) o el arranque (y la corrida que abrió).
- Cada borrado pide el motivo, se hace en una sola escritura y deja una copia
  en `cal/borrados/<tipo>/<id>` con quién y cuándo.
- Las tablas de Historial y Acciones se actualizan al momento cuando cambian
  inspecciones o hallazgos.
- Caché del service worker a `calidad-v1.23.0`.

---

## [1.22.1] — 2026-11-26

### Agregado

- Botón **Nuevo arranque** junto a «Terminar corrida» (SPEC-028): pasa a la
  etapa de arranque con etapa y máquina libres y OP, etiqueta y master vacíos.
  La corrida sigue activa hasta que se termina o se libera otro arranque en su
  máquina.

### Cambiado

- «Corridas activas» se ve también en la etapa de arranque, para regresar a una
  corrida.
- Caché del service worker a `calidad-v1.22.1`.

---

## [1.22.0] — 2026-11-26

### Agregado

- **Corridas terminadas** en Historial (SPEC-028): tabla por mes de liberación
  (o todo el histórico) con máquina, OP, etiqueta, nombre, liberada y quién,
  terminada y quién, duración, revisiones, último master y motivo de cierre.
  Se exporta a Excel. Al tocar una corrida se ven su arranque y todas sus
  revisiones de seguimiento.

### Cambiado

- La clave de una corrida nueva empieza con su fecha de liberación
  (`AAAA-MM-DD_<id>`), para leer un mes por rango de clave.
- Caché del service worker a `calidad-v1.22.0`.

---

## [1.21.3] — 2026-11-26

### Cambiado

- Se quitan el botón «Cambiar de máquina» y la tarjeta «Corrida en esta
  máquina» (SPEC-028). La corrida en revisión se resalta en «Corridas activas»;
  tocarla otra vez la suelta para elegir otra máquina o hacer un arranque.
- «Terminar corrida» queda al final de «Datos de la inspección». La tarjeta,
  ahora «Arranque pendiente», solo aparece en una máquina sin arranque liberado.
- Caché del service worker a `calidad-v1.21.3`.

---

## [1.21.2] — 2026-11-26

### Corregido

- **Etapa y máquina también quedan bloqueadas** con la corrida liberada
  (SPEC-028). Se sueltan con el botón nuevo «Cambiar de máquina» de la corrida,
  o tocando otra fila de «Corridas activas».
- Caché del service worker a `calidad-v1.21.2`.

---

## [1.21.1] — 2026-11-26

### Cambiado

- **Con la corrida liberada, los datos quedan bloqueados** (SPEC-028): en el
  seguimiento, OP, etiqueta y número de master no se modifican; el master es
  el siguiente al último revisado. Solo se cambia la nómina del operador, que
  la app propone (la de la última revisión de la corrida, o la del arranque).
- La corrida guarda el último operador que revisó.
- Caché del service worker a `calidad-v1.21.1`.

---

## [1.21.0] — 2026-11-26

### Cambiado

- **Sin arranque no hay seguimiento** (SPEC-028): en las máquinas con formato
  de arranque, el seguimiento a corrida solo se registra si hay un arranque
  liberado. Sin él, la pantalla muestra el aviso y el botón «Hacer el
  arranque». Se quita la marca «sin arranque liberado».
- **Número de master** en lugar de número de bobina en el seguimiento. Se guarda
  como `master` en la inspección y `masters` en la corrida.
- Caché del service worker a `calidad-v1.21.0`.

---

## [1.20.0] — 2026-11-26

### Agregado

- **Arranque de calidad y seguimiento a corrida** (SPEC-028; completa la
  SPEC-003). La etapa ahora cambia lo que se pregunta:
  - **Arranque**: el «Apartado exclusivo de calidad» de la hoja, con el formato
    del área de la máquina: Rotograbado (16 puntos) y Flexografía (15).
    Requisitos previos, verificación contra estándar (Cumple / No cumple / NA),
    área libre del pedido anterior, comentarios, y firma y hora automáticas.
    Liberado / No liberado se calcula solo, con los motivos. Cada intento queda
    registrado.
  - Medida eje y desarrollo muestran `Med_eje` y `Med_des` de la galería en mm;
    espesor de material muestra los sustratos.
  - **Corrida**: un arranque liberado la abre; una máquina tiene a lo sumo una
    activa; se termina a mano o con el siguiente arranque liberado.
  - **Seguimiento a corrida** (antes «En proceso»), por bobina: OP y etiqueta
    salen de la corrida; puntos del producto, variables de proceso y Pasa / No
    pasa. Con un punto en No cumple solo se puede registrar No pasa. Sin
    corrida activa se registra igual, marcado «sin arranque liberado».
  - Tabla de **corridas activas** en la pestaña Inspección.
  - Campo **Orden de producción** en la inspección.
- **Formatos de arranque** en Galería: estándares, si el punto se revisa en el
  seguimiento, tolerancia de medidas (mm) y grado mínimo del código de barras.
  Solo el administrador edita; los rangos quedan sin definir hasta que Calidad
  los tenga.
- El historial muestra arranques y seguimientos juntos.

### Cambiado

- Inspección, hallazgo y corrida se graban en una sola escritura.
- Caché del service worker a `calidad-v1.20.0`.

---

## [1.19.0] — 2026-11-26

### Agregado

- **Operador, hora y auditor en la inspección** (SPEC-027): nómina del
  operador con el nombre desde el padrón (obligatorio), hora de inspección que
  se registra al tocar Pasa o No pasa, y auditor tomado de la sesión. Se
  guardan en la inspección y el hallazgo, y se ven en Historial y en las
  Acciones de la inspección (columnas Hora, Operador y Auditor).

### Corregido

- En «Qué vigilar en esta máquina», la barra del defecto con variables
  («vigilar: …») empezaba más a la derecha que las demás.
- Caché del service worker a `calidad-v1.19.0`.

---

## [1.18.1] — 2026-11-25

### Cambiado

- **Todas las pestañas con el mismo ancho en computadora** (hasta 1,600 px, el
  de la tabla de rechazos), incluida la barra de pestañas; los formularios ya
  no se angostan. En el teléfono y la tableta no cambia nada.
- Caché del service worker a `calidad-v1.18.1`.

---

## [1.18.0] — 2026-11-25

### Cambiado

- **Folio de rechazo automático**, año-consecutivo (`2026-1093`) (SPEC-026).
  El formulario muestra el siguiente y lo asigna al guardar, con transacción;
  el consecutivo empieza en 1 cada año. Al editar, el folio no cambia.
- **Carga de Excel**: el folio del archivo solo agrupa renglones (se guarda
  como `folioArchivo`); a cada rechazo se le asigna folio automático en orden
  de fecha. Un rechazo ya registrado se reconoce por sus datos (fecha, OP,
  etiqueta, máquina y defectos), no por el folio.

### Agregado

- **Renumerar folios por fecha** (solo `ADMIN`): ordena todos los rechazos de
  cada año de la fecha más antigua a la más reciente y les asigna `año-1`,
  `año-2`, …; muestra antes cuántos cambian. Cada rechazo guarda su
  **Folio anterior**, que sale en el Excel.
- Caché del service worker a `calidad-v1.18.0`.

---

## [1.17.0] — 2026-11-25

### Agregado

- **Máquinas REV1, REV2, REV3 y REV6** (área REVISADO) en el catálogo
  (SPEC-025).

### Cambiado

- **Carga de Excel ajustada al archivo «Rechazo interno»** (SPEC-025): basta
  con la máquina de inspección o la que genera; `R5`, `R6` y `R7` se leen como
  `RT5`, `RT6` y `RT7`; un `#N/A` en # defecto cuenta como vacío; se aceptan
  los encabezados «Supervisor», «Operador» e «Inspector»; se rechazan fechas
  futuras.
- Al editar un rechazo sin máquina de inspección, puede seguir sin ella.
- Caché del service worker a `calidad-v1.17.0`.

---

## [1.16.0] — 2026-11-25

### Agregado

- **Orden de producción** en el formulario de rechazo, entre Folio y # de
  etiqueta (SPEC-024). Obligatoria al capturar; columna nueva en tabla, Excel y
  plantilla; opcional al cargar un Excel.
- Caché del service worker a `calidad-v1.16.0`.

---

## [1.15.1] — 2026-11-25

### Cambiado

- **Acciones y Merma aprovechan la pantalla de la computadora**, como ya lo
  hacía Galería: hasta 1,600 px de ancho, con los formularios angostos y
  centrados. En el teléfono no cambia nada.
- Caché del service worker a `calidad-v1.15.1`.

---

## [1.15.0] — 2026-11-25

### Cambiado

- **Acciones de la inspección en tabla**, con el mismo formato que las de
  merma (SPEC-007): Fecha fija, Estado y Corrección con un solo botón
  **Atender y cerrar**, y el resto de los datos del hallazgo en columnas.
  Filtro por estado y por mes, y **Exportar a Excel**.
- Caché del service worker a `calidad-v1.15.0`.

---

## [1.14.1] — 2026-11-25

### Cambiado

- En Acciones de merma queda **un solo botón Registrar**, en Recuperado, que
  captura lo recuperado y la acción juntos. El de la columna Acción hacía lo
  mismo y se veía desalineado (SPEC-023).
- Caché del service worker a `calidad-v1.14.1`.

---

## [1.14.0] — 2026-11-25

### Agregado

- **Acciones de merma** en la pestaña Acciones (SPEC-023), debajo de las
  acciones de la inspección: la tabla de rechazos de Merma con las columnas
  **Recuperado** y **Acción** después de Folio, por defecto. Supervisor y
  Administrador registran lo recuperado (en etiquetas, con los metros en la
  misma proporción; en metros si el rechazo no tiene etiquetas) y la acción.
  Filtro por mes y por acción, y exportación a Excel con etiquetas y metros
  recuperados, merma neta, acción, quién registró y fecha.
- Al editar un rechazo en Merma, cada defecto conserva su recuperado y su
  acción.

### Corregido

- **Lo que se abría en el primer instante se quedaba en «Cargando…»**: la
  espera de conexión se creaba antes de conectar y nunca se cumplía. Le pasaba
  al supervisor, cuya primera pestaña es Acciones.
- El cierre de una acción de inspección decía que la causa confirmada
  «alimenta la matriz», lo que todavía no es cierto. Ahora dice que queda
  registrada como la causa del hallazgo.
- Caché del service worker a `calidad-v1.14.0`.

---

## [1.13.0] — 2026-11-24

### Cambiado

- **Catálogo oficial de 36 defectos numerados**, definido por Calidad
  (SPEC-022). La primera vez que un administrador abre la app, el catálogo de
  la base queda igual a la lista: cada defecto toma su número y salen
  ADHESIVO, FALTA DE TINTA, LAMINACIÓN y PEGADO (lo registrado con ellos lo
  conserva). La tabla de defectos muestra el número y ordena por él; Nuevo y
  Editar piden número.

### Agregado

- **# defecto** junto a Defecto en el formulario de rechazo (SPEC-021): al
  llenar uno se llena el otro. Columna **# defecto** en tabla, Excel y
  plantilla; al cargar basta con uno de los dos y, si vienen ambos, deben
  coincidir.
- Caché del service worker a `calidad-v1.13.0`.

---

## [1.12.0] — 2026-11-24

### Agregado

- **Máquina que genera** en el rechazo (SPEC-021), junto a la que ahora se
  llama **Máquina de inspección**. El foco cuenta los metros en la máquina que
  genera; sin ella, en la de inspección. Columnas nuevas en tabla, Excel y
  plantilla; en la carga es opcional.
- **Defecto con autocompletado** en el formulario de rechazo, sin importar
  acentos ni mayúsculas; un texto fuera del catálogo no se acepta.
- **Catálogo de defectos editable** en la pestaña Galería (SPEC-022): nuevo,
  renombrar (se aplica a rechazos, hallazgos, matriz, foco e histórico) y
  borrar. Vive en `cal/defectos`; se siembra con los 40 del código.
- **Editar y Borrar etiquetas** en columnas propias de la tabla de la
  galería; al borrar se guarda una copia en `cal/etiquetasBorradas`.

### Cambiado

- Caché del service worker a `calidad-v1.12.0`.

---

## [1.11.0] — 2026-11-24

### Cambiado

- **La cantidad rechazada se captura en número de etiquetas** (SPEC-020). Los
  metros lineales se calculan solos: (etiquetas × (Med_des / 100)) /
  Repeticiones, con las medidas de la etiqueta en la galería, y la cuenta se
  ve debajo. Si la etiqueta no tiene medidas, los metros se escriben a mano.
- El rechazo guarda las etiquetas de cada defecto y copia de `Med_des` y
  `Repeticiones` con que se calculó.
- Columna **Etiquetas rechazadas** en la tabla, el Excel y la plantilla. Al
  cargar un Excel, con etiquetas y medidas los metros se calculan; sin
  etiquetas se usan los del archivo.
- Caché del service worker a `calidad-v1.11.0`.

---

## [1.10.0] — 2026-11-24

### Agregado

- **Editar un rechazo** (SPEC-019), solo `ADMIN`: lo carga en el formulario con
  las mismas validaciones; conserva fecha, turno y quién lo capturó; ajusta el
  foco con la diferencia y guarda la versión anterior en
  `cal/merma2Ediciones`. Si cambia el folio, el nuevo se aparta y el anterior
  se libera.

### Cambiado

- **Editar y Borrar tienen columna propia** en la tabla, después de Folio.
  Antes, Borrar estaba dentro de la celda del folio.
- Caché del service worker a `calidad-v1.10.0`.

---

## [1.9.0] — 2026-11-24

### Agregado

- **Borrar un rechazo** (SPEC-019), solo `ADMIN`: botón en la celda del
  folio, con confirmación y motivo obligatorio. En una sola escritura quita el
  rechazo, libera su folio, resta sus metros del foco y guarda una copia en
  `cal/merma2Borrados` con quién, cuándo y por qué.

### Cambiado

- Para el foco, un mes con menos de 0.001 m en el resumen no cuenta (queda en
  0 después de borrar).
- Caché del service worker a `calidad-v1.9.0`.

---

## [1.8.1] — 2026-11-24

### Seguridad

- **Reglas de la base publicadas.** Estaban abiertas a cualquiera
  (`.read: true`, `.write: true`). Ahora `cal/` pide sesión y los nodos de la
  versión anterior quedan cerrados. `database.rules.json` coincide con lo
  publicado, y se habilitó el acceso anónimo en Authentication.

### Corregido

- **Con reglas que exigen sesión, la app no podía leer la base.** Abría sus
  lecturas al mismo tiempo que la sesión anónima, y las que llegaban antes de
  tenerla eran rechazadas sin reintento. Con las reglas públicas no se notaba.
  Ahora espera la sesión: las escuchas al arrancar, y la galería, la búsqueda
  de etiqueta y la tabla de Merma cuando se abren en el primer instante.
- Si la sesión anónima falla, el aviso dice el motivo, y una lectura rechazada
  se informa en lugar de quedar en silencio.
- Caché del service worker a `calidad-v1.8.1`.

---

## [1.8.0] — 2026-11-24

### Cambiado

- **Merma y Merma 2 son una sola pestaña, «Merma»** (SPEC-018), con el
  formulario del día a día, la carga de Excel (solo `ADMIN`) y la tabla, en
  ese orden. La pestaña Merma 2 desaparece, y Merma la ven los tres papeles.
- **El foco, la tendencia y Comportamiento salen de los rechazos**, del
  formulario y del Excel. La base histórica (la última carga anterior o la
  semilla incrustada) solo cuenta para los meses anteriores al primer rechazo
  registrado, así un mes nunca se cuenta de dos fuentes.
- **La tabla de rechazos se ve por mes**, con el mismo selector del Excel.
- Los rechazos nuevos se guardan con clave que empieza con su fecha y con
  `origen` (`formulario` o `excel`). Los anteriores se siguen leyendo.

### Agregado

- **Carga de Excel con las mismas columnas que el formulario**, un renglón por
  defecto. Valida como el formulario, completa nombre y cliente desde la
  galería y nombres desde el padrón, salta los folios ya registrados y rechaza
  completo un folio con errores. Resumen antes de guardar.
- **Descargar plantilla**, con los encabezados y una hoja de máquinas y
  defectos válidos.
- **Resumen de merma para el foco** (`cal/mermaResumen`), que cada rechazo
  actualiza al guardarse, y **Recalcular resumen** para el administrador.

### Quitado

- El cargador agregado de la SPEC-011 (Fecha, Linea, Defecto, Mts rechazados).
  Su última carga, si existe, se conserva como base histórica.
- Caché del service worker a `calidad-v1.8.0`.

---

## [1.7.0] — 2026-11-24

### Agregado

- **Excel de rechazos por mes** (SPEC-017): se elige el mes en curso, uno de
  los once anteriores o todo el histórico.

### Corregido

- **En la tabla de rechazos, el segundo defecto de un folio se quedaba pegado
  a la orilla izquierda**, encima de la columna Folio, al desplazarse a lo
  ancho. La regla de la galería fijaba la primera celda de cada renglón, y en
  esos renglones la primera celda es el defecto. Ahora se fija solo el Folio.
- Los folios con varios defectos no tomaban completo su color alternado.
- Caché del service worker a `calidad-v1.7.0`.

---

## [1.6.0] — 2026-11-24

### Agregado

- **Varios defectos por folio** en Merma 2 (SPEC-017). Cada defecto con sus
  metros lineales y bobinas; «+ Agregar otro defecto» y «Quitar», y el total
  del folio a la vista. Un defecto no se repite dentro del mismo folio.
- **Rechazos registrados en tabla**, un renglón por defecto, con los datos del
  folio agrupados.
- **Exportar a Excel** todos los rechazos, con encabezado en color, filtro,
  fechas de Excel y folios en colores alternados.

### Cambiado

- **El folio se aparta con una transacción.** Antes se revisaba si existía y
  luego se escribía: dos capturas del mismo folio al mismo tiempo podían
  entrar las dos. Ahora solo entra la primera.
- La librería de Excel pasa a `xlsx-js-style` 1.2.0, la misma de
  Mantenimiento, para poder escribir colores. La lectura de merma y galería no
  cambia.
- Caché del service worker a `calidad-v1.6.0`.

---

## [1.5.0] — 2026-11-24

### Agregado

- **Pestaña Merma 2** (SPEC-017): formulario de registro de rechazo con Folio
  de rechazo, # de etiqueta, Nombre de etiqueta, Cliente, Máquina, nómina y
  nombre de Supervisor, Operador e Inspector, Defecto, y cantidad rechazada en
  metros lineales y en número de bobinas.
  - Nombre de etiqueta y Cliente se derivan del # de etiqueta, desde la
    galería. Si no está, se avisa y se pueden escribir a mano.
  - Los nombres se derivan de las nóminas, desde el padrón de RRHH. No se
    registra con una nómina inexistente o dada de baja.
  - El folio no se repite. Se agregan solos fecha, turno y quién capturó.
  - Debajo, los 50 rechazos más recientes.
  - La usan los tres papeles. La pestaña Merma no cambia.

### Cambiado

- Historial y Acciones marcan «fuera de galería» también cuando la etiqueta
  trae nombre escrito a mano.
- Caché del service worker a `calidad-v1.5.0`.

---

## [1.4.0] — 2026-11-24

### Agregado

- **Nombre y cliente de la etiqueta en la inspección** (SPEC-016). Al escribir
  el número, la app lo busca en la galería y los muestra debajo. Si no está,
  avisa pero deja registrar. Se guardan con la inspección y el hallazgo, y se
  ven en Historial y Acciones.
- El campo de etiqueta acepta letras (`D0018`) y completa con ceros una clave
  corta (`2086` → `02086`).

### Cambiado

- **El turno se calcula solo** con la hora del registro: matutino de 06:00 a
  14:00, vespertino de 14:00 a 21:30 y nocturno de 21:30 a 06:00. Ya no se
  elige.

### Corregido

- **La fecha de inspecciones, hallazgos y cierres se tomaba en hora
  universal**: lo registrado después de las 18:00 quedaba con la fecha del día
  siguiente. Ahora es la fecha local del teléfono.

---

## [1.3.0] — 2026-11-24

### Agregado

- **Galería de etiquetas** (SPEC-015). Pestaña nueva con una tabla de 15
  columnas: `Etiq`, `Nombre_etiq`, `Tipo`, `Cliente`, `Estatus`, `Tintas`,
  `Engrane`, `Med_des`, `Med_eje`, `Repeticiones`, `Sustrato1`, `Sustrato2`,
  `Sustrato3`, `Ancho` y `Tipo_tinta`.
  - Búsqueda por clave, nombre o cliente, filtro por tipo y ficha completa al
    tocar un renglón. Encabezado y columna `Etiq` fijos al desplazarse.
  - **Carga desde Excel** con resumen previo: agrega las nuevas, actualiza las
    que cambian y no borra las que no vienen.
  - **Alta y edición** de etiquetas una por una.
  - La ven los tres papeles; cargar, dar de alta y editar es de `ADMIN`.

### Cambiado

- Caché del service worker a `calidad-v1.3.0`.

---

## [1.2.1] — 2026-11-24

### Agregado

- **`README.md`, `HANDOVER.md` y este `CHANGELOG.md`**, con el mismo esquema que
  el resto de la suite.
- **Tabla de estado en `SPECS.md`**, y en cada especificación su estado real
  (implementado, parcial o pendiente), cómo está hoy y lo que le falta. Antes
  todas decían «pendiente», aunque la mayoría ya funcionaba.
- **SPEC-014 — Historial de inspecciones.** La pestaña existía desde la 1.0.0
  sin especificación.
- **Sección «Convenciones del código»** en `SPECS.md`: marcas de
  especificación y dónde se sube la versión.
- **Marcas `SPEC-XXX` en los comentarios de `index.html`**, para ir de cada
  especificación a su código.

### Cambiado

- El comentario de configuración de `index.html` remitía a `contexto-suite.md`,
  que no está en el repositorio; ahora remite a `HANDOVER.md`.
- El comentario de la sesión anónima decía que las reglas «exigirán sesión»;
  ahora dice que hoy la anónima basta.
- Caché del service worker a `calidad-v1.2.1`.

### Notas

No cambia el comportamiento de la aplicación: solo comentarios y documentación.

---

## [1.2.0] — 2026-09-21

### Agregado

- **Abrir sin mostrar la contraseña de paso** (SPEC-013). Si ya hay sesión
  abierta en otra página de la suite, se cubre la pantalla con la marca
  IMPREDIMEX mientras Firebase la confirma, en lugar de mostrar un instante la
  pantalla de contraseña. Se quita sola a los 8 segundos si algo falla.

### Cambiado

- Caché del service worker a `calidad-v1.2.0`.

---

## [1.1.0] — 2026-09-20

### Cambiado

- **Encabezado estándar de la suite** (SPEC-012): marca a la izquierda,
  botones a la derecha, fijo y opaco; nombre y puesto centrados en pantalla
  ancha; panel al tocar la nómina con conexión, papel, «Ir al portal» y
  «Cerrar sesión».
- La sesión guarda también el **puesto** del padrón, solo para el encabezado.
- Caché del service worker a `calidad-v1.1.0`.

### Quitado

- El botón «Salir» de texto en la barra, que pasó al panel.

---

## [1.0.0] — 2026-09-11

Reconstrucción desde cero. La versión anterior (abril a julio de 2026) se
retiró y sus datos no se migran.

### Agregado

- **Acceso con nómina y clave de la suite** (SPEC-001) y papeles `INSPECTOR`,
  `SUPERVISOR` y `ADMIN` (SPEC-002). Desaparecen las tres contraseñas
  compartidas de la versión anterior.
- **Inspección** con etapa (arranque o en proceso), turno, máquina y etiqueta
  (SPEC-003, SPEC-004).
- **Foco por máquina** sobre tres meses naturales, con ampliación automática si
  hay poca historia y tendencia contra todo el histórico (SPEC-004).
- **Variables de proceso vigiladas**, Conforme o Desviada, según la matriz
  (SPEC-004, SPEC-005).
- **Hallazgo con causa obligatoria**, paro de máquina y **acciones
  correctivas que se cierran** (SPEC-007).
- **Matriz defecto ↔ variable** editable por el administrador (SPEC-005).
- **Histórico de merma** incrustado como semilla y carga desde Excel con
  revisión previa (SPEC-011).
- **Pestañas Comportamiento e Historial** (SPEC-004, SPEC-014).
- Taxonomía de **40 defectos** del histórico de merma (SPEC-008).
- Datos propios en `impredimex-procesos`, nodo `cal/` (SPEC-010).
- Instalable como aplicación, con service worker de red primero.
