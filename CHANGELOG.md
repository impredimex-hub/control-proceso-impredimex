# CHANGELOG

Todos los cambios notables de Control de Procesos (`control-proceso-impredimex`)
se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el
versionado sigue [Semantic Versioning](https://semver.org/lang/es/).

Las versiones 1.0.0 a 1.2.0 se registraron al adoptar este archivo, a partir del
historial del repositorio y de `SPECS.md`.

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
