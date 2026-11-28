# Control de Procesos — Impredimex

Inspección de calidad en línea: foco por máquina, hallazgos con causa y
acciones correctivas que se cierran.

**Dirección:** https://impredimex-hub.github.io/control-proceso-impredimex/
**Versión vigente:** 1.27.0 (ver [`CHANGELOG.md`](./CHANGELOG.md))
**Estado:** reconstruida y publicada; varias especificaciones están parciales
(ver la tabla de estado en [`SPECS.md`](./SPECS.md))

---

## Descripción

Control de Procesos guía al inspector de calidad en piso: le dice qué defectos
pesan más en la máquina que está revisando, qué variables de proceso los
provocan, y registra el resultado. Si el producto no pasa, el hallazgo exige
una causa y queda abierto hasta que un supervisor lo atiende y lo cierra.

Es la reconstrucción de una versión anterior que se usó de abril a julio de
2026. Por qué se rehízo, y lo que enseñaron sus datos, está al principio de
[`SPECS.md`](./SPECS.md).

Forma parte de la **suite Impredimex**: el inicio de sesión y la lista de
personal son compartidos con RRHH, EPP, Mantenimiento e Ingeniería de Procesos,
y se entra desde el portal https://impredimex-hub.github.io/.

### Funciones principales

- **Foco por máquina** con los defectos que más metros rechazados sumaron en
  los últimos tres meses, y si van al alza o a la baja
- **Variables de proceso a vigilar**, tomadas de la matriz defecto ↔ variable
- **Inspección de producto** pasa / no pasa, en arranque o en proceso, con
  operador (nombre desde el padrón), hora y auditor automáticos. Al
  escribir la etiqueta muestra su nombre y cliente; el turno se pone solo con
  la hora
- **Hallazgos con causa obligatoria**, paro de máquina y observaciones
- **Acciones correctivas** que el supervisor atiende y cierra: las de la
  inspección, y las de merma, donde se registra por defecto el material
  recuperado y la acción para que no vuelva a ocurrir
- **Comportamiento** de cada defecto mes a mes en todo el histórico
- **Merma**: registro de rechazos con folio automático (año-consecutivo), orden de producción, etiqueta, máquina de
  inspección y máquina que genera, y uno o
  varios defectos con su número de etiquetas rechazadas (los metros
  lineales se calculan con las medidas de la galería) y bobinas; los nombres de supervisor, operador
  e inspector salen del padrón de RRHH. Mientras se estandariza el formulario,
  carga de Excel con las mismas columnas. Tabla y exportación a Excel por mes;
  el administrador puede editar un rechazo o borrarlo con motivo, y
  queda el rastro. Es la fuente del foco
- **Editor de la matriz** defecto ↔ variable para la junta de calidad
- **Galería de etiquetas**: tabla con los datos técnicos de cada etiqueta
  (tintas, engrane, medidas, sustratos), con búsqueda, carga desde Excel,
  alta, edición y borrado; y el **catálogo de defectos** numerado, editable
- Se instala como aplicación desde el navegador; no requiere tienda

---

## Acceso

Cada persona entra con **su número de nómina y su clave personal** de la suite.
No existen contraseñas compartidas.

Para que alguien pueda entrar se necesitan tres cosas en el proyecto
`impredimex-suite`:

1. Estar en la colección `colaboradores` con `estatus: "ACTIVO"`
2. Tener `calidad` en su lista `apps`, y su papel en `roles.calidad`
   (`INSPECTOR`, `SUPERVISOR` o `ADMIN`, en mayúsculas). Sin papel entra como
   `INSPECTOR`
3. Tener cuenta en Firebase Authentication con el identificador
   `<nómina>@impredimex.local`

Los permisos se asignan desde la app de RRHH. Ver [`HANDOVER.md`](./HANDOVER.md).

---

## Arquitectura

```
              index.html (GitHub Pages)
              HTML + CSS + JavaScript, un solo archivo
                           │
            ┌──────────────┴──────────────┐
            ▼                             ▼
     impredimex-suite              impredimex-procesos
     Auth + personal               Realtime Database, nodo cal/
     (Firestore)                   (datos de esta app, sesión anónima)
```

| Capa | Tecnología |
|---|---|
| Interfaz | HTML5, CSS3 y JavaScript sin frameworks ni compilación |
| Datos | Firebase Realtime Database, proyecto `impredimex-procesos` |
| Identidad | Firebase Authentication del proyecto `impredimex-suite` |
| Hospedaje | GitHub Pages |
| Excel | xlsx-js-style 1.2.0 (SheetJS 0.18.5 que además escribe estilos): lee la merma y la galería, y exporta los rechazos |

---

## Estructura del repositorio

```
control-proceso-impredimex/
├── index.html              Aplicación completa, con la semilla de merma incrustada
├── sw.js                   Service worker: instalable y apertura rápida
├── manifest.json           Datos para instalarla como aplicación
├── icon-192.png, icon-512.png, apple-touch-icon.png
├── database.rules.json     Reglas de la Realtime Database (copia de lo publicado)
├── README.md               Este archivo
├── HANDOVER.md             Guía técnica para quien mantenga la aplicación
├── SPECS.md                Especificaciones funcionales y su estado
└── CHANGELOG.md            Historial de versiones
```

---

## Cómo se trabaja

No hay proceso de compilación: el `index.html` se publica tal cual.

1. Actualizar primero la especificación en `SPECS.md`
2. Hacer el cambio en `index.html`, referenciando la spec en un comentario
   (`// SPEC-XXX: …`)
3. Registrar el cambio en `CHANGELOG.md` (formato Keep a Changelog, versionado
   semántico) y subir la versión aquí, en `HANDOVER.md` y en `CACHE` de `sw.js`
4. Subir a la rama `main`. GitHub Pages publica en uno o dos minutos
5. Recargar sin caché (Ctrl+Shift+R) y probar el flujo afectado

Detalle completo, servicios externos y solución de problemas en
[`HANDOVER.md`](./HANDOVER.md).

---

## Limitaciones conocidas

- **Las reglas de la base aceptan cualquier sesión, incluida la anónima.**
  Quien abra la página puede leer y escribir los datos de Calidad sin pasar por
  la suite (SPEC-010). Los permisos por papel solo se aplican en la pantalla
- App Check no está configurado
- La app no envía avisos: el inspector avisa del paro al supervisor de viva voz
- Los 40 defectos y las 20 máquinas están escritos en el código
- No funciona sin conexión: registrar una inspección necesita alcanzar Firebase
- El repositorio es público, y con él la configuración de Firebase

Lo que falta de cada especificación está en [`SPECS.md`](./SPECS.md).

---

## Responsables

**Desarrollo original:** Victor Moreno
**Empresa:** Impresión y Diseño de México S.A. de C.V. (IMPREDIMEX)

## Licencia

Software privado de uso interno de IMPREDIMEX.
