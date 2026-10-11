# Fuentes y recursos

La fuente de verdad vigente son los archivos reemplazados por el usuario el 11 de octubre de 2026, con una noche en Mull y más tiempo en Cairngorms, registrados como `ajuste-mull-cairngorms-2026-10-11`. Mantienen los 12 días y Glasgow de «Viaje a Escocia 2027» del 10 de octubre. El documento inicial y las distribuciones anteriores se conservan como antecedentes sustituidos. Los textos de las fichas son resúmenes propios, no copias literales. Las coordenadas son referencias aproximadas, incluidas las de los nuevos puntos, y solo sirven para situar destinos; no verifican accesos ni aparcamientos.

La decisión `decision-oban-three-sisters-2026-10-11` fijó Oban como pernocta de la noche 6 y Three Sisters como imprescindible. La última decisión `decision-skye-fairy-pools-2026-10-11` mantiene Oban pero descarta Three Sisters para dedicar más tiempo a Skye e incluir Fairy Pools. Procede del usuario, sin elegir un sendero ni aportar duración, horarios o reservas; no se deduce un recorrido peatonal de la coordenada del mirador.

Las fuentes y sus relaciones se mantienen en [`data/sources.json`](../data/sources.json), que también alimenta la página pública de créditos. Se consultaron UNESCO, National Trust for Scotland, VisitScotland y la web oficial de Eilean Donan para los contenidos específicos. Comprobar en esas webs apertura, accesos y condiciones antes del viaje. No se han incorporado precios ni horarios sin confirmar.

La actualización añade fuentes oficiales de Fidden Farm, Red Squirrel, el valle de Glencoe y British Geological Survey para Arthur’s Seat. Fidden indica actualmente que no acepta reservas: se documenta como política consultada, sin garantizar su vigencia en 2027 ni la disponibilidad. Red Squirrel sigue siendo solo candidato. No se trasladan tarifas actuales a precios del viaje.

Las estimaciones de la antigua jornada Mull–Glencoe (115–130 km y 2,5–3 h) no se aplican a los días nuevos. Los rangos de Signal Rock (25–60 min), Falls of Bruar (60–120 min en los archivos nuevos) y la referencia de alquiler (600–800 EUR para unos 10 días) proceden del usuario; son provisionales, no mediciones ni cotizaciones verificadas. No se convierten euros a libras ni se prorratea el alquiler a 8 días.

## Mini free tours

Las 46 ubicaciones incorporan resúmenes propios en español de qué son, qué ver, historia y curiosidades. Las guías iniciales conservan su consulta del **10 de octubre de 2026**; las cinco nuevas se documentaron el **11 de octubre de 2026**. Sus fuentes están enlazadas en cada mini guía y registradas por ID en `places.json` y `sources.json`. La consulta histórica no confirma accesos, horarios, precios o servicios para junio de 2027.

Para Blair Atholl y Cairngorms se consultaron las páginas de la [autoridad del parque sobre Blair Atholl](https://cairngorms.co.uk/towns-and-villages/blair-atholl) y [el parque nacional](https://cairngorms.co.uk/the-national-park/about). Bruar y las cascadas usan la [guía de Falls of Bruar de la asociación de turismo local](https://www.blairatholl.org.uk/attractions/nature-and-wildlife/falls-of-bruar/), identificada como divulgación local. No se añaden visitas obligatorias al castillo o al molino por aparecer en el contexto histórico.

Se utilizan principalmente los organismos y gestores del patrimonio: Historic Environment Scotland, National Trust for Scotland, British Geological Survey, UNESCO, Glasgow Life, Scottish Canals, los responsables de castillos, St Giles, museos y entidades locales de turismo. Los portales Isle of Mull e Isle of Skye se identifican como `divulgacion` para diferenciarlos de fuentes institucionales. Las explicaciones geológicas del Storr y Quiraing se apoyan en el British Geological Survey.

Las leyendas del gigante del Storr y de Signal Rock aparecen etiquetadas como leyendas, sin convertirlas en hechos. Se mantiene la incertidumbre sobre el origen del Libro de Kells y se aclara que la asociación de Victoria Street con el Callejón Diagon no está confirmada por la autora. La abadía de Iona, McCaig’s Tower, Calton Hill y Eilean Donan distinguen fundación, edificios conservados, proyectos inacabados y reconstrucciones.

El contenido se lee en las fichas de lugares y en desplegables de las paradas. No añade excursiones obligatorias, cambia reservas ni introduce turismo en el día 12. Aeropuerto y puertos reciben contexto histórico y de transporte.

Fairy Pools usa la página de [MacLeod Estate](https://www.dunvegancastle.com/fairy-pools/) para el paisaje y el paseo, y la de [Outdoor Access Trust for Scotland](https://www.outdooraccesstrustforscotland.org.uk/car-parking/) para el aparcamiento, consultadas el 11 de octubre de 2026. La [referencia GPS de Scotland Off the Beaten Track](https://sobt.co.uk/fairy-pools/) se redondea a `[57.25, -6.255]` y se identifica como aproximada. No se incorporan precios, duración del paseo, carretera ni acceso verificados para 2027.

## Fotografías

Las fotografías de Unsplash conservan su [licencia](https://unsplash.com/license) y sus créditos. El usuario ha añadido Glasgow, Oban, Iona, Staffa y un segundo paisaje de Skye (`highlands2.jpg`); no ha indicado autor o licencia de esos archivos y no se les atribuye la licencia Unsplash. Todas las fotografías son locales y sus créditos están en `sources.json`. Las 46 fichas y las 12 jornadas muestran fotografías, sin ilustraciones de sustitución. Cuando falta una toma específica, se reutiliza una imagen de contexto o de ambiente del viaje con un pie que identifica lo fotografiado; nunca se presenta como foto del punto concreto. Los lugares nuevos conservan fotografías de contexto o de ambiente, expresamente identificadas. Fairy Pools reutiliza una fotografía del Quiraing como contexto de Skye, sin presentarla como foto de las pozas. La portada muestra el Quiraing.

`staffa.jpg` contiene datos AVIF: se conserva el archivo original y se sirve una copia `staffa.avif` con el tipo MIME correcto. Si una fotografía falla al cargar, la interfaz intenta otras dos fotos locales y actualiza su texto alternativo y pie. La validación exige ruta, alt y pie para cada lugar y comprueba el formato real de las fotos referenciadas.

## Dependencias

- Bootstrap 5.3.3, MIT: `assets/vendor/BOOTSTRAP-LICENSE.txt`.
- Bootstrap Icons 1.11.3, MIT: `assets/vendor/ICONS-LICENSE.txt`.
- Leaflet 1.9.4, BSD-2-Clause: `assets/vendor/LEAFLET-LICENSE.txt`.
- Cartografía: OpenStreetMap, atribución visible en cada mapa; teselas solicitadas directamente a `tile.openstreetmap.org`, sin precarga ni almacenamiento masivo.
- Tipografías de sistema, sin llamadas a servidores de fuentes.

No hay API de rutas ni backend. Los segmentos GeoJSON son conexiones esquemáticas de los desplazamientos conocidos, incluyendo transporte público y ferris; ninguna geometría se identifica como carretera real. Al añadir trazados verificados, registrar fuente, licencia y fecha.

La decisión vigente `decision-glencoe-glasgow-2026-10-11` recupera Glencoe/Three Sisters y el regreso directo a Glasgow; sustituye las pernoctas anteriores de Oban noche 6 y Blair Atholl noche 10. Se mantiene la decisión de Skye por el puente. `timeline-propuesta-2026-10-11` identifica franjas creadas para organizar las jornadas, sin presentar horarios ni tiempos de carretera como datos comprobados.

La corrección vigente `decision-skye-extra-dia-2026-10-11` sitúa Fort Augustus–Glasgow el día 11 y permite una tercera noche en Skye. Sustituye la propuesta anterior de camping en Glasgow; horas de carretera y devolución pendientes.

`propuesta-skye-dos-jornadas-2026-10-11` distribuye las visitas existentes entre días 8 y 9. Las franjas agrupan traslados, acceso, visitas y margen, sin convertirlas en duraciones comprobadas.

Quiraing Walk: [Walkhighlands](https://www.walkhighlands.co.uk/skye/quiraing.shtml), referencia 3–4 h para el circuito, sin conducción. Eighteen Twenty: [FSA](https://ratings.food.gov.uk/business/1266388/an-talla-mor-1820-portree), Bank Street, Portree; [Geograph](https://www.geograph.org.uk/photo/6591361), contexto histórico y posición aproximada. Consultadas 2026-10-11; horarios 2027 pendientes. Imagen del bar reutilizada de Skye e identificada como contexto.
