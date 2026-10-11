# Contexto consolidado · Escocia 2027

Fuente vigente: archivos actualizados del usuario y última decisión de recuperar Glencoe y regresar directamente de Fort Augustus a Glasgow. Se conservan las correcciones del mapa y del arranque local.

## Objetivo y datos acordados
- 12 días para 3 adultos. Junio de 2027 como ventana inicial; fechas y vuelos pendientes.
- Llegada y salida por el aeropuerto de Glasgow. Traslados urbanos en autobús o tren.
- Autocaravana del día 4 al 11: 8 días de alquiler y 7 noches previstas. Recogida y devolución en Glasgow.
- Requisitos: 3 plazas homologadas para viajar y dormir, baño, ducha, cocina y frigorífico.
- Alojamiento convencional las primeras 3 noches y la última: 4 noches previstas.
- Naturaleza, paisajes, geología y ciudades, con tranquilidad. Evitar jornadas de conducción de 6–7 horas. Preferir miradores y senderos sencillos o moderados.
- No añadir visitas para llenar jornadas. Combinar campings y áreas autorizadas cuando sea conveniente y estén comprobadas.
- Día 12 únicamente para traslado al aeropuerto y regreso, sin turismo.

## Itinerario vigente

| Día | Plan | Noche | Estado del plan |
| --- | --- | --- | --- |
| 1 | Llegada a Glasgow, traslado y descanso; sin visitas obligatorias | Glasgow, alojamiento convencional | Planificado |
| 2 | Glasgow: catedral, Necrópolis, George Square y Buchanan Street como opciones; traslado por la tarde a Edimburgo | Edimburgo, alojamiento convencional | Planificado |
| 3 | Edimburgo: castillo, Royal Mile, Victoria Street, St Giles, Calton Hill y Dean Village; Arthur’s Seat como alternativa | Edimburgo, alojamiento convencional | Planificado; visitas propuestas |
| 4 | Transporte público Edimburgo–Glasgow temprano; recogida por la mañana, provisiones y salida a Oban. Loch Lomond y McCaig’s Tower opcionales | Oban, camping por elegir | Recorrido acordado |
| 5 | Ferry temprano Oban–Craignure con vehículo, Fionnphort–Iona como pasajeros y regreso a Mull; evitar Tobermory | Fidden Farm, única noche prevista | Provisional; camping elegido, plaza no garantizada |
| 6 | Staffa, ferry a Oban y carretera a Glencoe | Glencoe, camping por elegir | Noche acordada; conexiones pendientes |
| 7 | Three Sisters Viewpoint, Eilean Donan y Skye por el puente | Skye, camping por elegir | Mirador acordado; sin ferry a Skye |
| 8 | Fairy Pools, comida y cerveceo en Eighteen Twenty, Portree | Skye, camping por elegir | Horarios y transporte pendientes |
| 9 | Storr solo mirador, Kilt Rock opcional y Quiraing Walk | Skye, tercera noche | Franjas propuestas; circuito de referencia 3–4 h |
| 10 | Salida de Skye por el puente a Fort Augustus | Fort Augustus, camping por elegir | Plan provisional |
| 11 | Fort Augustus–Glasgow y devolución del vehículo | Glasgow, alojamiento convencional | Hora contractual y margen de carretera pendientes |
| 12 | Aeropuerto de Glasgow y vuelo de regreso; sin visitas | Sin pernocta tras el vuelo | Finalidad de regreso acordada |

Plan vigente: noche 6 en Glencoe tras Staffa y el ferry a Oban; día 7 Three Sisters Viewpoint (sin senderismo acordado), Eilean Donan y Skye por el puente, sin ferry. Día 8 Fairy Pools con paseo; día 9 Storr solo mirador y Kilt Rock opcional; Glenfinnan fuera del itinerario; Quiraing Walk recuperado el día 9. Skye noches 7, 8 y 9: día 8 Fairy Pools y cerveceo en Eighteen Twenty, Portree; día 9 Storr solo mirador, Kilt Rock opcional y Quiraing Walk. Día 10 salida por el puente hacia Fort Augustus y noche allí. Día 11 Fort Augustus–Glasgow y devolución de la autocaravana, con horario contractual y margen de carretera pendientes; última noche convencional. Sin pernocta en Blair Atholl ni camping en Glasgow. Día 12 sin turismo. Se mantienen 12 días, 8 días y 7 noches en autocaravana; no hay reservas confirmadas.

## Estimaciones y reservas
- Las estimaciones antiguas de Mull–Glencoe no se trasladan a las nuevas jornadas; distancias y tiempos de conducción quedan pendientes. El sendero de Signal Rock conserva su referencia documental de **25–60 minutos**, pero no está incluido como parada en la nueva distribución.
- Falls of Bruar queda fuera del itinerario; su ficha conserva el rango histórico del paseo.
- Referencia de alquiler: **600–800 EUR para unos 10 días**, sin confirmar. No es el precio del plan actual de 8 días y no se prorratea ni convierte automáticamente a GBP.
- No hay reservas confirmadas: faltan fechas/vuelos, empresa/modelo/precio/horarios del vehículo, ferris, excursión a Staffa y alojamientos.
- Fidden está elegido para una sola noche, la noche 5, según el ajuste del usuario; no hay plaza garantizada. Su web oficial consultada indica que actualmente no acepta reservas. Comprobar política y disponibilidad para 2027.
- Oban noche 4 y Glencoe noche 6; campings pendientes, Red Squirrel solo candidato.
- Blair Atholl y su camping candidato quedan fuera del itinerario; noche 10 en Fort Augustus, por elegir.
- Staffa depende del mar y la meteorología; comprobar cancelación y condiciones de desembarco. Los frailecillos son una posibilidad estacional, no garantizada.

## Datos, mapas y mantenimiento
`days.json` contiene jornadas, paradas y desplazamientos; `logistics.json`, alojamientos y servicios referenciados. Las relaciones permiten derivar noches y estadísticas sin duplicar nombres de alojamientos. `places.json` añade lugares urbanos, geológicos, puertos y puntos de enlace. Las coordenadas son orientativas, no accesos ni aparcamientos comprobados.

`routes.geojson` mantiene 30 conexiones esquemáticas discontinuas. Los lugares descartados conservan IDs y fichas, pero no se muestran en el mapa del plan si no tienen relación con una jornada.

La sincronización con ChatGPT es manual. Aplicar solo decisiones explícitas; registrar el motivo cuando sustituyan acuerdos anteriores. Actualizar JSON, documentos afectados y changelog. Nunca interpretar el estado local de favoritos, presupuesto o tareas como una confirmación de reserva.

La timeline de cada jornada es propuesta y no acredita horarios de transporte, aperturas ni tiempos de carretera. Las horas desconocidas son `null`.
