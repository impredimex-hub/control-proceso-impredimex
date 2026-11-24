# CHANGELOG

Todos los cambios notables de Control de Procesos (`control-proceso-impredimex`)
se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el
versionado sigue [Semantic Versioning](https://semver.org/lang/es/).

Las versiones 1.0.0 a 1.2.0 se registraron al adoptar este archivo, a partir del
historial del repositorio y de `SPECS.md`.

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
