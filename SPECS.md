# SPECS.md — Control de Procesos (Calidad)

## Especificaciones funcionales del sistema

Este documento es la **fuente de verdad** del comportamiento de la aplicación.
Cualquier cambio futuro debe partir de actualizar primero estas specs y luego
implementar el código.

**Versión objetivo:** 1.0 — reconstrucción desde cero
**Fecha:** 9 de septiembre de 2026
**Versión vigente:** 1.22.0 — estados revisados contra el código el 26 de
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
| 003 | Etapas de inspección | Implementado desde la v1.20.0 con la SPEC-028 (roto y flexo; faltan otras áreas) |
| 004 | Los dos enfoques y el foco | Parcial — falta mover la ventana y el foco por etiqueta |
| 005 | Matriz defecto ↔ variable | Parcial — el editor funciona; el contenido lo define la junta |
| 006 | Muestreo por AQL | Pendiente — el seguimiento a corrida es por master (SPEC-028) |
| 007 | Hallazgo, paro y acción correctiva | Parcial — falta el aviso al supervisor y la hora del paro |
| 008 | Catálogo de variables de calidad | Parcial — los defectos ya viven en la base (SPEC-022); los 54 criterios no se han cargado |
| 009 | Identidad y personal desde la suite | Implementado |
| 010 | Datos propios | Implementado — las reglas de la base aceptan cualquier sesión, incluida la anónima |
| 011 | Historial de merma como semilla | Sustituida por la SPEC-018 en la v1.8.0; queda la semilla como base histórica |
| 012 | Encabezado estándar de la suite | Implementado |
| 013 | Abrir sin mostrar la contraseña de paso | Implementado |
| 014 | Historial de inspecciones | Implementado |
| 015 | Galería de etiquetas | Implementado |
| 016 | Etiqueta y turno automáticos en la inspección | Implementado |
| 017 | Registro de rechazos (antes «Merma 2») | Implementado; desde la v1.8.0 vive en la pestaña Merma |
| 018 | Merma: una sola fuente, formulario más Excel | Implementado |
| 019 | Editar y borrar un rechazo | Implementado |
| 020 | Cantidad rechazada en etiquetas, metros calculados | Implementado |
| 021 | Máquina de inspección y máquina que genera; defecto con autocompletado | Implementado |
| 022 | Catálogo de defectos editable y numerado; editar y borrar etiquetas | Implementado |
| 023 | Acciones de merma: recuperado y acción | Implementado |
| 024 | Orden de producción en el rechazo | Implementado |
| 025 | Carga del histórico «Rechazo interno» | Implementado |
| 026 | Folio de rechazo automático | Implementado |
| 027 | Operador, hora y auditor en la inspección | Implementado |
| 028 | Arranque de calidad y seguimiento a corrida | Implementado (con corridas terminadas desde la v1.22.0) — faltan formatos de digital, laminado y acondicionado, y rangos |

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
| Merma: formulario y tabla | ✓ | ✓ | ✓ |
| Merma: cargar Excel | | | ✓ |
| Merma: editar y borrar un rechazo | | | ✓ |
| Acciones de merma: consultar | ✓ | ✓ | ✓ |
| Acciones de merma: registrar recuperado y acción | | ✓ | ✓ |
| Galería (consulta) | ✓ | ✓ | ✓ |
| Galería (cargar, alta, edición y borrado de etiquetas; catálogo de defectos) | | | ✓ |

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

**Estado:** implementado (v1.20.0) con la SPEC-028

Dos etapas, no una:

**Arranque.** Antes de liberar la corrida. Se verifica que las condiciones para
producir bien estén dadas.

**Seguimiento a corrida** (antes «En proceso»). Durante la corrida, en los
recorridos del inspector.

### Reglas de negocio
- **Se descartó la etapa de fin de corrida.** Existía en la idea original por la
  rutina de recorridos, pero lo que se revisa ahí ya se cubrió durante la
  corrida. Agregarla solo produce ruido.
- La etapa determina qué se pregunta: el arranque mira condiciones previas; la
  inspección en proceso mira producto y variables.

### Cómo quedó
Desde la v1.20.0 la etapa sí cambia lo que se pregunta: el arranque es el
formato de liberación de cada área y el seguimiento revisa producto y variables
por master, ligado a la corrida que abrió el arranque. El detalle está en la
SPEC-028. Antes de esa versión las dos etapas mostraban el mismo formulario.

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

### Relación con el seguimiento a corrida
Desde la v1.20.0 el seguimiento a corrida (SPEC-028) es **por master**. Calidad
quiere poder hacerlo por AQL; cuando se defina el criterio, el AQL entra como
segundo método del seguimiento.

### Pendiente de definir
- Qué es el lote en el seguimiento por AQL: la OP completa, los masters o las
  etiquetas
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
- Desde la v1.15.0 las acciones de la inspección se ven **en tabla, con el mismo
  formato que las de merma** (SPEC-023): Fecha fija a la izquierda; después
  Estado y **Corrección**, con el defecto arriba y un solo botón **Atender y
  cerrar** (supervisor y administrador); luego defecto, causa, paro, máquina,
  etiqueta con nombre y cliente, turno, etapa, metros afectados,
  observaciones, quién detectó, quién cerró y fecha de cierre. Filtro por
  estado (Abiertas por omisión) y por mes (Todo el histórico por omisión, para
  no esconder acciones abiertas de meses anteriores), y **Exportar a Excel**.

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
- **Los defectos viven en la base** desde la v1.12.0 (`cal/defectos`) y se
  administran en la pestaña Galería (SPEC-022). Los 40 del código
  (`DATOS.defectos`) son el punto de partida y el respaldo mientras la base no
  responde.
- **Las máquinas** con su área también están en el código
  (`DATOS.maquinas`): 24 desde la v1.17.0, al agregarse REV1, REV2, REV3 y REV6
  (área REVISADO), que aparecen en el histórico de rechazos (SPEC-025).

### Lo que falta
- Pasar defectos y máquinas a la base para ajustarlos sin tocar el código.
- **Cargar los 54 criterios** con método, especificación y tolerancia. Hoy
  ninguna pantalla los usa.

---

# SPEC-011 — Historial de merma como semilla del foco

**Estado:** sustituida por la SPEC-018 en la v1.8.0

> Desde la v1.8.0 el foco sale de los rechazos registrados (SPEC-018) y el
> cargador de esta especificación (columnas Fecha, Linea, Defecto, Mts
> rechazados, agregado por mes) se quitó. La semilla incrustada, y la última
> carga en `cal/merma` si existe, se quedan como **base histórica** para los
> meses anteriores al primer rechazo registrado. Lo que sigue se conserva
> como registro de cómo funcionaba.

**Estado anterior:** parcial (v1.0.0)
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
| `cal/inspecciones/<id>` | Cada inspección: etapa, turno, máquina, etiqueta con su nombre y cliente, fecha, inspector, resultado y variables revisadas |
| `cal/hallazgos/<id>` | Cada hallazgo y, al cerrarse, su acción correctiva |
| `cal/matriz/<defecto>@<máquina>` | La matriz de la SPEC-005 |
| `cal/merma` | La última carga del histórico agregado de la SPEC-011. Ya no se escribe; si existe, es la base histórica (SPEC-018) |
| `cal/etiquetas/<Etiq>` | La galería de etiquetas (SPEC-015) |
| `cal/etiquetasBorradas/<Etiq>` | Copia de cada etiqueta borrada, con quién y cuándo (SPEC-022) |
| `cal/defectos/<id>` | El catálogo de defectos (SPEC-022) |
| `cal/defectosRenombrados/<anterior>` | Nombre nuevo de un defecto renombrado, para la base histórica (SPEC-022) |
| `cal/merma2/<id>` | Cada rechazo capturado en Merma 2 (SPEC-017) |
| `cal/merma2Folios/<folio>` | Índice de folios de rechazo, para no repetirlos (SPEC-017) |
| `cal/merma2Contador/<año>` | Último consecutivo de folio asignado en ese año (SPEC-026) |
| `cal/mermaResumen/<máquina>/<defecto>/<AAAA-MM>` | Metros de los rechazos sumados por mes, para el foco (SPEC-018) |
| `cal/merma2Borrados/<id>` | Copia de cada rechazo borrado, con quién, cuándo y por qué (SPEC-019) |
| `cal/merma2Ediciones/<id>/<n>` | Cada versión anterior de un rechazo editado, con quién y cuándo (SPEC-019) |

La app abre una **sesión anónima** en este proyecto después de validar a la
persona contra la suite, y **solo después** abre sus lecturas (v1.8.1). Una
lectura que llega sin sesión la rechazan las reglas y Firebase no la
reintenta. Si la sesión anónima falla, la app lo dice con el motivo (por
ejemplo, que el acceso anónimo está deshabilitado en Firebase).

### Reglas publicadas
El 24 de noviembre de 2026 se encontró que las reglas publicadas eran
`.read: true` y `.write: true`: la base entera, incluidos los nodos de la
versión anterior de la app, se podía leer y escribir sin sesión. Ese día se
publicaron las de `database.rules.json`:
- `cal/` pide sesión.
- Todo lo demás (los nodos de la versión anterior: `usuarios`,
  `imd_auditoria_claves`, `inspecciones`, `acciones`, etc.) queda cerrado para
  todos; solo se ve desde la consola.
- Se agregó el proveedor **Anónimo** en Authentication, que la app necesita
  para abrir su sesión.

### Lo que falta
- **Una sesión anónima basta para `cal/`.** Cualquiera que abra la página
  puede abrir una con la configuración pública y leer y escribir todo `cal/`,
  sin pasar por la suite. Es el mismo punto que Mantenimiento resolvió
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
nombre y cliente de la etiqueta (desde la v1.4.0, SPEC-016), fecha, turno,
etapa e inspector con su nómina.

### Reglas de negocio
- La ven los tres papeles.
- Es de consulta: no se edita ni se borra nada desde aquí.
- El límite de 60 es para que la lista abra rápido en el teléfono. No hay
  todavía filtros ni forma de ver inspecciones más antiguas desde la app.

---

# SPEC-015 — Galería de etiquetas

**Estado:** implementado (v1.3.0)

### Por qué existe
La inspección registra qué etiqueta se está corriendo (SPEC-004), pero la app no
sabía nada de ella: ni nombre, ni cliente, ni con qué tintas, sustratos o
medidas se produce. La galería es ese catálogo, dentro de la app. Arranca con
las **5 642 etiquetas** del archivo `Galeria.xlsx` de Calidad.

### Qué hace
Una pestaña **Galería** con una tabla de 15 columnas, en este orden y con estos
encabezados:

`Etiq`, `Nombre_etiq`, `Tipo`, `Cliente`, `Estatus`, `Tintas`, `Engrane`,
`Med_des`, `Med_eje`, `Repeticiones`, `Sustrato1`, `Sustrato2`, `Sustrato3`,
`Ancho`, `Tipo_tinta`

- **Búsqueda** por clave, nombre o cliente, y **filtro por tipo**. Arriba se
  indica cuántas etiquetas coinciden con la búsqueda y cuántas hay en total.
- La tabla se desplaza a lo ancho; la columna `Etiq` queda fija a la izquierda
  para no perder de vista de qué etiqueta es cada renglón.
- Se muestran 100 renglones y un botón «Mostrar 100 más», para que la tabla abra
  rápido en el teléfono aunque haya miles de etiquetas.
- Al tocar un renglón se abre la **ficha** de la etiqueta con los 15 datos.

### Seguir cargando etiquetas
Dos maneras, ambas solo para `ADMIN`:

**Desde Excel.** Se lee la primera hoja. Los encabezados se reconocen aunque
traigan espacios o cambie la mayúscula, así se puede subir el mismo formato que
el archivo de origen. Antes de guardar se muestra un resumen: etiquetas
nuevas, etiquetas que cambian, sin cambio, filas rechazadas por motivo y
columnas que no vienen en el archivo.

**Una por una.** El botón «Nueva etiqueta» abre un formulario con los 15
campos. Desde la ficha, el administrador puede **editar** una etiqueta.

### Reglas de negocio
- **La clave es `Etiq`, y no se repite.** Cargar un archivo **agrega las nuevas
  y actualiza las existentes**; no borra las que no vengan. Es lo contrario de
  la merma (SPEC-011), que reemplaza todo: un archivo de etiquetas puede traer
  solo las altas del mes.
- **Al actualizar, solo se tocan las columnas que trae el archivo.** Una celda
  vacía sí borra el dato de esa columna, porque el archivo se toma como la
  versión vigente de esa etiqueta. Una columna que no viene, no se toca.
- Si una clave se repite dentro del mismo archivo, gana la última fila y el
  resumen lo indica.
- **`Etiq` se guarda como texto, en mayúsculas.** Las claves tienen 5
  caracteres (`02086`, `D0018`). Si una clave solo de dígitos llega con menos
  de 5, se rellena con ceros a la izquierda, porque Excel pierde el cero
  inicial cuando la celda es numérica. No puede llevar `.`, `#`, `$`, `/`, `[`
  ni `]`, que la base no acepta en una clave.
- `Tintas`, `Engrane`, `Med_des`, `Med_eje`, `Repeticiones` y `Ancho` son
  numéricos. Una fila con texto en alguno de ellos se rechaza.
- Para retirar una etiqueta de uso se cambia su `Estatus` (hoy todas están en
  `A`). Desde la v1.12.0 el administrador también la puede **borrar**
  (SPEC-022).
- El alta manual rechaza una clave que ya existe y ofrece abrir su ficha.
- Cada etiqueta guarda quién la cargó o modificó por última vez, cuándo, y si
  fue desde Excel o a mano.
- **Ven la galería los tres papeles**; cargar, dar de alta y editar es de
  `ADMIN`.

### Datos
`cal/etiquetas/<Etiq>` en `impredimex-procesos`, con los 15 campos con el
nombre de su encabezado, más `actualizadoPor`, `actualizadoEn` y `origen`
(`excel` o `manual`). Los campos vacíos no se guardan.

### Costo de descarga
Las 5 642 etiquetas pesan unos **1.7 MB**. Por eso la galería **no se descarga
al abrir la app**, sino la primera vez que se abre la pestaña en la sesión, y
no queda escuchando cambios: el botón «Actualizar» la vuelve a leer. Con el
límite de 10 GB al mes del plan gratuito, alcanza para unas 5 800 aperturas al
mes.

### Lo que no hace todavía
- No se exporta a Excel.

La inspección consulta la galería desde la v1.4.0 (SPEC-016).

---

# SPEC-016 — Etiqueta y turno automáticos en la inspección

**Estado:** implementado (v1.4.0)

### Por qué existe
El inspector escribía el número de etiqueta sin ver de qué producto se trataba,
y elegía el turno a mano. Un número mal tecleado pasaba sin aviso, y el turno
dependía de que alguien se acordara de cambiarlo.

### Etiqueta
- Al escribir el número de etiqueta, la app la busca en la galería (SPEC-015)
  y muestra debajo **su nombre y su cliente**.
- La búsqueda se hace al llegar a 5 caracteres o al salir del campo. Se aplica
  la misma regla de clave de la galería: mayúsculas, y una clave de solo dígitos
  con menos de 5 se completa con ceros (`2086` → `02086`).
- El campo acepta letras, porque hay claves como `D0018`.
- **Si la etiqueta no está en la galería, se avisa pero no se bloquea.** La
  galería puede ir atrasada respecto de lo que se corre en piso, y detener la
  inspección por eso sería peor que registrarla. La inspección queda marcada
  como etiqueta fuera de galería.
- **Se consulta solo esa etiqueta**, no la galería completa: unos cuantos bytes
  por búsqueda, en lugar de 1.7 MB cada vez que un inspector abre la app. Si la
  galería ya se había abierto en la sesión, se usa esa copia.
- La inspección (y el hallazgo, si lo hay) guarda **copia** del nombre y el
  cliente tal como estaban (SPEC-009): `etiquetaNombre`, `etiquetaCliente` y
  `etiquetaEnGaleria` (`true` o `false`). Historial y Acciones los muestran.

### Turno
El turno lo calcula la app con la hora del teléfono; el inspector no lo elige.

| Turno | Desde | Hasta |
|---|---|---|
| Matutino | 06:00 | 14:00 |
| Vespertino | 14:00 | 21:30 |
| Nocturno | 21:30 | 06:00 del día siguiente |

- **Cada límite pertenece al turno que empieza:** las 14:00 en punto ya son
  vespertino; las 21:30, nocturno; las 06:00, matutino.
- La pantalla muestra el turno vigente y se actualiza cada minuto. **El que se
  graba es el de la hora en que se registra la inspección**, no el de la hora
  en que se abrió la pantalla.

### Fecha
- La fecha de la inspección, del hallazgo y del cierre es la **fecha local** del
  teléfono. Antes se tomaba en hora universal y, en México, todo lo registrado
  después de las 18:00 quedaba con la fecha del día siguiente.
- En el turno nocturno la fecha es la del calendario: una inspección a la 01:00
  lleva la fecha del día que empieza, no la del día en que arrancó el turno.

---

# SPEC-017 — Registro de rechazos (antes «Merma 2»)

> Desde la v1.8.0 el formulario y la tabla viven en la pestaña **Merma**, junto
> con la carga de Excel (SPEC-018). La pestaña «Merma 2» ya no existe.

**Estado:** implementado (v1.5.0); varios defectos por folio, tabla y Excel en
la v1.6.0

### Por qué existe
La merma hoy se anota a mano en papeletas y alguien la transcribe a Excel para
cargarla en la pestaña Merma (SPEC-011). Merma 2 es el primer paso para
capturarla directamente en la app, rechazo por rechazo. **Convive con la
pestaña Merma**, que no cambia, mientras se decide si la sustituye.

### Campos
| Campo | Cómo se llena |
|---|---|
| Folio de rechazo | Se escribe. Obligatorio y **único** |
| # de etiqueta | Se escribe. Obligatorio |
| Nombre de etiqueta | **Se deriva** del # de etiqueta, desde la galería (SPEC-015) |
| Cliente | **Se deriva** del # de etiqueta, desde la galería |
| Máquina | Se elige de la lista de máquinas. Obligatorio |
| Nómina Supervisor | Se escribe. Obligatorio |
| Nombre Supervisor | **Se deriva** de la nómina, desde el padrón de RRHH |
| Nómina Operador | Se escribe. Obligatorio |
| Nombre operador | **Se deriva** de la nómina, desde el padrón de RRHH |
| Nómina Inspector | Se escribe; si quien captura es `INSPECTOR`, ya viene con su nómina. Obligatorio |
| Nombre inspector | **Se deriva** de la nómina, desde el padrón de RRHH |
| Defecto | Se elige de los 40 defectos (SPEC-008). Obligatorio |
| Cantidad rechazada (metros lineales) | Número mayor que cero. Obligatorio |
| Cantidad rechazada (número de bobinas) | Número entero, cero o más. Obligatorio |

Los campos derivados no se escriben: se llenan solos y se ven en gris.

**Un folio puede tener varios defectos.** Defecto, metros y bobinas forman una
línea; «+ Agregar otro defecto» suma otra, y «Quitar» la elimina (siempre queda
al menos una). Con dos o más líneas se muestra el total de metros y bobinas del
folio. Un mismo defecto no puede ir dos veces en un folio: se suman sus
cantidades en una sola línea.

### Reglas de negocio
- **Las nóminas salen del padrón de RRHH**: `colaboradores` de
  `impredimex-suite`, el mismo de toda la suite (SPEC-009). La app lo lee y no
  lo escribe. La consulta se hace al dejar de escribir la nómina.
- **No se registra un rechazo con una nómina que no está en el padrón o que
  está dada de baja.** El nombre se deriva de la nómina: si no hay de dónde
  sacarlo, o es de alguien que ya no está, lo más probable es un error de dedo.
- **La etiqueta usa la misma regla de clave** que la inspección (SPEC-016):
  mayúsculas y ceros a la izquierda si es corta. **Si no está en la galería se
  avisa y se deja registrar**; en ese caso nombre y cliente se pueden escribir a
  mano, y el registro queda marcado como etiqueta fuera de galería.
- **El folio no se repite.** Se guarda en mayúsculas y sin espacios en los
  extremos (`r-101` y `R-101` son el mismo), y no puede llevar `.`, `#`, `$`,
  `/`, `[` ni `]`. Se aparta con una **transacción** en la base: si dos personas
  capturan el mismo folio al mismo tiempo, solo entra la primera y la otra ve
  «ya está registrado». Si el folio se apartó pero el rechazo no alcanzó a
  guardarse, se libera.
- Se agregan solos la **fecha local**, el **turno** según la hora (SPEC-016) y
  **quién capturó** (nómina y nombre de la sesión).
- **Los registros guardan copia de los nombres** tal como estaban al capturar
  (SPEC-009).
- La pestaña la usan los tres papeles.

### Rechazos registrados
- Debajo del formulario, una **tabla** con los **50 folios más recientes**, un
  renglón por defecto. Los datos del folio ocupan una sola celda alta por todos
  sus defectos, y los folios alternan color. Encabezado y columna Folio fijos
  al desplazarse.
- Columnas: Folio, Fecha, Turno, # de etiqueta, Nombre de etiqueta, Cliente,
  Máquina, Defecto, Metros lineales, Bobinas, Nómina Supervisor, Nombre
  Supervisor, Nómina Operador, Nombre operador, Nómina Inspector, Nombre
  inspector y Capturó.
- **Exportar a Excel por mes** (v1.7.0). Junto al botón se elige el periodo:
  el mes en curso (por omisión), cualquiera de los once anteriores o **Todo el
  histórico**. El mes se toma de la fecha del rechazo. Si el mes no tiene
  rechazos, se avisa y no se descarga nada. Archivo
  `Rechazos_Calidad_AAAA-MM.xlsx`, o `Rechazos_Calidad_historico_<fecha>.xlsx`
  para todo.
- El Excel trae todos los rechazos del periodo, no solo los de la tabla, con
  las mismas columnas y un renglón por defecto: los datos del folio
  se repiten en cada renglón para poder filtrar y hacer tablas dinámicas. La
  fecha va como fecha de Excel, el encabezado en azul y con filtro, y los
  folios alternan color.

### Datos
`cal/merma2/<id>` con un identificador que crece con el tiempo, así la lista de
los más recientes no necesita índice en las reglas. Campos: `folio`,
`etiqueta`, `etiquetaNombre`, `etiquetaCliente`, `etiquetaEnGaleria`, `maquina`,
`supervisorNomina`, `supervisorNombre`, `operadorNomina`, `operadorNombre`,
`inspectorNomina`, `inspectorNombre`, `defectos` (lista de
`{defecto, metros, bobinas}`), `metrosTotal`, `bobinasTotal`, `fecha`, `turno`,
`ts`, `capturoNomina` y `capturoNombre`.

Los rechazos capturados con la v1.5.0 tienen un solo defecto en `defecto`,
`metros` y `bobinas`, sin lista. La tabla y el Excel los leen igual.

`cal/merma2Folios/<folio>` guarda el `<id>` del rechazo con ese folio y se
aparta con transacción antes de escribir el rechazo.

### Lo que no hace todavía
- **No alimenta el foco.** El foco de la SPEC-004 sigue saliendo de la merma
  cargada por Excel. Conectar Merma 2 es la decisión pendiente de si sustituye
  a la pestaña Merma.
- Se edita y se borra desde la app desde la v1.10.0 y la v1.9.0 (SPEC-019).
- Hasta la v1.7.0 la tabla no se filtraba por mes; desde la v1.8.0 sí
  (SPEC-018).

---

# SPEC-018 — Merma: una sola fuente, formulario más Excel

**Estado:** implementado (v1.8.0)

### Por qué existe
La merma vivía en dos lados que no se hablaban: el Excel que se transcribe de
las papeletas, cargado agregado por mes (SPEC-011), y los rechazos que se
capturan en el formulario (SPEC-017). Son **los mismos datos**: el formulario
es la versión digital de la papeleta. Mientras se estandariza el uso del
formulario, el Excel sigue existiendo, pero tiene que entrar **igual que una
captura**, para que no parezcan datos de fuentes distintas.

### La pestaña
Una sola pestaña **Merma**, en este orden:
1. **Formulario de rechazo** para el día a día (SPEC-017). Los tres papeles.
2. **Cargar Excel**, mientras se deja de usar. Solo `ADMIN`.
3. **Rechazos registrados**: la tabla y la exportación, por mes. Los tres
   papeles.

### El Excel
- **Mismas columnas que el formulario y que la exportación:** Folio, Fecha,
  Turno, # de etiqueta, Nombre de etiqueta, Cliente, Máquina, Defecto, Metros
  lineales, Bobinas, Nómina Supervisor, Nombre Supervisor, Nómina Operador,
  Nombre operador, Nómina Inspector y Nombre inspector. **Un renglón por
  defecto**; varios renglones con el mismo folio son un mismo rechazo.
- El botón **Descargar plantilla** baja un archivo con esos encabezados y una
  hoja con las máquinas y los defectos válidos.
- Los encabezados se reconocen sin importar mayúsculas, acentos, espacios o
  guiones bajos. También se aceptan `Etiqueta` o `Etiq` por # de etiqueta,
  `Linea` por Máquina y `Mts rechazados` o `Metros` por Metros lineales. La
  columna `Capturó` de la exportación se ignora.

### Reglas de la carga
- **Obligatorios:** Folio, Fecha, Máquina, Defecto y Metros lineales (mayor que
  cero).
- **Se valida como el formulario:** la máquina debe estar en el catálogo de
  máquinas, el defecto en el de defectos (sin importar acentos: `IMPRESION
  FALTANTE` se toma como `IMPRESIÓN FALTANTE`), las bobinas deben ser un entero
  de cero o más, y el turno, si viene, debe ser Matutino, Vespertino o
  Nocturno.
- **Un error en un renglón rechaza todo su folio**, para no guardar rechazos a
  medias. También se rechaza un folio cuyos renglones traen fechas o máquinas
  distintas.
- **Un folio que ya está registrado se salta**, no se sobrescribe. Una carga
  nunca pisa lo que se capturó en el formulario, y subir dos veces el mismo
  archivo no duplica nada.
- Si un mismo defecto viene en dos renglones del mismo folio, se suman.
- **Se completa como el formulario.** La etiqueta lleva la regla de clave de la
  galería; si no trae nombre o cliente, se toman de la galería. Si una nómina
  está en el padrón de RRHH, **el nombre sale del padrón**, aunque el Excel
  traiga otro escrito, para que la misma persona se vea igual venga de donde
  venga.
- **A diferencia del formulario, se acepta una nómina que no está en el
  padrón** (o un renglón sin nómina): un Excel histórico puede traer a gente
  que ya no está. Se guarda lo que traiga el archivo y el resumen lo avisa.
- Fecha: celda de fecha de Excel, o texto `dd/mm/aaaa` o `aaaa-mm-dd`.
- Cada rechazo cargado queda con `origen: 'excel'` y con quién lo cargó.
- **Antes de guardar se muestra un resumen:** folios nuevos con sus defectos y
  metros, periodo, folios ya registrados, folios rechazados por motivo (con
  ejemplos), nóminas que no están en el padrón y etiquetas fuera de galería.
- Se guarda de 200 en 200 folios, con avance a la vista.

### De dónde sale el foco
- El foco, la tendencia y la pestaña Comportamiento leen **una sola fuente de
  metros por máquina, defecto y mes**:
  - **Desde el primer mes con rechazos registrados**, los rechazos (formulario
    y Excel).
  - **Antes de ese mes**, la base histórica: la última carga de la SPEC-011 en
    `cal/merma` si existe, y si no, la semilla incrustada.
  Con ese corte, un mismo mes nunca se cuenta de dos fuentes.
- Los hallazgos siguen sumando como eventos (SPEC-004).
- Para no descargar todos los rechazos en cada apertura, se mantiene un
  **resumen** en `cal/mermaResumen/<máquina>/<defecto>/<AAAA-MM>` con los
  metros sumados. Cada rechazo, del formulario o del Excel, suma sus metros al
  resumen **en la misma escritura** en que se guarda.
- Si el resumen no existe (la primera vez, o si se borró), la app lo arma con
  todos los rechazos. El administrador tiene **Recalcular resumen** para
  rehacerlo cuando se borra o corrige un rechazo a mano en la consola.

### La tabla por mes
- El selector de mes de la exportación (SPEC-017) también filtra la tabla. Por
  omisión, el mes en curso.
- Con «Todo el histórico» la tabla muestra los 300 folios más recientes; el
  Excel los trae todos.
- Para leer un mes sin índices en las reglas, la clave de cada rechazo empieza
  con su fecha: `cal/merma2/<AAAA-MM-DD>_<id>`. Los rechazos guardados antes de
  la v1.8.0 tienen una clave sin fecha; se leen aparte y se acomodan por su
  campo `fecha`.

### Lo que no hace todavía
- La carga no avisa de folios que ya están **dentro de la base histórica**
  agregada: esa base no guarda folios.

---

# SPEC-019 — Editar y borrar un rechazo

**Estado:** implementado (borrar en la v1.9.0, editar en la v1.10.0)

### Por qué existe
Un rechazo capturado por error (de prueba, con el folio equivocado, duplicado
con otra captura) cuenta en el foco. Borrarlo desde la consola de Firebase
pedía tres pasos a mano y sin rastro.

### Columnas
En la tabla de rechazos, el **administrador** ve dos columnas propias,
**Editar** y **Borrar**, justo después de Folio, para que se alcancen en el
teléfono sin desplazar la tabla. No salen en el Excel.

### Editar
- **Editar** carga el rechazo en el mismo formulario de arriba, con un aviso
  «Editando el folio …» y el botón «Guardar cambios». «Cancelar edición»
  regresa el formulario a captura.
- Se editan folio, etiqueta, máquina, nóminas y las líneas de defecto. **Se
  conservan** fecha, turno, origen y quién lo capturó, y se agregan
  `editadoPorNomina`, `editadoPorNombre` y `editadoEn`.
- **Mismas validaciones que al capturar**, con tres excepciones para no
  bloquear la corrección de un rechazo cargado de Excel: lo que el original no
  traía (etiqueta, una nómina, bobinas) puede seguir sin venir, y una nómina
  **que no se cambió** se acepta aunque ya no esté en el padrón, con el nombre
  que tenía.
- La etiqueta y los nombres se vuelven a derivar de la galería y el padrón.
- Si cambia el folio, el nuevo se aparta igual que al capturar (no puede ser
  uno ya registrado) y el anterior queda libre.
- En una sola escritura: el rechazo actualizado, la **diferencia** de metros en
  el resumen del foco (resta lo anterior y suma lo nuevo) y la **versión
  anterior** en `cal/merma2Ediciones/<id>/<n>` con quién y cuándo.

### Borrar
- En la columna **Borrar**.
- Antes de borrar se muestra el folio con fecha, máquina, etiqueta y sus
  defectos con metros y bobinas, y se pide un **motivo** (obligatorio).
- En **una sola escritura**:
  - se quita el rechazo de `cal/merma2`;
  - se libera su folio en `cal/merma2Folios`, solo si apunta a ese rechazo,
    para que se pueda capturar otra vez;
  - se **restan sus metros** del resumen del foco (SPEC-018);
  - se guarda una **copia** en `cal/merma2Borrados/<id>` con
    `borradoPorNomina`, `borradoPorNombre`, `borradoEn` y `motivo`.

### Reglas de negocio
- Solo `ADMIN`. Los demás papeles no ven el botón.
- La copia es el rastro de quién borró y por qué, y permite recuperar un
  rechazo borrado por error (a mano, en la consola).
- Al restar, el resumen puede quedar en 0 en ese mes. Para el foco, menos de
  0.001 m no cuenta; «Recalcular resumen» deja el resumen sin esos ceros.
- Como el resto de los permisos, se aplica en la pantalla; las reglas de la
  base no lo exigen todavía (SPEC-010).

---

# SPEC-020 — Cantidad rechazada en etiquetas, metros calculados

**Estado:** implementado (v1.11.0)

### Por qué existe
En piso el rechazo se cuenta en **número de etiquetas**, no en metros. Pedir
los metros obligaba a hacer la cuenta a mano. El foco y los reportes sí
necesitan metros lineales, así que la app los calcula.

### La fórmula
```
metros lineales = (número de etiquetas × (Med_des / 100)) / Repeticiones
```
`Med_des` y `Repeticiones` son los de la etiqueta del folio en la galería
(SPEC-015). El resultado se redondea a dos decimales.

### En el formulario
- Cada línea de defecto tiene **Cantidad rechazada (número de etiquetas)**,
  **Cantidad rechazada (número de bobinas)** y **Cantidad rechazada (metros
  lineales)**. Los metros se calculan solos, en gris, con la cuenta a la vista
  debajo (por ejemplo, «5,000 etiquetas × 33.02 cm ÷ 100 ÷ 4 rep.»).
- El número de etiquetas es obligatorio y entero mayor que cero.
- Al cambiar la etiqueta del folio se recalculan todas las líneas.
- **Si no se puede calcular** (la etiqueta no está en la galería, o le falta
  `Med_des` o `Repeticiones`, o alguno es cero), se avisa y **los metros se
  escriben a mano**, como antes.
- El total del folio suma etiquetas, metros y bobinas.

### Qué se guarda
- En cada defecto, `etiquetas` además de `metros` y `bobinas`.
- En el rechazo, **copia** de `medDes` y `repeticiones` con que se calculó
  (SPEC-009): si después se corrige la galería, el rechazo sigue diciendo con
  qué medidas se hizo la cuenta. Sin cálculo (metros a mano) no se guardan.

### Excel y tabla
- Columna nueva **Etiquetas rechazadas**, antes de Metros lineales, en la
  tabla, la exportación y la plantilla.
- Al cargar: si el renglón trae etiquetas rechazadas y la etiqueta del folio
  tiene medidas, **los metros se calculan** con la fórmula, aunque el archivo
  traiga otros. Si no trae etiquetas rechazadas, se usan los metros del
  archivo (un histórico puede traer solo metros). Si no hay forma de tener
  metros, se rechaza el folio.

### Al editar (SPEC-019)
Las líneas se recalculan con las medidas actuales de la galería. Un rechazo
anterior a esta versión, sin número de etiquetas, puede seguir sin él: sus
metros se conservan y se pueden corregir a mano.

---

# SPEC-021 — Máquina de inspección y máquina que genera; defecto con autocompletado

**Estado:** implementado (v1.12.0)

### Por qué existe
Un defecto muchas veces se detecta en una máquina distinta de la que lo
provoca: una raya que se ve en el refilado puede venir de la impresora. Para
corregirlo hay que saber **qué máquina lo genera**.

### Qué hace
- En el formulario de rechazo, «Máquina» pasa a ser **Máquina de inspección**
  (donde se detecta el problema) y a su lado está **Máquina que genera** (la
  que provoca el defecto). Las dos son obligatorias al capturar y salen del
  mismo catálogo de máquinas.
- Junto a **Defecto** está **# defecto** (v1.13.0): al escribir el defecto se
  llena su número, y al escribir el número se llena el defecto. Un número que
  no está en el catálogo no se acepta. Cada línea guarda copia del número
  (`numero`) como estaba al capturar.
- El **Defecto** de cada línea se escribe con **autocompletado**: al teclear se
  sugieren los del catálogo, sin importar acentos ni mayúsculas, y al salir del
  campo se escribe tal como está en el catálogo. Un texto que no sea un
  defecto del catálogo no se acepta.

### Reglas de negocio
- **El foco cuenta los metros en la máquina que genera.** «Qué vigilar en esta
  máquina» habla de las variables que esa máquina tiene que controlar, y el
  defecto se origina ahí, aunque se haya visto en otra. Los rechazos sin
  máquina que genera (anteriores a esta versión, o de un Excel que no la trae)
  cuentan en la máquina de inspección.
- Al editar un rechazo anterior sin máquina que genera, puede seguir sin ella.

### Excel y tabla
- Columna **# defecto** antes de Defecto. Al cargar basta con uno de los dos;
  si vienen ambos y no coinciden, se rechaza el folio.
- Columnas **Máquina de inspección** y **Máquina que genera**. Al cargar, se
  sigue aceptando `Máquina` o `Linea` como máquina de inspección. La máquina que
  genera es opcional en el archivo; si viene, debe estar en el catálogo y ser
  la misma en todos los renglones del folio.

### Datos
`maquina` es la máquina de inspección (el nombre del campo no cambia, para no
romper lo anterior) y `maquinaGenera` la que genera.

---

# SPEC-022 — Catálogo de defectos editable y numerado; editar y borrar etiquetas

**Estado:** implementado (v1.12.0); números y catálogo oficial en la v1.13.0

### Catálogo oficial (v1.13.0)
Calidad definió el 24 de noviembre de 2026 la lista oficial, numerada. Se
quitaron cuatro defectos que hablaban de lo mismo que otros: ADHESIVO, FALTA
DE TINTA, LAMINACIÓN y PEGADO.

| # | Defecto | # | Defecto | # | Defecto |
|---|---|---|---|---|---|
| 1 | ANCHO PLANO | 13 | MANCHAS | 25 | DESPRENDIMIENTO |
| 2 | DOBLEZ | 14 | PIOJOS | 26 | LIMPIEZA |
| 3 | MANGA ABIERTA | 15 | POROSIDAD | 27 | MAL REFILADO |
| 4 | MANGA PEGADA | 16 | RAYA | 28 | REFILADO MOVIDO |
| 5 | PUNTEADO | 17 | REGISTRO | 29 | DESLAMINADO |
| 6 | TRASLAPE | 18 | REMOSQUEO | 30 | ARRUGA |
| 7 | EMPLASTADO | 19 | REPINTE | 31 | EMPALMES |
| 8 | EXCESO DE PRESIÓN | 20 | RESEQUEDAD | 32 | SOBRE SUAJADO |
| 9 | FALTA DE PRESIÓN | 21 | TABLETEO | 33 | GOLPE |
| 10 | FUERA DE REGISTRO | 22 | TEXTO FALTANTE | 34 | GRABADO |
| 11 | IMPRESIÓN FALTANTE | 23 | TONOS | 35 | CURLING |
| 12 | LAGRIMEO | 24 | VELO | 36 | ONDULACIÓN |

- La lista está en el código (`DEFECTOS_OFICIALES`, con su versión
  `VERSION_CATALOGO`). **La primera vez que un administrador abre la app** con
  un catálogo de otra versión, la app lo deja igual a la lista: pone el número
  a los que ya existen (conservando su identificador), agrega los que falten y
  **quita del catálogo** los que no están en ella. La versión aplicada queda en
  `cal/defectosCatalogo`, así no vuelve a correr.
- Lo ya registrado con un defecto quitado lo conserva y sigue contando en el
  foco con ese nombre. Si alguno de los quitados debe sumarse a otro defecto,
  falta decidir a cuál (ver «Trabajo pendiente de definir»).
- Sin catálogo en la base, se siembra con esta lista.

### Número de defecto
- Cada defecto tiene **número** (`numero`), entero, sin repetirse. La tabla de
  la galería lo muestra en la primera columna y ordena por él; Nuevo y Editar
  piden número y nombre (al crear se sugiere el siguiente libre).
- Las listas de defectos de toda la app van en orden de número.

### Catálogo de defectos
- En la pestaña **Galería**, debajo de las etiquetas, una tabla **Defectos**
  con el catálogo. La ven los tres papeles; `ADMIN` tiene **Nuevo defecto** y
  las columnas **Editar** y **Borrar**.
- Vive en `cal/defectos/<id>` (`nombre`, quién y cuándo). La primera vez que un
  administrador abre la app sin catálogo en la base, se siembra con los 40 del
  código.
- Los nombres van en mayúsculas, no se repiten (sin importar acentos) y no
  pueden llevar `.`, `#`, `$`, `/`, `[` ni `]`.
- **Nuevo defecto** queda disponible de inmediato en el formulario de rechazo,
  la inspección, la matriz, Comportamiento y la carga de Excel.
- **Editar (renombrar)** cambia el nombre **en todo lo registrado** para que no
  queden dos nombres para lo mismo: rechazos, hallazgos y matriz se actualizan,
  el resumen del foco se recalcula, y para la base histórica (que no se puede
  reescribir) se guarda el cambio en `cal/defectosRenombrados`, que el foco
  aplica al leerla. Las copias de rechazos editados o borrados se quedan como
  estaban, porque son rastro. No se puede renombrar a un nombre que ya existe.
- **Borrar** lo quita del catálogo: ya no se puede elegir. Lo que ya está
  registrado con ese defecto lo conserva y sigue contando en el foco.

### Etiquetas
- En la tabla de etiquetas, `ADMIN` tiene las columnas **Editar** y **Borrar**,
  después de `Etiq`. Editar abre el formulario de la etiqueta (SPEC-015).
- **Borrar** pide confirmación, quita la etiqueta de `cal/etiquetas` y guarda
  una copia en `cal/etiquetasBorradas/<Etiq>` con quién y cuándo. Los
  rechazos e inspecciones que ya la tienen conservan su copia de nombre,
  cliente y medidas (SPEC-009).

---

# SPEC-023 — Acciones de merma: recuperado y acción

**Estado:** implementado (v1.14.0)

### Por qué existe
El material se rechaza **por muestreo**: al revisarlo completo, parte se puede
recuperar. Y un rechazo, como un hallazgo de inspección, pide una acción para
que no vuelva a ocurrir. La pestaña Acciones solo tenía los hallazgos de la
inspección.

### La pestaña Acciones
1. **Acciones de la inspección**: los hallazgos, como hasta ahora (SPEC-007).
2. **Acciones de merma**: la misma tabla de rechazos registrados de la pestaña
   Merma (SPEC-017), con dos columnas más, **Recuperado** y **Acción**, justo
   después de Folio para que se alcancen en el teléfono sin desplazar la tabla.
   Tiene su propio selector de mes, un filtro (todas, sin acción, con acción) y
   su propia exportación a Excel. En la celda de Recuperado se ve el nombre del
   defecto, porque en el teléfono la columna Defecto queda lejos. No tiene Editar ni Borrar: el rechazo se
   corrige en Merma.

### Recuperado y acción
- Se registran **por defecto** (por renglón): cada defecto de un folio tiene
  su cantidad y puede tener su propia causa.
- Un solo botón **Registrar** (o **Cambiar**), en la celda de Recuperado, que
  abre la captura de lo recuperado y la acción juntos; para `SUPERVISOR` y
  `ADMIN`, como el cierre de acciones de inspección. El `INSPECTOR` consulta.
- **Recuperado** se captura en **número de etiquetas**, como el rechazo, y la
  app calcula los metros en la misma proporción que el renglón (metros
  rechazados × recuperadas ÷ rechazadas). No puede pasar de lo rechazado. En
  un rechazo anterior sin número de etiquetas, se captura en metros.
- **Acción**: texto libre, qué se hará para que no vuelva a ocurrir.
- Se guarda en el renglón: `recuperadoEtiquetas`, `recuperadoMetros`,
  `accion`, `accionPorNomina`, `accionPorNombre` y `accionEn`.
- Si el rechazo se edita en Merma (SPEC-019), cada defecto conserva su
  recuperado y su acción.

### El foco no cambia
El foco sigue contando **lo rechazado**: mide qué tan seguido ocurre cada
defecto en cada máquina, y el defecto ocurrió aunque el material se haya
recuperado. Lo recuperado se reporta aparte.

### Excel
La exportación de Acciones de merma trae las columnas de la de Merma más
**Etiquetas recuperadas**, **Metros recuperados**, **Merma neta (m)**
(rechazado menos recuperado), **Acción**, **Registró** y **Fecha de registro** (de lo recuperado o la
acción, lo último que se haya guardado).

---

# SPEC-024 — Orden de producción en el rechazo

**Estado:** implementado (v1.16.0)

- En el formulario de rechazo, **Orden de producción** va entre Folio de
  rechazo y # de etiqueta. Texto libre, en mayúsculas.
- **Obligatoria al capturar.** Al editar un rechazo anterior que no la tenga
  (SPEC-019), puede seguir vacía.
- Se guarda en el rechazo como `ordenProduccion`.
- Columna **Orden de producción** después de Folio en la tabla, la exportación
  y la plantilla. Al cargar un Excel es opcional; se reconoce también como
  `OP` u `Orden`.

---

# SPEC-025 — Carga del histórico «Rechazo interno»

**Estado:** implementado (v1.17.0)

### Por qué existe
Calidad llevaba los rechazos de 2026 en el archivo `rechazo_interno.xlsx` (1,092
folios, de enero a noviembre). Al revisarlo para cargarlo (SPEC-018) salieron
diferencias con lo que la carga esperaba; se resolvieron así.

### Ajustes a la carga
- **Basta con una de las dos máquinas.** El archivo no trae máquina de
  inspección, solo la que genera. Antes se exigía la de inspección; ahora se
  rechaza un folio solo si no trae ninguna. La que venga debe estar en el
  catálogo. Al editar un rechazo sin máquina de inspección, puede seguir sin
  ella.
- **Claves abreviadas:** `R5`, `R6` y `R7` se leen como `RT5`, `RT6` y `RT7`
  (confirmado por Calidad el 25/11/2026).
- **Máquinas nuevas** en el catálogo: REV1, REV2, REV3 y REV6, área REVISADO.
- **Un error de fórmula de Excel** (`#N/A`, `#REF!`…) en # defecto cuenta como
  vacío; manda el nombre del defecto.
- **Encabezados** «Supervisor», «Operador» e «Inspector» se aceptan como el
  nombre de cada uno.
- **Fecha futura:** se rechaza el folio.

### Lo que Calidad hace antes de cargar
- Dar de alta en el catálogo de defectos, con el número que ya usa el archivo:
  **37 SPOT MOVIDO**, **38 LÍNEA DE ADHESIVO**, **39 MANGA DOBLADA**, y
  **FALTA DE TINTA** con el siguiente libre (en el archivo va sin número).
- Dar de alta en la galería las etiquetas del archivo que no están, con
  `Med_des` y `Repeticiones`; sin ellas no se calculan los metros y el folio
  se rechaza.

### Resultado esperado
Con los defectos dados de alta y la galería actual, la vista previa da 1,020
folios nuevos y 72 rechazados: 71 por etiquetas fuera de la galería y 1 por
fecha futura (2026-88). Al cargarlos, el foco usa los rechazos desde enero de
2026 y la semilla incrustada solo para 2025.

---

# SPEC-026 — Folio de rechazo automático

**Estado:** implementado (v1.18.0)

### Por qué existe
Los folios se escribían a mano y el histórico cargado (SPEC-025) quedó con
números que no siguen el orden de las fechas. Calidad definió que el folio sea
**automático**, con la estructura **año-consecutivo** (`2026-1093`), y que el
consecutivo siga el orden de las fechas, de la más antigua a la actual.

### En el formulario
- **Folio de rechazo · automático** ya no se escribe: muestra el siguiente
  folio del año y **se asigna al guardar**. El que se ve es una vista previa;
  si alguien guarda antes, al confirmar se toma el siguiente libre.
- El año es el de la fecha del rechazo; el consecutivo empieza en 1 cada año.
- Se asigna con una **transacción** sobre `cal/merma2Contador/<año>` y luego se
  aparta en `cal/merma2Folios`, así dos capturas al mismo tiempo no reciben el
  mismo folio. Si el contador no existe o va atrás, se parte del mayor folio
  `año-N` ya registrado.
- Al editar (SPEC-019) el folio no cambia.

### Renumerar por fecha (una vez, o cuando haga falta)
- En la tarjeta de carga, `ADMIN` tiene **Renumerar folios por fecha**: ordena
  todos los rechazos de cada año por fecha y, dentro de la misma fecha, por el
  número que ya tenían; les asigna `año-1`, `año-2`, … y deja el contador en el
  último.
- Antes de aplicar muestra cuántos folios cambian y ejemplos. Cada rechazo que
  cambia guarda su folio anterior en `folioAnterior` (solo la primera vez), que
  sale en el Excel como **Folio anterior**.
- Los rastros (`merma2Ediciones`, `merma2Borrados`) conservan el folio que
  tenían en su momento.

### Carga de Excel
- **El folio del archivo ya no es la identidad del rechazo**: solo agrupa los
  renglones de un mismo rechazo (y se guarda como `folioArchivo`). Sin columna
  Folio, cada renglón es un rechazo. A cada rechazo nuevo se le asigna folio
  automático, en orden de fecha, a continuación del último del año.
- **Para no duplicar** al subir dos veces el mismo archivo, un rechazo se
  considera ya registrado si coinciden fecha, orden de producción, etiqueta,
  máquina (la que genera, o la de inspección) y sus defectos con etiquetas y
  metros. Esos se saltan.
- Si el archivo trae fechas anteriores a rechazos ya registrados del mismo año,
  sus folios quedan al final; el resumen lo avisa y sugiere renumerar.

---

# SPEC-027 — Operador, hora y auditor en la inspección

**Estado:** implementado (v1.19.0)

### Qué hace
En **Datos de la inspección**, además de etapa, turno, máquina y etiqueta:
- **Nómina operador** y **Nombre operador**: el nombre se deriva del padrón de
  RRHH (SPEC-009), igual que en el rechazo (SPEC-017). Es obligatorio; no se
  registra una inspección con una nómina que no está en el padrón o que está
  dada de baja. Después de registrar, la nómina del operador se queda escrita,
  porque suele seguir en la misma máquina.
- **Hora de inspección · automática**: se toma al terminar la inspección, es
  decir, al tocar Pasa o No pasa, junto con la fecha y el turno. La casilla
  muestra la última hora registrada.
- **Auditor · automático**: nombre y nómina de quien inició sesión. Es el mismo
  dato que ya se guardaba como `inspectorNombre` e `inspectorNomina`; en
  pantalla se llama Auditor.

### Qué se guarda
En la inspección y, si no pasa, en el hallazgo: `operadorNomina`,
`operadorNombre` (copia) y `hora` (`HH:MM`, hora local).

### Dónde se ve
- **Historial**: hora junto a la fecha, operador y auditor.
- **Acciones de la inspección** (tabla y Excel): columnas **Hora**,
  **Operador** y **Auditor** (antes «Detectó»).

### De paso (v1.19.0)
En «Qué vigilar en esta máquina» el nombre del defecto tiene ancho fijo, así
el texto «vigilar: …» ya no empuja su barra y todas empiezan en el mismo lugar.

---

# SPEC-028 — Arranque de calidad y seguimiento a corrida

**Estado:** implementado (v1.20.0). Faltan los formatos de digital, laminado y
acondicionado, y los rangos de código de barras y medidas, que Calidad todavía
no tiene definidos.

### Por qué
Calidad revisa el semiterminado: cuando el producto ya salió mal, no hay nada
que hacer. Las variables de proceso (SPEC-004, SPEC-005) se quedan para
prevenir el defecto, pero además hace falta revisar **al arrancar** el trabajo y
**durante la corrida**, para detectar el problema antes de que haya material
malo. Con esto se cumple lo que la SPEC-003 dejó pendiente: que la etapa
determine qué se pregunta.

### Las dos etapas
En **Datos de la inspección** la etapa es **Arranque** o **Seguimiento a
corrida** (antes «En proceso»; se graba con el mismo valor, `proceso`, para que
las inspecciones anteriores se sigan leyendo igual). Las dos piden máquina,
etiqueta y operador; hora y auditor son automáticos (SPEC-027). Hay un campo
nuevo, **orden de producción**: obligatorio en el arranque; en el seguimiento
viene de la corrida.

**Sin arranque no hay seguimiento.** En una máquina con formato, el seguimiento a
corrida solo se puede hacer si hay una corrida activa, es decir, un arranque
liberado. Sin ella, la pantalla de seguimiento solo muestra el aviso y el botón
para hacer el arranque.

### Arranque (liberación)
Es el «Apartado exclusivo de calidad» de la hoja de arranque, en la app.

- **El formato sale del área de la máquina.** Rotograbado (RT5–RT7) y
  Flexografía (FL1–FL4) tienen el suyo, con los puntos y estándares de la hoja
  tal cual. Las máquinas de otras áreas todavía no tienen formato: la app lo
  dice y no deja registrar el arranque. Los formatos de digital, laminado y
  acondicionado se agregan cuando Calidad los comparta.
- **Requisitos previos** (Sí / No): orden de producción, control de tintas, kit
  completo, etiquetas MP y sábana de arranque.
- **Verificación contra estándar**: cada punto con su estándar y su resultado
  **Cumple / No cumple / NA**.
  - **Rotograbado (16):** propuesta, tonos, textos, registro de impresión, spot
    (medidas y densidad), dirección de impresión en máquina, espesor de
    material, curling, código de barras, medida eje, medida desarrollo, barniz
    mate, barniz sobre impresión, etiqueta sin repinte, etiqueta sin velo y
    anclaje de tinta.
  - **Flexografía (15):** propuesta, tonos, textos, registro de impresión,
    alineación de grabado, spot, dirección de impresión en máquina, espesor de
    material, código de barras, medida eje, medida desarrollo,
    laminado/barnizado, curling, presión de suaje y anclaje de tinta.
- **Estándares desde la galería** (SPEC-015): medida eje y medida desarrollo
  muestran `Med_eje` y `Med_des` de la etiqueta, pasados de cm a **mm**, que es
  como se mide en piso; espesor de material muestra sus sustratos. Lo demás
  muestra el estándar de la hoja.
- **El área queda libre del trabajo del pedido anterior** (Sí / No) y
  **comentarios de calidad**.
- **Firma de calidad**: el auditor en sesión. **Hora**: al terminar.
- **Resultado automático**: **Liberado** si los cinco requisitos están en Sí,
  todos los puntos en Cumple o NA y el área quedó libre; si no, **No liberado**,
  con la lista de motivos. No se registra un arranque con algo sin contestar.
- **Un arranque no liberado se repite** cuando se corrige; cada intento queda
  registrado con su número (1, 2, 3…) para esa máquina, OP y etiqueta.

### Corrida
- Un arranque **liberado abre una corrida** en esa máquina: OP, etiqueta, quién
  liberó y a qué hora.
- **Una máquina tiene a lo sumo una corrida activa.** Liberar un arranque nuevo
  en una máquina cierra la corrida anterior (motivo: nuevo arranque).
- **Terminar corrida**: cualquier usuario la cierra cuando termina la OP; queda
  quién y cuándo.

### Seguimiento a corrida
- **Método: por master**, que es como se trabaja hoy. Cada revisión lleva el
  **número de master**; la app propone el siguiente al último revisado.
- En una máquina con formato, el seguimiento se liga a la **corrida activa**:
  la OP y la etiqueta salen de ella. El número de master es obligatorio en las
  máquinas con formato y opcional en las demás.
- **Con la corrida liberada, los datos quedan bloqueados**: etapa, máquina, OP,
  etiqueta y número de master (el siguiente al último revisado) no se
  modifican. Para pasar a otra corrida, el inspector toca su fila en **Corridas
  activas**. Tocar otra vez la corrida seleccionada (resaltada) la suelta: etapa
  y máquina quedan libres para elegir otra máquina o hacer un arranque.
- **Terminar corrida** es un botón al final de «Datos de la inspección». Los
  datos de la corrida (liberación, revisiones, último master) se ven en
  «Corridas activas»; la tarjeta de la corrida solo aparece para avisar que a
  la máquina le falta el arranque. Lo único
  que se cambia es la **nómina del operador**; la app propone la de la última
  revisión de la corrida, o la del arranque. **Si no hay
  corrida activa, no se puede registrar el seguimiento**: primero se libera el
  arranque. Las máquinas de áreas sin formato todavía no tienen arranque, así
  que siguen con la inspección de variables como antes.
- Cada revisión incluye:
  - los **puntos del producto** marcados «en seguimiento» del formato. Por
    omisión son tonos, textos, registro, spot, curling, código de barras,
    medidas eje y desarrollo, repinte, velo, presión de suaje y anclaje de
    tinta;
  - las **variables de proceso** (SPEC-004), como antes;
  - **Pasa / No pasa**. Con un punto en No cumple no se puede registrar Pasa:
    se registra No pasa y se abre el hallazgo (SPEC-007).
- **Corridas activas**: la pestaña muestra todas, con máquina, OP y etiqueta,
  hora de liberación, revisiones, último master y última revisión. Tocar una corrida
  elige su máquina.
- **Por AQL** (SPEC-006) queda como segundo método, para cuando Calidad defina
  el criterio.

### Especificaciones y rangos
En **Galería** hay una tabla **Formatos de arranque** por área. Todos la ven;
solo el administrador edita. De cada punto se puede cambiar:
- el **estándar** que se muestra;
- si se revisa **en seguimiento**;
- en **medida eje / desarrollo**: la **tolerancia ±** en mm. Con tolerancia, el
  inspector escribe la medida en mm y la app marca Cumple o No cumple contra el
  valor de la galería;
- en **código de barras**: el **grado mínimo** (A–E). Con grado mínimo, el
  inspector elige el grado y la app marca el resultado.

Mientras no haya rango, el inspector marca Cumple / No cumple como en la hoja, y
puede anotar la medida o el grado de todos modos. Con rango, NA sigue
disponible (por ejemplo, una etiqueta sin código de barras).

### Qué se guarda
- `cal/arranques/<id>`: máquina, área, OP, etiqueta (y nombre, cliente),
  operador, auditor, fecha, hora, turno, requisitos, puntos (resultado, medida,
  grado y el estándar o rango con que se evaluó), área libre, comentarios,
  resultado, motivos, intento y la corrida que abrió.
- `cal/corridas/<AAAA-MM-DD>_<id>`: máquina, área, OP, etiqueta, arranque, quién liberó y
  cuándo, estado (activa / cerrada), `masters` (el más alto revisado), última
  revisión, último operador, y el cierre.
- En la inspección de seguimiento (`cal/inspecciones`): `op`, `corridaId`,
  `master`, `puntos` y `puntosNoCumple`.
- `cal/especificaciones/<área>/<punto>`: lo que el administrador cambió; el
  resto viene del código.

### Dónde se ve
**Historial** muestra arranques y seguimientos juntos: los arranques con
Liberado / No liberado, intento y motivos; los seguimientos con OP y master.

### Corridas terminadas (v1.22.0)
Una corrida terminada no se borra: queda en `cal/corridas` con estado
`cerrada`. En **Historial → Corridas terminadas** se consulta:
- **Tabla por mes de liberación** (o todo el histórico): máquina, OP, etiqueta,
  nombre, liberada (fecha y hora) y quién la liberó, terminada y quién la
  terminó, duración, revisiones, último master y motivo de cierre (terminada o
  nuevo arranque). Se lee al abrir la pestaña; no es una escucha en vivo.
- **Exportar a Excel**: las mismas columnas, con el formato de las otras
  exportaciones.
- **Detalle**: al tocar una corrida se ven juntos su arranque (requisitos,
  puntos con resultado, medida o grado, área libre y comentarios) y todas sus
  revisiones de seguimiento (master, hora, operador, resultado, puntos que no
  cumplieron y auditor).
- **Clave de la corrida**: desde la v1.22.0 empieza con la fecha de liberación
  (`AAAA-MM-DD_<id>`), como los rechazos (SPEC-018), para leer un mes por rango
  de clave sin índices. Las corridas de prueba anteriores tienen clave sin
  fecha y solo salen en «Todo el histórico».

---

# Convenciones del código

- **Ancho de pantalla.** Desde la v1.18.1 todas las pestañas, la barra de
  pestañas y los paneles tienen el mismo ancho máximo, 1,600 px, para que los
  paneles no cambien de ancho al pasar de una pestaña a otra en computadora.
  En el teléfono y la tableta ocupan el ancho de la pantalla, como siempre.
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

- **Defectos quitados del catálogo el 24/11/2026** (ADHESIVO, FALTA DE TINTA,
  LAMINACIÓN, PEGADO): decidir si su historia se suma a otro defecto de la
  lista. Si sí, se renombra cada uno al defecto destino y su historia se une.

- **Rangos del arranque y del seguimiento** (SPEC-028): grado mínimo del código
  de barras y tolerancia de las medidas eje y desarrollo. La app ya tiene dónde
  capturarlos (Galería → Formatos de arranque).
- **Formatos de arranque de digital, laminado y acondicionado** (SPEC-028).
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
