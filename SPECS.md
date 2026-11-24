# SPECS.md — Control de Procesos (Calidad)

## Especificaciones funcionales del sistema

Este documento es la **fuente de verdad** del comportamiento de la aplicación.
Cualquier cambio futuro debe partir de actualizar primero estas specs y luego
implementar el código.

**Versión objetivo:** 1.0 — reconstrucción desde cero
**Fecha:** 9 de septiembre de 2026
**Versión vigente:** 1.2.1 — estados revisados contra el código el 24 de
noviembre de 2026
**Metodología:** Spec-Driven Development (SDD)

Cada especificación indica su **estado** (implementado, parcial o pendiente) y,
cuando no está completa, **qué le falta**. En `index.html` los bloques que
cumplen una especificación llevan su número en un comentario (`SPEC-004`), así
se puede ir del documento al código y de regreso.

> **Por qué se reconstruye.** La versión anterior se usó de verdad entre abril y
> julio de 2026: 1 772 inspecciones en ocho máquinas, en los tres turnos. Se
> abandonó en julio y Calidad volvió a inspeccionar en papel. El motivo no fue
> que estorbara, sino que **resolvía una sola forma de inspeccionar** cuando el
> proceso real tiene varias etapas y dos enfoques distintos.
>
> El respaldo de esa base está guardado fuera del repositorio. La aplicación
> nueva **arranca limpia**: no se migran datos.

---

## Estado de las especificaciones

| SPEC | Tema | Estado |
|---|---|---|
| 001 | Acceso a la aplicación | Implementado |
| 002 | Papeles | Parcial — un administrador puede cerrar un hallazgo que él mismo levantó |
| 003 | Etapas de inspección | Parcial — la etapa se registra, pero no cambia lo que se pregunta |
| 004 | Los dos enfoques y el foco | Parcial — falta mover la ventana y el foco por etiqueta |
| 005 | Matriz defecto ↔ variable | Parcial — el editor funciona; el contenido lo define la junta |
| 006 | Muestreo por AQL | Pendiente |
| 007 | Hallazgo, paro y acción correctiva | Parcial — falta el aviso al supervisor y la hora del paro |
| 008 | Catálogo de variables de calidad | Parcial — los 40 defectos están en el código; los 54 criterios no se han cargado |
| 009 | Identidad y personal desde la suite | Implementado |
| 010 | Datos propios | Implementado — las reglas de la base aceptan cualquier sesión, incluida la anónima |
| 011 | Historial de merma como semilla | Parcial — la carga agrega por mes y no distingue semilla de hallazgos en pantalla |
| 012 | Encabezado estándar de la suite | Implementado |
| 013 | Abrir sin mostrar la contraseña de paso | Implementado |
| 014 | Historial de inspecciones | Implementado |

---

## Lo que enseñó la versión anterior

Estos hallazgos vienen de analizar el respaldo, y cada uno se traduce en una
regla de esta versión.

**Las acciones correctivas nunca se cerraban.** Las 304 quedaron en estado
`abierta`, sin responsable, sin causa y sin fecha de cierre. La herramienta
señalaba problemas y no ofrecía manera de resolverlos. Es lo que más pesó en el
abandono.

**Nadie sabía quién inspeccionaba.** 1 737 de las 1 772 inspecciones tienen como
inspector la palabra genérica «Calidad», porque las tres contraseñas eran
compartidas y el perfil se autoasignaba ese nombre. Tres meses de evidencia sin
responsable identificable.

**No se registraba la causa.** La aplicación anotaba *qué* falló pero nunca *por
qué*. Por eso hoy es imposible calcular qué variable de proceso provoca cada
defecto, que es justamente lo que esta versión necesita.

**El cumplimiento promedio fue 99.1%.** Con un número así, el indicador deja de
informar. Cuando marcar todo conforme es más rápido que registrar un hallazgo,
el dato se degrada solo.

**La taxonomía de defectos era demasiado gruesa.** La aplicación registraba
«Defectos de impresión» y «Tonos». El histórico de merma de la empresa distingue
**40 defectos específicos**: raya, lagrimeo, manchas, velo, remosqueo, repinte,
impresión faltante, desprendimiento. La diferencia es decisiva: «defectos de
impresión» no apunta a ninguna variable de proceso, mientras que «raya» apunta a
rasqueta, cilindro y sustrato. Con la categoría gruesa, la matriz de la SPEC-005
habría sido imposible de determinar.

**Los defectos se concentran por máquina.** Analizando 1 095 registros de merma
de 2025 y 2026: cuatro líneas de 23 explican el 80% de los metros rechazados
—RT7 con 36.6%, RT6 con 20.1%, FL1 con 19.2% y FL4 con 6.8%—. Por cliente hacen
falta 12 de 52 para llegar al 80%, y por etiqueta 115 de 336. El foco de la
inspección va por máquina.

---

# SPEC-001 — Acceso a la aplicación

**Estado:** implementado (v1.0.0)

### Precondiciones
- La persona existe en `colaboradores` del proyecto **impredimex-suite**, con
  `estatus` en `ACTIVO`
- Su campo `apps` incluye `calidad`
- Tiene cuenta en Firebase Auth del proyecto suite

### Flujo principal
1. Sistema muestra la pantalla de acceso con nómina y clave
2. Sistema arma `<nómina>@impredimex.local` y llama a
   `signInWithEmailAndPassword` contra Auth de la suite
3. Sistema lee `colaboradores/<nómina>`, valida `estatus` y `apps`
4. Sistema toma el papel de `roles.calidad`
5. Sistema abre además una sesión anónima en el proyecto propio

### Reglas de negocio
- **Desaparecen las tres contraseñas compartidas** de la versión anterior:
  `IMPREDIMEX`, `imagenes` y `Calidad`. Las dos primeras eran además las mismas
  de otras aplicaciones, así que quien conocía las de EPP entraba aquí.
- **El inspector es quien inició sesión.** No se elige de una lista ni se
  autoasigna un nombre genérico. Es la corrección más importante respecto de la
  versión anterior.
- **Ausencia de papel equivale al más bajo.** En el código, quien no tiene
  `roles.calidad` entra como `INSPECTOR`, el mismo valor por omisión que
  muestra Recursos Humanos al asignar accesos.
- Los papeles se escriben en **mayúsculas** (`ADMIN`, `SUPERVISOR`,
  `INSPECTOR`). Recursos Humanos los asigna de una lista, así que no se
  escriben a mano.

---

# SPEC-002 — Papeles

**Estado:** parcial (v1.0.0)

| Papel | Quién | Qué hace |
|---|---|---|
| `INSPECTOR` | Inspectores de calidad | Inspecciona en cualquier etapa, registra hallazgos y causas |
| `SUPERVISOR` | Supervisores de producción | Recibe avisos de paro, atiende y cierra acciones correctivas |
| `ADMIN` | Jefatura de calidad | Todo lo anterior, más catálogos, matriz de causas y criterios de muestreo |

### Reglas de negocio
- **Inspeccionan todos los inspectores de calidad**, cada uno con su cuenta.
- **Quien detecta no cierra.** El inspector levanta el hallazgo; el supervisor lo
  atiende. Que la misma persona haga ambas cosas anula el control.

### Cómo está hoy
Las pestañas se muestran según el papel:

| Pestaña | INSPECTOR | SUPERVISOR | ADMIN |
|---|---|---|---|
| Inspección | ✓ | | ✓ |
| Acciones | ✓ | ✓ | ✓ |
| Historial | ✓ | ✓ | ✓ |
| Comportamiento | ✓ | ✓ | ✓ |
| Matriz | | | ✓ |
| Merma | | | ✓ |

El botón «Atender y cerrar» solo aparece a `SUPERVISOR` y `ADMIN`.

### Lo que falta
- **Un administrador puede cerrar un hallazgo que él mismo levantó**, porque
  también puede inspeccionar. La regla de quien detecta no cierra se cumple por
  papel, no por persona. Falta comparar la nómina de quien cierra con
  `inspectorNomina`.
- Los permisos se aplican en la pantalla, no en las reglas de la base (ver
  SPEC-010).

---

# SPEC-003 — Etapas de inspección

**Estado:** parcial (v1.0.0)

Dos etapas, no una:

**Arranque.** Antes de liberar la corrida. Se verifica que las condiciones para
producir bien estén dadas.

**En proceso.** Durante la corrida, en los recorridos del inspector.

### Reglas de negocio
- **Se descartó la etapa de fin de corrida.** Existía en la idea original por la
  rutina de recorridos, pero lo que se revisa ahí ya se cubrió durante la
  corrida. Agregarla solo produce ruido.
- La etapa determina qué se pregunta: el arranque mira condiciones previas; la
  inspección en proceso mira producto y variables.

### Lo que falta
La etapa se elige (Arranque o En proceso, esta última por omisión) y se graba en
cada inspección, pero **las dos etapas muestran el mismo formulario**. Que el
arranque pregunte por condiciones previas depende del catálogo de criterios de
la SPEC-008, que todavía no se ha cargado.

---

# SPEC-004 — Los dos enfoques

**Estado:** parcial (v1.0.0)

Esta es la idea central de la reconstrucción y lo que la versión anterior no
distinguía.

### Enfoque 1 — Producto
Se inspecciona el semiterminado o el terminado. El resultado es **binario: pasa
o no pasa**.

Su límite es que **cuando detecta, el daño ya ocurrió**. Si el semiterminado no
pasa, hay pérdida y poco que hacer.

### Enfoque 2 — Variables de proceso
Se inspeccionan las condiciones que, de desviarse, provocarían el defecto. Es
preventivo: se actúa antes de que haya producto malo.

### Cómo se conectan
El inspector no debe adivinar qué variables vigilar. La aplicación se lo dice:

1. Conoce los **defectos históricos de esa máquina**, ordenados por frecuencia
2. Conoce, por la matriz de la SPEC-005, **qué variables provocan cada defecto y
   en qué proporción**
3. Propone vigilar las variables que explican la mayor parte de los defectos
   probables de esa máquina

### El foco se calcula en dos niveles

**Primer nivel, por línea.** Es donde se concentra la merma y el perfil de cada
equipo es claramente distinto:

| Línea | Sus principales defectos |
|---|---|
| RT7 | Lagrimeo 19.6%, raya 17.6%, impresión faltante 13.5%, registro 11.8% |
| RT6 | **Raya 42.9%**, lagrimeo 13.6%, manchas 11.3%, registro 10.9% |
| FL1 | Manchas 18.4%, raya 16.4%, repinte 9.3%, remosqueo 7.6% |
| FL4 | **Tonos 17.6%**, impresión faltante 14.1%, manchas 11.7% |

**Segundo nivel, por etiqueta.** Dentro de una misma línea, etiquetas distintas
fallan por razones distintas. En la RT7, sus tres etiquetas más costosas: la
28691 es 100% impresión faltante, la 29355 es desprendimiento y lagrimeo, y la
28947 es velo. Si la etiqueta que se está corriendo tiene historia suficiente,
el foco se afina con ella; si no, se queda en el de la línea.

### Reglas de negocio
- **El foco es por máquina, no general.** El cliente no sirve para dirigir la
  inspección: la merma se reparte entre demasiados.
- **La inspección registra qué etiqueta se está corriendo.** La versión anterior
  no lo capturaba, y sin ese dato el segundo nivel del foco es imposible.
- **La prioridad se mide por metros rechazados, no por número de casos.** Es lo
  que hace el histórico de merma y es más honesto: 16 casos de tonos cuestan más
  que 27 de punteado. Contar hallazgos trata igual una raya de 50 metros que una
  de 5 000.
- **La propuesta es una guía, no una restricción.** El inspector puede revisar
  cualquier variable; la aplicación resalta las que más rinden.
- **Hace falta un mínimo de historia para afinar por etiqueta.** Con dos o tres
  registros, el porcentaje es ruido. El umbral lo define Calidad.

### Dos ventanas de tiempo

**Ventana de foco: tres meses naturales.** Es la que determina el peso de cada
defecto y lo que se le propone vigilar al inspector.

Al abrir la aplicación se posiciona sola en **el mes en curso y los dos
anteriores**: abierta en septiembre muestra septiembre, agosto y julio. No es una
ventana móvil de noventa días, son meses completos, que es como se lee un
tablero de calidad.

**El inspector puede mover la ventana.** Si quiere ver otro trimestre, lo
selecciona. La aplicación muestra siempre qué periodo está usando, para que nadie
interprete un número creyendo que es del mes actual.

> **El mes en curso está incompleto.** Abierta el día 9, ese mes lleva nueve días
> de datos y pesa menos que los dos completos. La aplicación lo indica en vez de
> presentarlo como si fuera un mes cerrado.

**Ventana de comportamiento: todo el histórico.** Muestra la evolución de cada
defecto en el tiempo, para saber si **disminuyó, se mantuvo o aumentó**. No pesa
en el foco, pero da el contexto que el foco por sí solo no da.

Que el peso venga de los tres meses no es un detalle: comparando ambas ventanas
sobre los 1 095 registros de 2025 y 2026, el orden cambia de verdad.

| Todo el histórico | Últimos tres meses |
|---|---|
| Raya 19.3% | Raya **25.6%** |
| Lagrimeo 10.9% | Manchas **14.2%** |
| Manchas 10.3% | Lagrimeo 13.0% |
| Registro 8.1% | **Falta de presión 7.5%** |
| Impresión faltante 6.9% | Registro 7.3% |
| Adhesivo 4.9% | Fuera de registro 5.4% |

La falta de presión aparece de la nada en la ventana corta; impresión faltante y
adhesivo salen del podio. Y por línea el contraste es mayor: en la **FL4** el
principal defecto histórico son los tonos con 18%, pero en los últimos tres meses
es **falta de presión con 28%**. Un inspector guiado solo por el histórico
vigilaría lo que ya se corrigió.

- **El foco pesa por la ventana de tres meses, sin descartar el comportamiento
  histórico.** La segunda ventana no se usa para ordenar, se usa para entender.
- **En una línea de poca actividad, la ventana se amplía sola.** Si en los tres
  meses apenas hay registros de esa máquina, el foco se calcularía sobre ruido.
  La aplicación retrocede hasta juntar historia suficiente y **dice con qué
  periodo lo hizo**, para que el inspector sepa que está viendo algo más viejo. La
  alternativa —mostrar un foco débil con la misma seguridad que uno sólido— es
  peor que no mostrarlo.
- **La tendencia se muestra junto a cada defecto del foco.** Saber que la raya
  pasó de 19.3% a 25.6% —que va en aumento— cambia la urgencia con que se
  atiende, frente a un defecto que baja y probablemente ya tiene una acción
  surtiendo efecto.

### Cómo está hoy
- **Foco por máquina** con los seis defectos de más peso en los tres meses
  naturales, con barra, porcentaje y la variable a vigilar si la matriz la
  tiene. Al ser abierta muestra el periodo y advierte que el mes en curso va
  incompleto.
- **Ampliación automática.** Si la máquina junta menos de **500** en la ventana
  (metros de la semilla más hallazgos), se agrega un mes hacia atrás, hasta
  nueve meses más, y se avisa desde cuándo se calculó. El 500 es un **umbral
  provisional** mientras Calidad define el suyo.
- **Tendencia.** Cada defecto del foco se compara con su peso en todo el
  histórico de esa máquina: «▲ sube» si está más de 2 puntos arriba, «▼ baja» si
  está más de 2 abajo, «= igual» en otro caso.
- **Variables de proceso vigiladas.** Las de la matriz para los defectos del
  foco, cada una con Conforme / Desviada. Se graban con la inspección.
- **Inspección de producto** con Pasa / No pasa. La etiqueta es obligatoria.
- **Comportamiento.** Una pestaña con los metros rechazados por mes de una
  máquina y un defecto, en todo el histórico, marcando los meses del foco.

### Lo que falta
- **Mover la ventana de foco.** Hoy siempre son el mes en curso y los dos
  anteriores; el inspector no puede elegir otro trimestre.
- **Segundo nivel, por etiqueta.** La etiqueta ya se graba en cada inspección,
  pero el foco todavía no se afina con ella. Depende del umbral de historia que
  defina Calidad.
- **Los hallazgos pesan 1, no metros.** Se suman a los metros de la semilla
  como un evento cada uno, porque muchas veces evitan la merma. Mientras haya
  semilla, un hallazgo casi no mueve el foco; conviene decidir con Calidad
  cómo pesarlos.
- La pestaña Comportamiento solo usa la semilla de merma, no los hallazgos.

---

# SPEC-005 — Matriz defecto ↔ variable

**Estado:** parcial (v1.0.0) — el editor funciona; **el contenido lo define una
junta de calidad, producción e ingeniería de procesos**

### Qué es
Para cada defecto, qué variables de proceso lo provocan y con qué peso relativo.

### Reglas de negocio
- **Es un catálogo editable dentro de la aplicación, no código.** La junta captura
  el resultado sin depender de una nueva versión, y lo corrige cuando cambie un
  material o se rectifique un cilindro.
- **Puede diferir por máquina.** Lo que provoca variación de tono en rotograbado
  no tiene por qué ser lo mismo que en flexografía.
- **Se siembra con el criterio de la junta y se corrige con los datos.** Al
  principio los pesos son opinión experta; conforme se acumulen causas
  registradas (SPEC-007), la aplicación muestra el porcentaje real medido junto
  al estimado, para que la junta ajuste.
- **La aplicación funciona con la matriz vacía.** En ese caso solo muestra los
  defectos históricos, sin sugerir variables. No es un requisito para publicar.

### Pendiente de definir
El contenido. Con **13 de los 40 defectos se cubre el 80%** de los metros
rechazados, así que no hace falta agotar la lista para que la matriz sirva. Por
peso conviene empezar por: raya 19.3%, lagrimeo 10.9%, manchas 10.3%, registro
8.1%, impresión faltante 6.9%, adhesivo 4.9% y velo 4.8%.

Y conviene revisarlos por línea, porque la causa puede diferir: la raya es el 43%
de la merma de la RT6 y el 17.6% de la RT7.

### Cómo está hoy
La pestaña **Matriz** (solo `ADMIN`) captura, por defecto y opcionalmente por
máquina, una variable por renglón con su peso: `Viscosidad de tinta | 40`. Se
guarda en `cal/matriz/<defecto>@<máquina>`; con la máquina vacía aplica a todas.
Si hay una entrada para la máquina, gana sobre la general.

### Lo que falta
- **El peso se guarda, pero todavía no se usa.** Las variables se muestran en
  el orden en que se capturaron.
- **El porcentaje real medido junto al estimado**, a partir de las causas que se
  registran en los hallazgos.

---

# SPEC-006 — Muestreo por AQL

**Estado:** pendiente — nada implementado; espera el criterio de Calidad

### Qué hace
La aplicación **calcula el plan de muestreo**; el inspector no consulta tablas.

A partir del tamaño del lote y del criterio vigente, indica cuántas piezas
revisar, cuántos defectos se aceptan y a partir de cuántos se rechaza.

### Reglas de negocio
- **El criterio lo define Calidad**, no viene fijo: nivel de inspección, valor de
  AQL y severidad. Se configura en la aplicación.
- **Puede diferir por tipo de producto o cliente**, si Calidad así lo decide.
- **Las tablas del estándar viven en la aplicación**, y la decisión de aceptar o
  rechazar queda registrada junto con el plan que se aplicó. Sin eso, un
  resultado no es auditable meses después.

### Pendiente de definir
- Qué niveles de inspección y valores de AQL usa Calidad
- Si la aplicación debe aplicar las **reglas de cambio de severidad** del
  estándar —pasar a inspección rigurosa tras cierto número de lotes rechazados,
  y volver a normal— o si esa decisión la toma Calidad a mano. Automatizarlo es
  más fiel al estándar; hacerlo a mano es más simple y transparente.

---

# SPEC-007 — Hallazgo, paro y acción correctiva

**Estado:** parcial (v1.0.0)

### Flujo principal
1. El inspector detecta una no conformidad y la registra
2. Sistema **exige la causa**: qué variable de proceso la provocó. Si el inspector
   no la sabe, puede marcarla como no determinada, y eso también es un dato
3. Sistema notifica al supervisor de producción
4. Si procede, el inspector solicita **paro de máquina** y queda registrado
5. El supervisor atiende, registra qué se corrigió y **cierra** la acción
6. Sistema conserva quién detectó, quién atendió, cuándo y con qué resultado

### Reglas de negocio
- **Una acción correctiva se puede cerrar.** Es la corrección más importante
  respecto de la versión anterior, donde las 304 quedaron abiertas para siempre.
- **La causa es obligatoria.** Sin ella, la matriz de la SPEC-005 nunca se
  corrige con datos reales y se repite el vacío de la versión anterior.
- **Quien detecta no cierra** (SPEC-002).
- **El paro de máquina se registra como tal**, con hora de solicitud. Hoy ese
  aviso ocurre de viva voz y no queda rastro.

### Cómo está hoy
- «No pasa» abre el registro del hallazgo: defecto (de los 40), causa, metros
  afectados, paro de máquina y observaciones.
- La causa se elige de las variables que la matriz asocia a ese defecto, o se
  escribe («Otra»), o se marca **«No determinada»**, que se guarda con
  `causaDeterminada: false`. Sin causa no se registra.
- Se graban dos cosas: el hallazgo en `cal/hallazgos` y la inspección en
  `cal/inspecciones`, ligada por `hallazgoId`.
- En **Acciones**, el supervisor o el administrador escribe qué se corrigió y
  puede corregir la causa. Al cerrar se guarda quién, cuándo y la corrección.

### Lo que falta
- **El aviso al supervisor.** La app no notifica: al marcar paro solo le
  recuerda al inspector que avise.
- **La hora del paro.** Se guarda si hubo paro (sí o no) y la hora del
  hallazgo, no una hora propia de la solicitud de paro.
- Quien detecta no cierra se cumple por papel, no por persona (SPEC-002).

---

# SPEC-008 — Catálogo de variables de calidad

**Estado:** parcial (v1.0.0)

### El catálogo de defectos
Se adopta la **taxonomía de 40 defectos** del histórico de merma de la empresa,
no la de la versión anterior. Es la que usa producción para medir el costo, y es
lo bastante específica como para poder asociarle causas.

### Qué se hereda de las variables
Los **54 criterios** de la versión anterior, con su método de medición,
especificación y tolerancia. Están repartidos en genérica, máquinas, producto,
refilado, pegado, revisado y corte, más criterios específicos de la OMET X6 530
y la Huafeng HYA.

Es el único contenido irreemplazable de la versión anterior y se conserva.

### Reglas de negocio
- **El catálogo vive en la base, no en el código.** En la versión anterior estaba
  escrito en el archivo y por eso nunca se pudo ajustar sin tocar programación.
- **De los 54 criterios, en la práctica se usaron 21 por inspección.** Al cargar
  el catálogo conviene revisar cuáles siguen vigentes: las secciones de
  seguridad, materiales y documentación no reprobaron ni una vez en tres meses,
  lo que sugiere que se marcan por trámite.

### Cómo está hoy
- **Los 40 defectos** ya son la taxonomía de la app, pero están **escritos en
  el código** (`DATOS.defectos`), no en la base.
- **Las 20 máquinas** con su área también están en el código
  (`DATOS.maquinas`).

### Lo que falta
- Pasar defectos y máquinas a la base para ajustarlos sin tocar el código.
- **Cargar los 54 criterios** con método, especificación y tolerancia. Hoy
  ninguna pantalla los usa.

---

# SPEC-011 — Historial de merma como semilla del foco

**Estado:** parcial (v1.0.0)
**Origen:** el histórico de merma de la empresa, 1 095 registros de 2025 y 2026

### Por qué existe
Sin historia, la aplicación tarda meses en poder decirle algo con fundamento al
inspector, y ese fue justamente el vacío de la versión anterior. Cargando el
histórico, **el foco de la SPEC-004 funciona desde el primer día** con dos años
de datos reales.

### Flujo principal
1. `ADMIN` carga el archivo de merma en formato Excel
2. Sistema reconoce fecha, pedido, línea, etiqueta, cliente, defecto y metros
   rechazados
3. Sistema muestra un resumen previo: cuántos registros, qué rango de fechas, y
   qué defectos o líneas no reconoce
4. Usuario confirma y los registros quedan marcados como **semilla**

### Reglas de negocio
- **La semilla y los hallazgos son cosas distintas y no se mezclan.** El histórico
  registra merma consumada por pedido; un hallazgo registra algo detectado en el
  momento, que muchas veces evita la merma. Ambos alimentan el foco, pero se
  guardan por separado y se distinguen en pantalla.
- **La semilla se puede recargar.** Cargar el archivo otra vez reemplaza la
  semilla anterior, no la duplica. La clave es fecha, pedido y defecto.
- **La aplicación avisa cuando la semilla envejece.** Los datos vienen de
  papeletas que se llenan a mano y se transcriben, así que si nadie recarga, el
  foco se queda hablando del año pasado. Si el registro más reciente tiene más de
  cierto tiempo, se muestra desde cuándo no se actualiza.
- **Los defectos del archivo deben corresponder al catálogo de 40.** Los que no
  se reconozcan se reportan y no se cargan, en vez de entrar como categorías
  nuevas que ensucian el análisis.

### Sobre la papeleta
Hoy la merma se anota a mano en papeletas y alguien la transcribe a Excel. Esta
spec **no cambia ese proceso**: la aplicación consume el resultado.

Que la aplicación llegue a sustituir la papeleta es la evolución natural, pero es
otro alcance: toca a producción, no solo a calidad, y conviene decidirlo cuando
esta versión ya esté en uso. Anotarlo aquí evita que se cuele sin querer.

### Cómo está hoy
- **La semilla viene incrustada** en `index.html` (`DATOS.semilla`): metros
  rechazados por línea, defecto y mes, de 2025 y 2026. Con ella el foco
  funciona aunque nadie haya cargado archivo.
- La pestaña **Merma** (solo `ADMIN`) carga un Excel. Lee la primera hoja y las
  columnas `Fecha`, `Linea`, `Defecto` y `Mts rechazados` (acepta variantes en
  mayúsculas y con acento). Rechaza filas sin esos datos, con metros inválidos,
  con fecha ilegible o con un defecto fuera de los 40.
- Antes de guardar muestra registros a usar, líneas, periodo y filas
  rechazadas por motivo. Al confirmar **reemplaza** la carga anterior en
  `cal/merma`; desde ese momento sustituye a la incrustada.
- El aviso de envejecimiento sale cuando el mes más reciente tiene **3 meses o
  más**.

### Lo que falta
- **La carga agrega por línea, defecto y mes.** No guarda pedido, etiqueta ni
  cliente, y la clave fecha + pedido + defecto no aplica: reemplazar el todo
  cumple la regla de no duplicar, pero sin este detalle el foco por etiqueta
  (SPEC-004) no tiene de dónde salir.
- **El resumen previo no lista las líneas no reconocidas.** Una línea que no
  está en el catálogo de máquinas se guarda igual y no aparece en ningún
  selector.
- **Semilla y hallazgos no se distinguen en pantalla.** Se guardan por
  separado, pero el foco los suma en una sola barra.
- **El aviso de envejecimiento solo se ve en la pestaña Merma.** Con la
  semilla incrustada no sale.

---

# SPEC-009 — Identidad y personal desde la suite

**Estado:** implementado (v1.0.0)

### Reglas de negocio
- La lista de personal es `colaboradores` de la suite. Esta aplicación la lee y
  nunca la escribe.
- **Desaparece `imd_personal_procesos`**, la copia propia de la versión anterior.
- **Los registros guardan copia, no referencia:** una inspección conserva la
  nómina y el nombre tal como estaban al hacerla.

---

# SPEC-010 — Datos propios

**Estado:** implementado (v1.0.0), con las reglas de la base pendientes de
endurecer

Inspecciones, hallazgos, acciones correctivas, catálogos, matriz de causas y
criterios de muestreo se quedan en el proyecto propio. Es la regla 4 de la
suite: la cuota del plan gratuito es por proyecto.

### Cómo está hoy
Proyecto `impredimex-procesos`, Realtime Database, todo bajo el nodo `cal/`:

| Ruta | Qué guarda |
|---|---|
| `cal/inspecciones/<id>` | Cada inspección: etapa, turno, máquina, etiqueta, fecha, inspector, resultado y variables revisadas |
| `cal/hallazgos/<id>` | Cada hallazgo y, al cerrarse, su acción correctiva |
| `cal/matriz/<defecto>@<máquina>` | La matriz de la SPEC-005 |
| `cal/merma` | La última carga del histórico de merma (SPEC-011) |

La app abre una **sesión anónima** en este proyecto después de validar a la
persona contra la suite.

### Lo que falta
- **Las reglas (`database.rules.json`) solo piden sesión**, y una sesión
  anónima basta. Cualquiera que abra la página puede leer y escribir todo
  `cal/`, sin pasar por la suite. Es el mismo punto que Mantenimiento resolvió
  con la SPEC-061 de su repositorio (credencial entregada por el servidor tras
  validar la sesión de la suite), y la solución puede reutilizarse.
- **App Check no está activo:** la clave `APPCHECK_SITE_KEY` está vacía.

---

# SPEC-012 — Encabezado estándar de la suite

**Estado:** implementado (v1.1.0)

### Alcance

El encabezado es el mismo en las aplicaciones de la suite. Está definido en la
SPEC-035 del repositorio `rrhh-pwa`, que es la referencia; aquí se registra cómo
se aplicó en esta app y lo que tiene de particular.

### Qué hace

- **Marca a la izquierda, botones a la derecha, de borde a borde.** IMPREDIMEX en
  Jost peso 600 con espaciado amplio; debajo, «CONTROL DE PROCESOS» en mayúsculas
  finas y grises. Es el nombre con que la llama el portal.
- **Fijo arriba y opaco.** Sin la transparencia y el desenfoque que tenía, que
  dejaban pasar el fondo y lavaban el logotipo en iOS. Capa 45: por encima del
  contenido y por debajo de las ventanas emergentes (100) y los avisos (200).
- **Nombre y puesto centrados, solo en pantalla ancha** (desde 760 px). En el
  teléfono no caben sin cortarse y viven en el panel.
- **Panel al tocar la nómina**: nombre, puesto, estado de conexión y papel, más
  «Ir al portal» y «Cerrar sesión». El botón «Salir» de texto que había en la
  barra se mudó ahí.
- **Botón de portal**, los cuatro cuadros.
- **El estado de conexión es un punto sobre la nómina**: verde con red, rojo sin
  ella. Sigue lo que reporta el teléfono, el mismo criterio que Recursos Humanos.

### Particular de esta app

- **La sesión ahora guarda el puesto.** Antes solo llevaba nómina, nombre y
  papel. El puesto se agregó únicamente para el encabezado; nada más lo usa.
  Sin puesto en el padrón, se muestra el papel en su lugar.
- **El papel dejó de estar en la barra** y pasó al panel y al título del círculo
  de la nómina, que es donde alguien lo busca cuando duda de sus permisos.
- **El cuadro «IM» sigue existiendo en la pantalla de entrada.** Se quitó del
  encabezado, pero su estilo `.logo` se conserva porque la entrada lo usa.
- **Se reutilizaron los identificadores `b-nom` y `b-rol`**, así el código que ya
  los llenaba sigue funcionando sin tocarlo: `b-nom` es ahora el círculo de la
  nómina, y `b-rol` el papel dentro del panel.

### Service worker

Se subió la versión de la caché a `calidad-v1.1.0`. Al activarse, el service
worker borra las copias guardadas con otro nombre, así ningún teléfono se queda
con el encabezado viejo si abre la app sin señal. Conviene subirla en cada
cambio visible.

---

# SPEC-013 — Abrir sin mostrar la contraseña de paso

**Estado:** implementado (v1.2.0)

### Por qué

Al pasar del portal a una app, o de una app al portal, se veía un instante la
pantalla de contraseña aunque ya hubiera sesión. Cada página arrancaba con la
contraseña a la vista y solo la escondía cuando Firebase confirmaba la sesión y
terminaba de leer la ficha del padrón: entre medio segundo y un segundo y medio.

### Cómo funciona

- **Las seis páginas de la suite comparten una nota** en el almacenamiento del
  navegador (`impredimex:sesion`), porque viven en el mismo dominio. Se escribe
  al abrir sesión y se borra al cerrarla, o cuando Firebase dice que no la hay.
- **Un bloque en la cabecera de `index.html` la lee antes de dibujar nada.** Si
  hay sesión, cubre la pantalla con la marca IMPREDIMEX mientras la app termina
  de abrir. Si no la hay, la contraseña aparece al instante.
- **Si la nota miente** —la sesión expiró—, la marca dura un momento y aparece
  la contraseña, que es lo correcto.
- **Red de seguridad:** si en 8 segundos la app no terminó de abrir, la marca se
  quita sola. Nadie se queda viendo la marca sin salida.
- **Al mostrar un error de acceso la marca se quita siempre**, o taparía el
  mensaje con el motivo.
- La marca se dibuja con `html::after`, sin tocar el contenido de la página.

### Service worker

Se subió la caché a `calidad-v1.2.0`, para que ningún teléfono se quede con la
versión anterior.

---

# SPEC-014 — Historial de inspecciones

**Estado:** implementado (v1.0.0) — se documenta en la v1.2.1; no tenía
especificación

### Qué hace
La pestaña **Historial** muestra las **60 inspecciones más recientes**, de la
más nueva a la más vieja: máquina, etiqueta, resultado (pasa / no pasa),
fecha, turno, etapa e inspector con su nómina.

### Reglas de negocio
- La ven los tres papeles.
- Es de consulta: no se edita ni se borra nada desde aquí.
- El límite de 60 es para que la lista abra rápido en el teléfono. No hay
  todavía filtros ni forma de ver inspecciones más antiguas desde la app.

---

# Convenciones del código

- **Un solo archivo**, `index.html`, sin compilación. GitHub Pages lo sirve
  tal cual.
- **Marcas de especificación.** Cada bloque que cumple una SPEC lleva su
  número en un comentario. Al agregar o cambiar comportamiento: primero se
  actualiza este documento, luego el código con su marca, y al final
  `CHANGELOG.md` con la versión nueva.
- **Versión.** Se sube en `CHANGELOG.md`, `README.md`, `HANDOVER.md` y en la
  constante `CACHE` de `sw.js` (`calidad-vX.Y.Z`). La caché se sube en cada
  cambio para que ningún teléfono se quede con la versión anterior.

---

# Trabajo pendiente de definir

- **La matriz defecto ↔ variable** (SPEC-005), en junta de calidad, producción e
  ingeniería de procesos.
- **El criterio de muestreo** (SPEC-006): niveles, valores de AQL y si el cambio
  de severidad se automatiza.
- **El umbral de historia** a partir del cual se afina el foco por etiqueta
  (SPEC-004).
- **Cada cuánto se recarga la semilla de merma** y quién es responsable de
  hacerlo (SPEC-011). Sin eso, el aviso histórico envejece sin que nadie lo note.
- **Si la ventana de tres meses es fija o configurable.** Se definió en tres
  meses; queda por decidir si Calidad puede ajustarla sin tocar código.
- **A partir de cuántos registros se considera que una línea tiene poca
  actividad** y hasta dónde se amplía su ventana (SPEC-004). Lo define Calidad.
- **Quiénes son los inspectores de calidad** y quiénes los supervisores que
  atienden, para asignar `apps` y `roles.calidad` en la suite.
