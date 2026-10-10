# Fuentes y recursos

La fuente de verdad vigente es la actualización del usuario «Viaje a Escocia 2027», incorporada el 10 de octubre de 2026: 12 días, Glasgow y distribución detallada. El documento inicial y la primera propuesta editorial se conservan como antecedentes sustituidos. Los textos de las fichas son resúmenes propios, no copias literales. Las coordenadas son referencias aproximadas, incluidas las de los nuevos puntos, y solo sirven para situar destinos; no verifican accesos ni aparcamientos.

Las fuentes y sus relaciones se mantienen en [`data/sources.json`](../data/sources.json), que también alimenta la página pública de créditos. Se consultaron UNESCO, National Trust for Scotland, VisitScotland y la web oficial de Eilean Donan para los contenidos específicos. Comprobar en esas webs apertura, accesos y condiciones antes del viaje. No se han incorporado precios ni horarios sin confirmar.

La actualización añade fuentes oficiales de Fidden Farm, Red Squirrel, el valle de Glencoe y British Geological Survey para Arthur’s Seat. Fidden indica actualmente que no acepta reservas: se documenta como política consultada, sin garantizar su vigencia en 2027 ni la disponibilidad. Red Squirrel sigue siendo solo candidato. No se trasladan tarifas actuales a precios del viaje.

Las estimaciones del día 7 (115–130 km y 2,5–3 h), el paseo de Signal Rock (25–60 min) y la referencia de alquiler (600–800 EUR para unos 10 días) proceden del documento del usuario; se identifican como provisionales, no como mediciones ni cotizaciones verificadas. No se convierten euros a libras ni se prorratea el alquiler a 8 días.

## Mini free tours

Las 41 ubicaciones incorporan resúmenes propios en español de qué son, qué ver, historia y curiosidades. Fuentes consultadas el **10 de octubre de 2026**, enlazadas en cada mini guía y registradas por ID en `places.json` y `sources.json`. La consulta histórica no confirma accesos, horarios, precios o servicios para junio de 2027.

Se utilizan principalmente los organismos y gestores del patrimonio: Historic Environment Scotland, National Trust for Scotland, British Geological Survey, UNESCO, Glasgow Life, Scottish Canals, los responsables de castillos, St Giles, museos y entidades locales de turismo. Los portales Isle of Mull e Isle of Skye se identifican como `divulgacion` para diferenciarlos de fuentes institucionales. Las explicaciones geológicas del Storr y Quiraing se apoyan en el British Geological Survey.

Las leyendas del gigante del Storr y de Signal Rock aparecen etiquetadas como leyendas, sin convertirlas en hechos. Se mantiene la incertidumbre sobre el origen del Libro de Kells y se aclara que la asociación de Victoria Street con el Callejón Diagon no está confirmada por la autora. La abadía de Iona, McCaig’s Tower, Calton Hill y Eilean Donan distinguen fundación, edificios conservados, proyectos inacabados y reconstrucciones.

El contenido se lee en las fichas de lugares y en desplegables de las paradas. No añade excursiones obligatorias, cambia reservas ni introduce turismo en el día 12. Aeropuerto y puertos reciben contexto histórico y de transporte.

## Fotografías

Las fotografías de Unsplash conservan su [licencia](https://unsplash.com/license) y sus créditos. El usuario ha añadido Glasgow, Oban, Iona, Staffa y un segundo paisaje de Skye (`highlands2.jpg`); no ha indicado autor o licencia de esos archivos y no se les atribuye la licencia Unsplash. Todas las fotografías son locales y sus créditos están en `sources.json`. Las 41 fichas y las 12 jornadas muestran fotografías, sin ilustraciones de sustitución. Cuando falta una toma específica, se reutiliza una imagen de contexto o de ambiente del viaje con un pie que identifica lo fotografiado; nunca se presenta como foto del punto concreto. La portada muestra el Quiraing.

`staffa.jpg` contiene datos AVIF: se conserva el archivo original y se sirve una copia `staffa.avif` con el tipo MIME correcto. Si una fotografía falla al cargar, la interfaz intenta otras dos fotos locales y actualiza su texto alternativo y pie. La validación exige ruta, alt y pie para cada lugar y comprueba el formato real de las fotos referenciadas.

## Dependencias

- Bootstrap 5.3.3, MIT: `assets/vendor/BOOTSTRAP-LICENSE.txt`.
- Bootstrap Icons 1.11.3, MIT: `assets/vendor/ICONS-LICENSE.txt`.
- Leaflet 1.9.4, BSD-2-Clause: `assets/vendor/LEAFLET-LICENSE.txt`.
- Cartografía: OpenStreetMap, atribución visible en cada mapa; teselas solicitadas directamente a `tile.openstreetmap.org`, sin precarga ni almacenamiento masivo.
- Tipografías de sistema, sin llamadas a servidores de fuentes.

No hay API de rutas ni backend. Los segmentos GeoJSON son conexiones esquemáticas de los desplazamientos conocidos, incluyendo transporte público y ferris; ninguna geometría se identifica como carretera real. Al añadir trazados verificados, registrar fuente, licencia y fecha.
