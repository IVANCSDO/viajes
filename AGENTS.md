# Guía de Escocia

Web estática en español para Escocia 2027: 12 días, 3 adultos, vuelos por Glasgow y autocaravana del día 4 al 11. Junio de 2027 es provisional. Consultar este archivo antes de modificar el proyecto.

## Arquitectura y reglas
- HTML semántico, Bootstrap 5, CSS propio, JavaScript ES6 con módulos nativos, Leaflet y OpenStreetMap. Sin Node, frameworks, compilación ni backend.
- `data/`: fuente única del viaje; `logistics.json` centraliza alojamientos, servicios y requisitos del vehículo. `js/data.js`: lectura y validación centralizada. `js/components.js`: componentes compartidos. `js/trip.js`: relaciones y etiquetas del plan. `js/views/`: vistas. `js/router.js`: navegación. `js/maps.js`: mapas. `js/stats.js`: cálculos. `css/`: estilos.
- Rutas relativas para GitHub Pages. Servir mediante HTTP, nunca `file://`.
- Código con nombres claros, escape de texto interpolado, controles con etiquetas y navegación por teclado. No introducir dependencias innecesarias.
- Editar jornadas en `data/days.json`. Mantener IDs estables y referencias válidas. No duplicar lugares en jornadas: referenciarlos por ID.
- Lo desconocido es `null`. Separar estado del plan, prioridad de visita, elección del alojamiento y reserva. `confirmada` en una jornada significa plan acordado, nunca reserva. Días 1–3 planificados, 4–7 acordados, 8–11 provisionales. No inventar precios, reservas, fechas, distancias ni carreteras. GeoJSON esquemático siempre identificado y discontinuo.
- Día 12 sin actividades turísticas. Devolución del vehículo prevista el día 11 y última noche en alojamiento convencional. No modificar estos criterios sin decisión explícita del usuario.
- Fidden elegido para noches 5 y 6, sin disponibilidad garantizada; su web indica actualmente que no acepta reservas. Red Squirrel solo candidato. Referencia de alquiler 600–800 EUR por unos 10 días sin confirmar; no prorratear a 8 días ni sumarla a importes GBP.
- Comprobar JSON y relaciones con `python scripts/validate.py`, revisar navegación y anchos móvil/escritorio tras cambios visuales.
- Actualizar los documentos afectados y `docs/CHANGELOG.md` con los cambios relevantes. No reescribir documentos sin necesidad.

## Referencias
- [Contexto del viaje](docs/PROJECT_CONTEXT.md)
- [Decisiones](docs/TRIP_DECISIONS.md)
- [Esquema de datos](docs/DATA_SCHEMA.md)
- [Historial](docs/CHANGELOG.md)
- [Fuentes y fotografías](docs/SOURCES.md)
- [Desarrollo y publicación](README.md)
