# Historial

## 2026-10-10 · Mini free tours de todas las ubicaciones

- Añadidas mini guías propias en español a los 41 lugares: qué son, relato histórico o geológico, detalles que ver y curiosidades. Incluyen ciudades, monumentos, islas, paisajes, campings y puntos de transporte.
- Contenido centralizado en `places.json`, reutilizado en la ficha de cada lugar y en 34 desplegables dentro de las paradas de las jornadas. Estilos adaptados a móvil y escritorio, con controles nativos accesibles por teclado.
- Fuentes consultadas y enlazadas al pie de cada guía; 84 referencias totales. Fuentes institucionales y portales de divulgación diferenciados. Leyendas señaladas como tales, con cautela sobre atribuciones no confirmadas.
- Conservados el itinerario, las reservas pendientes, las fotografías, los favoritos, el mapa ampliable y el regreso sin turismo.
- Validación superada: 41 guías completas y 57 recursos HTTP. Ejecutada la generación JavaScript de las 41 fichas y las 12 jornadas, con 545 comprobaciones de contenido, fuentes, escape HTML, leyendas, desplegables y conservación del día de regreso. No se realizó revisión visual en navegador.

## 2026-10-10 · Actualización Escocia 2027
- Aplicado el documento actualizado del usuario: 12 días, llegada y salida por Glasgow y junio de 2027 provisional. Sustituidos los acuerdos iniciales de duración y ciudad de vuelos, con motivo registrado.
- Incorporados Glasgow/Edimburgo urbanos, Iona, Staffa desde Fionnphort, Glencoe, tramo provisional de Skye y retorno a Glasgow. Día 12 sin turismo, devolución del vehículo día 11.
- Autocaravana días 4–11: 8 días y 7 noches; 4 noches convencionales. Requisitos del vehículo y referencia inicial de alquiler separados de una reserva o precio contratado.
- Nuevo `data/logistics.json` para alojamientos y servicios, cargado centralmente y referenciado por las jornadas. Fidden elegido para dos noches; Red Squirrel candidato; disponibilidad y reservas pendientes.
- Estados visuales separados para plan, visitas opcionales/acordadas y reservas. Fichas con desplazamientos, pernoctas, fuentes y nuevos puntos de interés urbanos y geológicos.
- Mapas actualizados con puertos concretos y modos diferenciados; conexiones siguen siendo esquemáticas. Las opciones no se fuerzan como desvíos en Google Maps.
- Día 7 muestra rangos aportados por el usuario (115–130 km, 2,5–3 h sin ferry ni esperas); no se inventan totales ni valores medios. Signal Rock conserva la referencia 25–60 min.
- Documentada la política actual de Fidden (sin reservas previas), pendiente de revalidar para 2027. Preservadas fotografías, preferencias locales existentes y configuración F5.
- Validación superada: 12 jornadas, 41 lugares, 21 conexiones, 22 fuentes, 8 días/7 noches en autocaravana y 4 noches convencionales; 46 recursos servidos por HTTP. Comprobadas 17 condiciones de lógica y generación de HTML, incluidas todas las fichas de días y lugares. La revisión visual en navegador sigue pendiente; no se ha vuelto a iniciar Edge tras la autorización rechazada.

## 2026-10-10 · Arranque con F5
- Configuración de VS Code para iniciar el servidor HTTP local y abrir la guía en Edge con F5.
- Tarea de Windows conectada a la instalación real de Python, evitando el alias de Microsoft Store.
- Documentadas la recarga, la detención del servidor y la adaptación a otro equipo.

## 2026-10-10 · Primera versión
- Guía estática modular en español, compatible con GitHub Pages sin compilación ni workflows personalizados.
- Diseño de aventura con paleta de las Highlands, portada fotográfica, tarjetas, ilustraciones identificadas y navegación móvil fija.
- Inicio, 11 jornadas y sus detalles, mapa con filtros, 11 fichas de lugares, búsqueda, categorías, favoritos e información práctica.
- Presupuesto orientativo editable y lista personal de preparativos guardados en el navegador.
- Bootstrap, iconos, Leaflet, licencias y fotografías incluidos en el repositorio.
- Datos desconocidos conservados como `null`; propuestas separadas de hechos confirmados; regreso sin turismo.
- Mapas con conexiones esquemáticas, ferris y transporte pendiente diferenciados. Sin distancias inventadas.
- Documentación de contexto, decisiones, esquema, fuentes, mantenimiento y publicación.
- Validador de JSON, relaciones, continuidad, geometrías y recursos.
- Comprobación HTTP de los recursos y sus tipos MIME. Preparado un script opcional de pruebas visuales con Edge; no se ha ejecutado porque su autorización fue rechazada, por lo que la revisión visual e interactiva en navegador queda pendiente.

## 2026-10-10 · Fotografías en todas las fichas

- Incorporadas las cinco imágenes nuevas del usuario y asignadas fotografías a los 41 lugares y las 12 jornadas; eliminadas las ilustraciones de sustitución.
- Pies y textos alternativos distinguen las fotos específicas de las imágenes de contexto o de ambiente del viaje. Créditos del usuario separados de Unsplash.
- Staffa se sirve como AVIF, conservando el original. Recuperación ante errores de carga con otras fotos locales y actualización de sus descripciones.
- Validación obligatoria de fotografías, descripciones y formato de archivo; verificación de recursos mediante HTTP.

## 2026-10-10 · Foto de Staffa en la jornada de basalto

- La jornada «La música del basalto» utiliza la fotografía de Staffa en inicio e itinerario mediante la referencia opcional imagePlaceId.


## 2026-10-10 · Altura y renderización del mapa

- El mapa general mantiene una altura acotada en escritorio y móvil, independiente de la lista de 41 lugares. La lista tiene desplazamiento propio y acceso por teclado.
- Leaflet se inicializa después del contenido lateral y observa cambios de tamaño del contenedor; la observación se libera al desmontar el mapa.


## 2026-10-10 · Mapa a pantalla completa

- Botón para ampliar el mapa al 100 % de la pantalla, con salida mediante el mismo botón o Escape. Conserva el recorrido y el zoom, ajusta Leaflet y restaura la vista al navegar.
- Vista ampliada mediante diálogo modal accesible, con foco controlado y adaptación a móvil.

