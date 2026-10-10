# Escocia, sin prisa

Guía interactiva en español para **Escocia 2027: 12 días y 3 adultos, con llegada y salida por Glasgow**. Junio de 2027 provisional. Ciudades en transporte público y autocaravana del día 4 al 11: 8 días y 7 noches. Diseño responsive, itinerario, mini free tours de las 41 ubicaciones, mapas, favoritos, calculadora de presupuesto y lista de preparativos.

HTML5, CSS3, JavaScript ES6 con módulos nativos, Bootstrap 5.3.3, Bootstrap Icons 1.11.3 y Leaflet 1.9.4. Sin backend, Node, compilación ni instalación de dependencias. Las bibliotecas y fotografías están incluidas en `assets/`.

## Probar en local

### Con F5 en VS Code

Abrir la **carpeta del proyecto** en VS Code y pulsar **F5**. Si aparece un selector, elegir **Escocia · Abrir la web**. Se inicia el servidor local y se abre Microsoft Edge automáticamente. No hace falta instalar extensiones de Python ni Live Server.

Guardar los cambios y recargar la página para verlos. **Shift+F5** detiene la depuración; el servidor permanece en la terminal **Escocia: servidor local** para reutilizarlo. Para apagarlo, pulsar **Ctrl+C** en esa terminal o usar **Terminal → Terminar tarea**.

La tarea de Windows utiliza la instalación de Python detectada en este equipo (`%LOCALAPPDATA%\Python\pythoncore-3.14-64\python.exe`), evitando el alias de Microsoft Store. En otro equipo, ajustar `windows.command` en `.vscode/tasks.json` a su ejecutable de Python. Si el puerto 8000 ya está ocupado por un servidor iniciado manualmente, detenerlo antes de usar F5.

### Desde una terminal

Con Python 3 instalado, desde la raíz del repositorio:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Abrir **http://127.0.0.1:8000/**. En Windows también puede utilizarse `py -m http.server 8000 --bind 127.0.0.1`. Detener con Ctrl+C. No abrir `index.html` con `file://`: los módulos y `fetch()` necesitan HTTP.

Los mapas de fondo de OpenStreetMap y los enlaces externos necesitan Internet. No hay servicio offline ni sincronización entre dispositivos. Si no carga el mapa, las fichas y los enlaces a Google Maps siguen disponibles.

## Publicar en GitHub Pages

1. Subir estos archivos a la rama `main`, manteniendo `index.html` en la raíz.
2. En GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**.
3. Seleccionar **main** y **/ (root)** y guardar.
4. Abrir la URL indicada por GitHub cuando termine la publicación.

No se necesita un workflow personalizado ni un paso de compilación. `.nojekyll` indica que se sirve el contenido estático directamente. Las rutas de recursos son relativas y la navegación utiliza fragmentos (`#dia/dia-1`), por lo que funciona bajo `/viajes/` y al recargar vistas de detalle.

## Editar el viaje

En **Lugares**, abrir una ficha para leer qué es, su historia, qué ver y curiosidades. En cada jornada, desplegar **Mini guía · Qué ver y curiosidades** dentro de una parada. Las fuentes están enlazadas al pie de la guía y las leyendas se identifican expresamente. Para editar el contenido, usar `miniGuide` en `data/places.json`; se reutiliza en ambas vistas.

- `data/trip.json`: contexto y portada.
- `data/days.json`: las 12 jornadas, orden, paradas, fechas, métricas, desplazamientos y referencias a pernoctas.
- `data/places.json`: lugares, coordenadas, contenidos y fotografías.
- `data/routes.geojson`: geometrías y estado de verificación.
- `data/practical.json`: consejos, conceptos del presupuesto y preparativos.
- `data/logistics.json`: alojamientos elegidos/candidatos, servicios, estados de reserva y requisitos del vehículo.
- `data/sources.json`: fuentes y créditos visibles en la web.

Los valores desconocidos se conservan como `null`. Nunca se suman métricas incompletas como si fueran totales. El plan vigente procede de la actualización del usuario: días 1–3 planificados, 4–7 acordados y 8–11 provisionales. Día 12 sin turismo; devolución del vehículo día 11. No hay reservas confirmadas. Fidden está elegido para noches 5 y 6; su web indica actualmente que no acepta reservas, por lo que hay que revalidar condiciones y disponibilidad para 2027. Red Squirrel solo es candidato.

El día 7 tiene estimaciones iniciales de 115–130 km y 2,5–3 h de conducción, excluyendo ferry, esperas y paradas. La referencia de alquiler de 600–800 EUR corresponde a unos 10 días y sigue sin confirmar; se muestra aparte, sin convertirla ni sumarla a la calculadora en GBP, ni extrapolarla al plan actual de 8 días.

Los trazados actuales son **conexiones esquemáticas**, siempre discontinuas y señalizadas. No son carreteras ni travesías verificadas. Transporte público, ferry/barco y autocaravana usan colores distintos. El tramo provisional entra a Skye por Mallaig–Armadale y sale por el puente. Las opciones no se fuerzan como desvíos obligatorios en Google Maps. Para sustituir una conexión por un recorrido real, aportar GeoJSON verificado y su procedencia según el esquema.

Los favoritos, estimaciones y preparativos se guardan en `localStorage` del navegador. No cambian los archivos JSON ni confirman reservas. Si el navegador impide guardar, se conservan durante la sesión y se informa al usuario.

## Organización

```text
index.html             Estructura semántica y navegación
css/styles.css         Diseño y adaptaciones responsive
js/app.js              Inicialización y composición de vistas
js/router.js           Rutas y estado de navegación
js/data.js             Carga y validación centralizadas
js/components.js       Tarjetas y componentes reutilizables
js/mini-guide.js       Mini free tours compartidos por fichas y jornadas
css/guides.css         Presentación de las mini guías y desplegables
js/maps.js             Leaflet, marcadores y trazados
js/stats.js             Totales y cálculos
js/trip.js              Relaciones, etiquetas del plan y pernoctas
js/storage.js          Preferencias locales con alternativa en memoria
js/utils.js            Formatos, enlaces y escape de HTML
js/views/              Inicio, itinerario, lugares, mapas e información
data/                  JSON y GeoJSON editables
assets/                Bibliotecas, licencias, icono y fotografías
docs/                  Contexto, decisiones, esquema, fuentes e historial
scripts/validate.py    Comprobación de integridad (Python estándar)
```

## Validar

```sh
python scripts/validate.py
python scripts/http_check.py
```

Comprueba JSON, IDs, referencias, continuidad de jornadas, geometrías, fuentes, las 41 mini guías completas, regreso sin turismo, módulos e imágenes. Para revisar la interfaz: probar anchos de 320, 390, 768 y 1440 px; abrir las cinco secciones, cada jornada y lugar; desplegar las mini guías, usar teclado, filtros, favoritos, presupuesto y lista; comprobar consola y mapas con Internet.

`http_check.py` abre un servidor temporal, comprueba las respuestas de todos los recursos y los tipos MIME de JavaScript, y lo cierra. Hay un script opcional `scripts/browser_qa.py` para ejecutar comprobaciones en Edge sin ventana en Windows, con un perfil aislado dentro de `.qa/`; no utiliza ni modifica el perfil personal del navegador. **La comprobación en navegador no se ejecutó en esta entrega porque no se autorizó iniciar Edge.**

`scripts/fetch_assets.py` permite volver a descargar las versiones fijas de los recursos públicos; solo es una utilidad de mantenimiento con acceso a Internet. No se ejecuta para publicar o utilizar la web.

`scripts/fetch_place_photos.py` descarga las fotografías adicionales de Glencoe y Eilean Donan y actualiza sus créditos. Todas las fichas tienen fotografía local. Las nuevas fotos del usuario están asignadas a sus destinos; los puntos sin toma específica usan una foto de contexto o de ambiente del viaje, identificada en el pie. Si falla una imagen, se intenta otra fotografía local. `staffa.jpg` es un AVIF y se sirve como `staffa.avif`, conservando el original. Al añadir lugares, rellenar `image`, `imageAlt` e `imageCaption`; la validación comprueba que existan y que el formato coincida con la extensión.

Antes de modificar el proyecto, consultar [AGENTS.md](AGENTS.md) y [el esquema de datos](docs/DATA_SCHEMA.md). Las decisiones que lleguen desde ChatGPT se aplican solo cuando estén confirmadas; no existe sincronización automática.
