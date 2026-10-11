# Esquema de datos

Todos los archivos se codifican en UTF-8. IDs estables en minúsculas y con guiones. Campos enumerados aquí obligatorios salvo donde se indique lo contrario; nullable significa que el campo debe existir con `null` si se desconoce. URLs y textos deben ser datos, nunca HTML ejecutable. Las fechas del viaje usan `YYYY-MM-DD` o `null`.

## `trip.json` · objeto

| Campo | Tipo | Significado |
| --- | --- | --- |
| name, transport, description | string | Identidad, transporte y presentación |
| durationDays, travelers | integer positivo | Duración prevista y adultos |
| camperDays, camperNights | integer o null | Días/noches de alquiler previstos en el plan; validar contra jornadas y pernoctas, no implican reserva |
| travelWindow | object | `{year:2027, month:6, status:"provisional"}`; no crear fechas exactas a partir del mes |
| arrivalPlaceId, departurePlaceId | string | Referencias a `places.id` |
| startDate | string fecha o null | Inicio del viaje |
| status | string | `provisional` o `confirmada` |
| heroImage, heroAlt, heroCaption | string | Ruta relativa, alternativa accesible y pie de foto |
| sourceIds | string[] | Referencias a `sources.id` |
| featuredPlaceIds | string[] | Referencias a lugares destacados |
| priorityPlaceIds | string[] | Destinos prioritarios definidos por el usuario |
| planningNote | string | Estado de planificación visible |

## `days.json` · array de jornadas

| Campo | Tipo | Significado |
| --- | --- | --- |
| id | string único | Ejemplo `dia-1`; utilizado en rutas internas |
| number | integer | Orden consecutivo de 1 a `durationDays` |
| title, subtitle | string | Nombre y descripción breve |
| description | string | Desarrollo del plan del día |
| date | string fecha o null | Fecha confirmada |
| status | string | `planificada`, `provisional`, `confirmada`, `descartada`; `confirmada` significa **plan acordado**, nunca reserva |
| originId, destinationId | string | Referencias a lugares |
| imagePlaceId | string, opcional | Lugar cuya fotografía representa la jornada; si falta, se utiliza el destino. No modifica los desplazamientos ni la pernocta |
| overnightId | string o null | Referencia a `logistics.accommodations.id`; `null` el día de regreso sin noche |
| distanceKm, drivingMinutes | number >= 0 o null | Métricas del trayecto; incluir 0 solo si se conoce |
| distanceKmRange, drivingMinutesRange | [number, number] o null | Intervalos `[mínimo,máximo]` estimados; no inventar un valor medio. En la nueva ruta están pendientes; no reutilizar los rangos de la antigua jornada Mull–Glencoe |
| metricsStatus | string | `pendiente`, `estimada` o `confirmada` |
| camper | boolean o null | Uso previsto de autocaravana ese día, no acreditación de alquiler reservado |
| stops | object[] | Paradas, en orden; vacío si no hay turismo |
| tips | string[] | Consejos específicos |
| travelLegs | object[] | Desplazamientos del día, documentados abajo; puede quedar vacío si no están detallados |
| sourceIds | string[] | Procedencia del plan y de las estimaciones |
| tourismFree | boolean | Día sin actividades turísticas |

Cada parada: `{ "placeId": "staffa", "priority": "imprescindible", "status": "provisional", "activity": "Excursión prioritaria; reserva pendiente." }`. `priority`: `imprescindible` u `opcional`. `status`: `acordada`, `propuesta` o `provisional`. Son ejes separados: una visita opcional no se convierte en obligatoria por estar en una jornada acordada. El orden de `stops` es de presentación; no necesariamente una secuencia definitiva de navegación, especialmente en el día 8 de la nueva ruta.

Cada desplazamiento: `{ "mode": "ferry", "originId": "oban", "destinationId": "craignure", "note": "Con autocaravana; horario pendiente", "serviceId": "ferry-oban-craignure" }`. `mode`: `public`, `road`, `ferry`, `boat`, `undecided`; extremos referencian `places.id`. `serviceId`: referencia a `logistics.services.id` o `null`. No implica horario, operador ni reserva. Las visitas opcionales no se añaden automáticamente como desvíos al enlace de Google Maps entre origen y destino.

No eliminar días para descartar propuestas: reemplazar su contenido por la opción aceptada manteniendo `trip.durationDays` jornadas (actualmente 12). El campo `descartada` se reserva para intercambio documental, no para ocultar filas automáticamente. El último día tiene `tourismFree: true`, `stops: []` y destino de regreso. El origen de cada día debe coincidir con el destino anterior. Las sumas permanecen `null` mientras falte cualquier dato; no hay totales parciales presentados como definitivos. El día 11 conserva `camper: true` porque es el día de devolución, aunque su pernocta sea convencional: 8 días con vehículo y 7 noches en él.

## `places.json` · array de lugares

| Campo | Tipo | Significado |
| --- | --- | --- |
| id, name, region | string | Identificador, nombre y localización |
| category | string | `naturaleza`, `historia`, `costa`, `islas`, `geologia`, `transporte` |
| parentId | string o null, opcional | Lugar que contiene al punto de interés; permite derivar sus jornadas desde visitas y desplazamientos. No formar ciclos |
| image, imageAlt, imageCaption | string no vacío | Fotografía local obligatoria, alt y pie. Si se reutiliza una fotografía de contexto o de ambiente del viaje, el pie identifica el lugar fotografiado y ese uso |
| coordinates | [number, number] | **[latitud, longitud]** en WGS84 |
| coordinateStatus | string | Actualmente `aproximadas`; no son accesos verificados |
| description | string | Resumen propio, con fuentes o explícitamente propuesto |
| history, geology | string o null | Contexto documentado; `null` si pendiente |
| miniGuide | object | Mini free tour completo, descrito abajo; obligatorio en todos los lugares |
| durationMinutes | number o null | Duración de visita, pendiente si no se conoce |
| durationMinutesRange | [number, number] o null, opcional | Referencia estimada para un paseo; Signal Rock `[25,60]`, según recorrido |
| recommendations | string[] | Consejos y propuestas |
| sourceIds | string[] | Referencias a fuentes |
| featured | boolean | Metadato editorial; portada se ordena con `trip.featuredPlaceIds` |

No duplicar el número de día en un lugar: las relaciones se derivan de las paradas, extremos del día, desplazamientos, pernoctas y `parentId`. Ejemplo mínimo de coordenadas: `"coordinates": [55.9533, -3.1883]`. Las posiciones iniciales y de los nuevos puntos son referencias geográficas orientativas, no accesos ni aparcamientos verificados; su carácter aproximado es visible en el mapa y en las fichas.

### `miniGuide` · objeto

- `intro` (string no vacío): qué es el lugar y su contexto.
- `story` (string no vacío): relato breve, como la explicación de un guía.
- `highlights` (array de al menos dos objetos `{title:string,text:string}`): qué ver y detalles en los que fijarse.
- `curiosities` (array no vacío de `{kind:"dato"|"leyenda",text:string}`): separar hechos documentados de tradiciones. El renderer identifica las leyendas expresamente.
- `sourceIds` (string[] no vacío): fuentes con URL, existentes en `sources.json` y también incluidas en `place.sourceIds`. Se muestran al pie de cada mini guía.
- `checkedAt` (fecha `YYYY-MM-DD`): consulta de las fuentes; no es una fecha de viaje ni confirma condiciones de visita.

Las 46 ubicaciones tienen guía, incluidas las de transporte, Blair Atholl, Cairngorms, Bruar, Falls of Bruar y Fairy Pools. El contenido se reutiliza desde el mismo objeto en la ficha del lugar y en los desplegables de sus paradas. No duplicarlo en `days.json`. La guía sustituye visualmente los antiguos bloques `history`/`geology` en la ficha; esos campos se conservan para compatibilidad. Las visitas opcionales mantienen su prioridad, y el día de regreso sigue sin turismo.

## `routes.geojson` · FeatureCollection

GeoJSON WGS84, con coordenadas **[longitud, latitud]** (orden inverso al usado en lugares). Cada `Feature` usa `geometry.type: "LineString"` y `geometry.coordinates` con al menos dos posiciones.

Propiedades:
- `dayId` (string): referencia a una jornada.
- `mode` (string): `public` (autobús/tren pendiente de elegir), `road`, `ferry`, `boat` o `undecided`.
- `originId`, `destinationId` (string): referencias a extremos en `places.json`.
- `serviceId` (string o null): servicio logístico asociado.
- `note` (string): contexto del tramo y sus pendientes.
- `geometryStatus` (string): `schematic` o `verified`.
- `source` (string): procedencia y limitaciones.
- `sourceUrl` (string, obligatorio para `verified`, opcional en otros casos): fuente del trazado.
- `verifiedAt` (fecha, obligatorio para `verified`, opcional en otros casos): verificación.

Ejemplo:

```json
{"type":"Feature","properties":{"dayId":"dia-2","mode":"road","geometryStatus":"schematic","source":"Conexión orientativa, no carretera"},"geometry":{"type":"LineString","coordinates":[[-3.1883,55.9533],[-4.2518,55.8642]]}}
```

El renderer usa líneas discontinuas para `schematic`. Solo usar `verified` tras verificar una geometría real y documentar procedencia. `road` describe la intención de transporte, no verifica la forma de la línea. No calcular kilómetros desde esquemas. Barcos, ferris y conexiones con transporte pendiente tienen colores diferenciados.

El GeoJSON refleja uno a uno los `travelLegs` con extremos conocidos. El plan vigente incluye Oban–Glencoe, Glencoe–Three Sisters–Eilean Donan, Skye por el puente (salida día 10) y Fort Augustus–Glasgow (día 11). La jornada 8 incluye Fairy Pools y Eighteen Twenty; la 9 organiza Storr solo mirador, Kilt Rock opcional y Quiraing Walk. Sus 30 conexiones son esquemáticas y discontinuas; no verifican carreteras, senderos ni aparcamientos.

Los colores de los marcadores se derivan de las relaciones existentes, sin campos adicionales: verde para visitas (`stops`, incluidos descendientes mediante `parentId`), morado para pernoctas (`overnightId` → alojamiento → `placeId`), ambos colores si concurren y gris para otros puntos. El filtro de jornada limita esas relaciones al día seleccionado. El mapa general y su lista incluyen solo lugares relacionados con alguna jornada mediante `dayTouchesPlace`; las fichas de lugares fuera del recorrido siguen accesibles y conservan sus IDs. Los candidatos no se consideran pernoctas elegidas. Los popups conservan separados los estados de elección y reserva.

## `logistics.json` · objeto

Fuente central de servicios, alojamientos y requisitos del vehículo. Carga mediante `js/data.js`; no duplicar sus nombres o sus estados de reserva en las jornadas.

### `vehicle` · objeto
- `pickupDayId`, `returnDayId`: referencias a jornadas.
- `pickupPlaceId`, `returnPlaceId`: referencias a lugares.
- `travelSeats`, `sleepingPlaces`: enteros, requisitos del grupo.
- `requirements`: string[] de prestaciones solicitadas; no acreditan un modelo contratado.
- `bookingStatus`: `pendiente` o `confirmada`.
- `provider`, `model`, `pickupTime`, `returnTime`: string o null.
- `price`: number o null; no rellenar desde una referencia de presupuesto.
- `budgetReference`: `{min:number,max:number,currency:string,referenceDays:integer,status:string,note:string}`. Actualmente 600–800 EUR para unos 10 días, `sin-confirmar`. No representa el alquiler previsto de 8 días, no se prorratea y no se suma al presupuesto GBP.

### `accommodations` · array
Cada alojamiento tiene `id` (string único), `name` (string o null), `placeId` (referencia), `type` (`convencional`, `camping`), `selectionStatus` (`elegida`, `candidata`, `pendiente`), `reservationStatus` (`pendiente`, `confirmada`), `availability` (boolean o null), `note` (string), `url` (HTTPS o null), `candidateIds` (string[] de otros alojamientos), `sourceIds` (string[]) y `bookingPolicy` (objeto o null).

Los campings por elegir usan `name: null` y referencian la zona. Red Squirrel está en `candidateIds` de Glencoe y Blair Castle Caravan Park en los de Blair Atholl, con `selectionStatus: "candidata"`; nunca se usan como pernoctas elegidas. Glencoe no tiene noche asignada tras la decisión de dormir en Oban después de Staffa; su referencia se conserva para mantener IDs estables. Oban se referencia las noches 4 y 6, sin garantizar un mismo establecimiento. Fidden tiene `selectionStatus: "elegida"`, `reservationStatus: "pendiente"`, `availability: null`, para una noche (día 5). Su `bookingPolicy`: `{status:"sin-reservas-previas",checkedAt:"2026-10-10",sourceId:"fidden-official"}` refleja una consulta actual, que debe revalidarse para 2027. Las noches se derivan de `days[].overnightId`; una pernocta acordada en una localidad no confirma camping ni reserva.

### `services` · array
Cada servicio tiene `id`, `name`, `selectionStatus` (`acordada`, `provisional`), `reservationStatus` (`pendiente`, `confirmada`), `provider` (string o null), `price` (number o null), `time` (string o null), `note` (string) y `sourceIds` (string[]). El operador desconocido permanece `null`, aunque se conozcan los puertos. Cada ferry se distingue de la excursión a Staffa y de los vuelos. Un servicio acordado no implica una compra.

## `practical.json` · objeto

- `sections` (array): cada objeto contiene `id`, `icon` (nombre Bootstrap Icons), `title`, `label`, `status` (`pendiente`, `orientativo`, `planificada`, `confirmada`), `text` (strings), `items` (string[]) y `sourceIds` (string[]). `confirmada` se muestra como plan acordado y no como reserva.
- `budget` (objeto): `currency` (código ISO 4217, `GBP`), `status` (string), `categories` (array de `{id:string, label:string, amount:number|null}`). Importes del grupo completo, no por persona. `null` no equivale a cero. La calculadora muestra subtotal si hay conceptos vacíos.
- `checklist` (array): `{id:string,label:string}`. Preferencias personales, no estado de reservas.

## `sources.json` · array de fuentes

Cada objeto contiene `id`, `title`, `type`, `note` (strings) y `url` (string HTTPS o null). `type`: `usuario`, `propuesta`, `oficial`, `divulgacion`, `fotografia`. `divulgacion` identifica los portales locales de viajes utilizados para contexto, sin atribuirles autoridad institucional. Las fechas de consulta de las mini guías están en `miniGuide.checkedAt` y en las notas de sus fuentes nuevas. Los contenidos editoriales y las coordenadas aproximadas no deben presentarse como información verificada. Fechas de consulta y licencias en `SOURCES.md`.

## Estado local del navegador

Claves con prefijo `escocia:`: `favorites` (string[] de IDs de lugares), `budget` (objeto de ID de concepto a string numérico o vacío), `checklist` (string[]). Los IDs originales de lugares y conceptos se preservan para no perder preferencias. La lista de pendientes 2027 utiliza nuevos IDs para no marcar tareas nuevas como terminadas por una lista antigua. No se envían a servidores ni se sincronizan con los JSON. Si localStorage falla, hay alternativa en memoria de la sesión. Para revisar el esquema y las relaciones: `python scripts/validate.py`.

## Timeline

Campo `timeline` por jornada: `status: propuesta`, `note`, `sourceIds` y `items` ordenados. Cada bloque contiene `label`, `period`, `note`, `placeIds` (IDs sin duplicar lugares), `legIndex` (índice de `travelLegs` o `null`) y `start`/`end` (`HH:mm` en hora local o `null`). Las franjas numéricas son propuestas de organización; no son duraciones verificadas. Los bloques sin hora conservan una etiqueta de secuencia. No se calculan llegadas cuando faltan duraciones. Día 12 solo traslado y vuelo. El servicio de ferry a Skye se conserva descartado, con `reservationStatus: no-necesaria`, y no puede ser referenciado por desplazamientos activos.
