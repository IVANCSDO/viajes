# Escocia, sin prisa

Guía interactiva en español para **Escocia 2027: 12 días y 3 adultos, con llegada y salida por Glasgow**. Junio de 2027 provisional. Ciudades en transporte público y autocaravana del día 4 al 11: 8 días y 7 noches. Diseño responsive, itinerario, mini free tours de las 46 ubicaciones, mapas, favoritos, calculadora de presupuesto y lista de preparativos.

HTML5, CSS3, JavaScript ES6 con módulos nativos, Bootstrap 5.3.3, Bootstrap Icons 1.11.3 y Leaflet 1.9.4. Sin backend, Node, compilación ni instalación de dependencias. Las bibliotecas y fotografías están incluidas en `assets/`.

## Probar en local

### Con F5 en VS Code

Abrir la **carpeta del proyecto** en VS Code y pulsar **F5**. Si aparece un selector, elegir **Escocia · Abrir la web**. Se inicia el servidor local y se abre Microsoft Edge automáticamente. No hace falta instalar extensiones de Python ni Live Server.

Se conserva **Attach to Chrome** como opción adicional para conectar con un Chrome que ya esté iniciado en modo de depuración en el puerto 9222; esa opción no arranca el navegador ni el servidor.

Guardar los cambios y recargar la página para verlos. **Shift+F5** detiene la depuración; el servidor permanece en la terminal **Escocia: servidor local** para reutilizarlo. Para apagarlo, pulsar **Ctrl+C** en esa terminal o usar **Terminal → Terminar tarea**.

La tarea de Windows utiliza `py -3`, el lanzador de Python, evitando el alias de Microsoft Store y las rutas ligadas a una versión concreta. En otros sistemas utiliza `python3`. `scripts/serve.py` sirve siempre la raíz del proyecto y avisa a VS Code cuando el puerto 8000 está listo. La terminal de la tarea queda visible para mostrar errores. Si el puerto 8000 ya está ocupado, detener el servidor anterior antes de usar F5. Si falla `py -3 --version`, instalar Python 3 con su lanzador o ajustar `windows.command` y `windows.args` en `.vscode/tasks.json` al ejecutable disponible.

Si F5 no inicia la depuración, abrir **Ejecutar y depurar** (Ctrl+Shift+D), seleccionar **Escocia · Abrir la web** y pulsar el botón de inicio. Si indica que no reconoce `msedge`, comprobar que esté habilitado el depurador JavaScript integrado de VS Code. [Documentación del depurador de navegador](https://code.visualstudio.com/docs/nodejs/browser-debugging).

Para el error **Unable to launch browser**, la configuración de Windows indica explícitamente `%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe`, comprobado en este equipo, y usa un perfil separado en `.qa/edge-debug-profile` (ignorado por Git). Si Edge está instalado en otra ruta, ajustar `windows.runtimeExecutable` en `.vscode/launch.json`. El perfil personal del navegador no se usa para depurar.

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

Los desconocidos se conservan como `null`. Plan vigente: noche 6 en Glencoe tras Staffa y el ferry a Oban; día 7 Three Sisters Viewpoint (sin senderismo acordado), Eilean Donan y Skye por el puente, sin ferry. Día 8 Fairy Pools con paseo; día 9 Storr solo mirador y Kilt Rock opcional; Glenfinnan fuera del itinerario; Quiraing Walk recuperado el día 9. Skye noches 7, 8 y 9: día 8 Fairy Pools y cerveceo en Eighteen Twenty, Portree; día 9 Storr solo mirador, Kilt Rock opcional y Quiraing Walk. Día 10 salida por el puente hacia Fort Augustus y noche allí. Día 11 Fort Augustus–Glasgow y devolución de la autocaravana, con horario contractual y margen de carretera pendientes; última noche convencional. Sin pernocta en Blair Atholl ni camping en Glasgow. Día 12 sin turismo. Se mantienen 12 días, 8 días y 7 noches en autocaravana; no hay reservas confirmadas. Estados de las jornadas y reservas se mantienen separados.

Las distancias y tiempos de conducción de la nueva ruta quedan pendientes; no se trasladan las estimaciones de la antigua jornada Mull–Glencoe a otra etapa. La referencia de alquiler de 600–800 EUR corresponde a unos 10 días y sigue sin confirmar; se muestra aparte, sin convertirla ni sumarla a la calculadora en GBP, ni extrapolarla al plan actual de 8 días.

Los 30 trazados actuales son **conexiones esquemáticas**, discontinuas, sin carreteras ni travesías verificadas. Se añade Oban–Glencoe y la parada de Three Sisters antes de Eilean Donan; Skye se recorre y abandona por el puente. El día 10 enlaza Skye–Fort Augustus y el día 11 Fort Augustus–Glasgow; el día 9 organiza Storr solo mirador y Kilt Rock opcional. Los accesos de visitas y campings siguen pendientes.

Los marcadores verdes indican visitas; los morados con luna, pernoctas previstas; los de ambos colores, visita y pernocta; los grises, puntos de paso o transporte. La clasificación se deriva de las paradas y las pernoctas del plan y cambia con el filtro de jornada. El mapa general y su lista muestran los lugares relacionados con el plan vigente; las fichas de los lugares descartados se conservan sin presentarlos como puntos del recorrido. Las visitas opcionales tienen borde discontinuo. Los popups muestran las noches y separan alojamiento elegido/por elegir de reserva confirmada/pendiente; cuando no hay camping u hotel concreto, la posición representa la zona prevista, no un alojamiento confirmado.

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

Comprueba JSON, IDs, referencias, continuidad de jornadas, geometrías, fuentes, las 47 mini guías completas, regreso sin turismo, módulos e imágenes. Para revisar la interfaz: probar anchos de 320, 390, 768 y 1440 px; abrir las cinco secciones, cada jornada y lugar; desplegar las mini guías, usar teclado, filtros, favoritos, presupuesto y lista; comprobar consola y mapas con Internet.

`http_check.py` abre un servidor temporal, comprueba las respuestas de todos los recursos y los tipos MIME de JavaScript, y lo cierra. Hay un script opcional `scripts/browser_qa.py` para ejecutar comprobaciones en Edge sin ventana en Windows, con un perfil aislado dentro de `.qa/`; no utiliza ni modifica el perfil personal del navegador. La revisión anterior del 11 de octubre de 2026, con 41 lugares, superó navegación, 32 layouts a 320/390/768/1440 px, marcadores, popups, conexiones de Skye y salida de pantalla completa con Escape, sin errores JavaScript ni recursos locales ausentes. Las pruebas se han adaptado al plan vigente de 47 lugares y a los marcadores de lugares incluidos en el recorrido, pero su revisión visual queda pendiente porque no se autorizó iniciar Edge. La pulsación de F5 desde la interfaz de VS Code requiere comprobación del usuario.

`scripts/fetch_assets.py` permite volver a descargar las versiones fijas de los recursos públicos; solo es una utilidad de mantenimiento con acceso a Internet. No se ejecuta para publicar o utilizar la web.

`scripts/fetch_place_photos.py` descarga las fotografías adicionales de Glencoe y Eilean Donan y actualiza sus créditos. Todas las fichas tienen fotografía local. Las nuevas fotos del usuario están asignadas a sus destinos; los puntos sin toma específica usan una foto de contexto o de ambiente del viaje, identificada en el pie. Si falla una imagen, se intenta otra fotografía local. `staffa.jpg` es un AVIF y se sirve como `staffa.avif`, conservando el original. Al añadir lugares, rellenar `image`, `imageAlt` e `imageCaption`; la validación comprueba que existan y que el formato coincida con la extensión.

Antes de modificar el proyecto, consultar [AGENTS.md](AGENTS.md) y [el esquema de datos](docs/DATA_SCHEMA.md). Las decisiones que lleguen desde ChatGPT se aplican solo cuando estén confirmadas; no existe sincronización automática.

## Timeline por jornada

Cada ficha de día incluye una primera timeline en hora local de Escocia. `timeline` se guarda en `data/days.json`: las franjas numéricas son propuestas de organización, con referencia inicial 09:00 en días flexibles. Vuelos, ferris, tiempos de carretera y devolución no se dan por confirmados; sus horas siguen pendientes. La timeline no calcula llegadas ni suma tiempos desconocidos.
