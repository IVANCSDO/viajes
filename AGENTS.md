# Guía de Escocia

Web estática en español para Escocia 2027: 12 días, 3 adultos, vuelos por Glasgow y autocaravana del día 4 al 11. Junio de 2027 es provisional. Consultar este archivo antes de modificar el proyecto.

## Arquitectura y reglas
- HTML semántico, Bootstrap 5, CSS propio, JavaScript ES6 con módulos nativos, Leaflet y OpenStreetMap. Sin Node, frameworks, compilación ni backend.
- `data/`: fuente única del viaje; `logistics.json` centraliza alojamientos, servicios y requisitos del vehículo. `js/data.js`: lectura y validación centralizada. `js/components.js`: componentes compartidos. `js/trip.js`: relaciones y etiquetas del plan. `js/views/`: vistas. `js/router.js`: navegación. `js/maps.js`: mapas. `js/stats.js`: cálculos. `css/`: estilos.
- Rutas relativas para GitHub Pages. Servir mediante HTTP, nunca `file://`.
- Código con nombres claros, escape de texto interpolado, controles con etiquetas y navegación por teclado. No introducir dependencias innecesarias.
- Editar jornadas en `data/days.json`. Mantener IDs estables y referencias válidas. No duplicar lugares en jornadas: referenciarlos por ID.
- Lo desconocido es `null`. Separar estado del plan, prioridad de visita, elección del alojamiento y reserva. `confirmada` en una jornada significa plan acordado, nunca reserva. Nueva ruta aportada el 11 de octubre de 2026: días 1–3 planificados, día 4 acordado y días 5–11 provisionales. No inventar precios, reservas, fechas, distancias ni carreteras. GeoJSON esquemático siempre identificado y discontinuo.
- Día 12 sin actividades turísticas. Devolución del vehículo prevista el día 11 y última noche en alojamiento convencional. No modificar estos criterios sin decisión explícita del usuario.
- Fidden elegido para la noche 5, sin plaza garantizada; su web indica que no acepta reservas. Plan vigente: noche 6 en Glencoe tras Staffa y el ferry a Oban; día 7 Three Sisters Viewpoint (sin senderismo acordado), Eilean Donan y Skye por el puente, sin ferry. Día 8 Fairy Pools con paseo; día 9 Storr solo mirador y Kilt Rock opcional; Glenfinnan fuera del itinerario; Quiraing Walk recuperado el día 9. Skye noches 7, 8 y 9: día 8 Fairy Pools y cerveceo en Eighteen Twenty, Portree; día 9 Storr solo mirador, Kilt Rock opcional y Quiraing Walk. Día 10 salida por el puente hacia Fort Augustus y noche allí. Día 11 Fort Augustus–Glasgow y devolución de la autocaravana, con horario contractual y margen de carretera pendientes; última noche convencional. Sin pernocta en Blair Atholl ni camping en Glasgow. Día 12 sin turismo. Se mantienen 12 días, 8 días y 7 noches en autocaravana; no hay reservas confirmadas. Red Squirrel solo candidato. Referencia de alquiler 600–800 EUR para unos 10 días sin confirmar, sin prorratear ni sumar a GBP.
- Comprobar JSON y relaciones con `python scripts/validate.py`, revisar navegación y anchos móvil/escritorio tras cambios visuales.
- Actualizar los documentos afectados y `docs/CHANGELOG.md` con los cambios relevantes. No reescribir documentos sin necesidad.

## Referencias
- [Contexto del viaje](docs/PROJECT_CONTEXT.md)
- [Decisiones](docs/TRIP_DECISIONS.md)
- [Esquema de datos](docs/DATA_SCHEMA.md)
- [Historial](docs/CHANGELOG.md)
- [Fuentes y fotografías](docs/SOURCES.md)
- [Desarrollo y publicación](README.md)
