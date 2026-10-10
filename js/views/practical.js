import {escapeHTML as e,icon,externalLink,toast} from '../utils.js';
import {pageHeading,statusBadge,sourceLinks} from '../components.js';
import {readLocal,writeLocal} from '../storage.js';
import {budgetTotal} from '../stats.js';
import {renderLogistics} from './logistics.js';
export function renderPractical(data) {
  return `<div class="container page-content">${pageHeading('UN POCO DE PLANIFICACIÓN. MUCHA LIBERTAD.','Listos para el camino.','Todo lo que conviene tener a mano antes de arrancar. Las reservas y los importes siguen pendientes.')}<div class="practical-grid">${data.practical.sections.map((section,i) => `<details class="practical-card" ${i < 3 ? 'open' : ''}><summary><span class="practical-icon">${icon(section.icon)}</span><span><small>${e(section.label)}</small><strong>${e(section.title)}</strong></span>${icon('chevron-down')}</summary><div class="practical-content">${statusBadge(section.status)}<p>${e(section.text)}</p><ul>${section.items.map(item => `<li>${e(item)}</li>`).join('')}</ul>${sourceLinks(section.sourceIds,data)}</div></details>`).join('')}</div>${renderLogistics(data)}<div class="planning-tools"><section class="budget-card"><span class="eyebrow">SIN SORPRESAS</span><h2>Hagamos números.</h2><p>Introduce tus estimaciones para todo el grupo, en libras (£). No son precios confirmados.</p><form id="budget-form" class="budget-form">${data.practical.budget.categories.map(item => `<label for="budget-${item.id}"><span>${e(item.label)}</span><span class="money-input"><input id="budget-${item.id}" name="${e(item.id)}" type="number" min="0" max="1000000" step="0.01" inputmode="decimal" placeholder="Pendiente"><span>£</span></span></label>`).join('')}</form><div id="budget-result" class="budget-result" aria-live="polite"></div><button type="button" class="text-button" id="reset-budget">Borrar estimaciones</button></section><section class="checklist-card"><span class="eyebrow">POCO A POCO</span><h2>Antes de la aventura.</h2><p>Tu lista personal de preparativos. Marcar una tarea no confirma una reserva en el itinerario.</p><div class="checklist">${data.practical.checklist.map(item => `<label><input type="checkbox" data-check="${e(item.id)}"><span>${e(item.label)}</span></label>`).join('')}</div><p id="check-progress" class="check-progress" role="status"></p><p class="fine-print">Las estimaciones, favoritos y tareas se guardan solo en este navegador.</p></section></div><div class="sources-banner"><div><h2>Una guía con los pies en la tierra.</h2><p>Consulta de dónde sale la información y qué queda por decidir.</p></div><a href="#practica/fuentes" class="text-link">Fuentes y créditos ${icon('arrow-right')}</a></div></div>`;
}
export function mountPractical(data) {
  const storedBudget = readLocal('budget',{});
  const budget = storedBudget && typeof storedBudget === 'object' ? storedBudget : {};
  const form = document.querySelector('#budget-form');
  data.practical.budget.categories.forEach(item => { const input=form.elements.namedItem(item.id); const value=budget[item.id] ?? item.amount; input.value=value != null && Number.isFinite(Number(value)) && Number(value) >= 0 ? value : ''; });
  const currency = new Intl.NumberFormat('es-ES',{style:'currency',currency:data.practical.budget.currency});
  function calculate(save=false) {
    const inputs=[...form.querySelectorAll('input')];
    const invalid=inputs.some(input => !input.validity.valid);
    const {total,complete,count}=budgetTotal(inputs.map(input => input.value));
    document.querySelector('#budget-result').innerHTML = invalid ? '<p>Revisa los importes: deben ser positivos, con un máximo de 1.000.000 £ por concepto y dos decimales.</p>' : `<div><span>${complete ? 'Total estimado' : 'Subtotal estimado'} · ${count}/${inputs.length} conceptos</span><strong>${currency.format(total)}</strong></div><p>${currency.format(total/data.trip.travelers)} por persona · ${data.trip.travelers} viajeros${complete ? '' : ' · Faltan importes'}</p>`;
    if(save && !invalid && !writeLocal('budget',Object.fromEntries(inputs.map(input => [input.name,input.value])))) toast('Guardado en esta sesión. El almacenamiento del navegador no está disponible.');
  }
  form.addEventListener('submit',event => event.preventDefault());
  form.addEventListener('input',() => calculate(true));
  document.querySelector('#reset-budget').addEventListener('click',() => { form.reset(); calculate(true); toast('Estimaciones borradas.'); });
  const storedChecks=readLocal('checklist',[]);
  const checked=new Set(Array.isArray(storedChecks) ? storedChecks : []);
  const boxes=[...document.querySelectorAll('[data-check]')];
  function updateProgress() { document.querySelector('#check-progress').textContent=`${boxes.filter(box => box.checked).length} de ${boxes.length} preparativos completados`; }
  boxes.forEach(box => { box.checked=checked.has(box.dataset.check); box.addEventListener('change',() => { const persisted=writeLocal('checklist',boxes.filter(item => item.checked).map(item => item.dataset.check)); updateProgress(); if(!persisted) toast('Lista guardada solo durante esta sesión.'); }); });
  updateProgress(); calculate();
}
export function renderSources(data) {
  return `<div class="container page-content sources-page"><a href="#practica" class="back-link">${icon('arrow-left')} Información práctica</a>${pageHeading('EL ORIGEN DE CADA HISTORIA','Fuentes y créditos.','El plan vigente procede de la actualización del usuario para Escocia 2027. El documento inicial se conserva como antecedente; los tramos provisionales y las reservas pendientes se identifican por separado.')}<div class="planning-note">${icon('info-circle')}<p>No hay fechas exactas ni reservas confirmadas. El día 7 tiene estimaciones iniciales de conducción aportadas por el usuario; los demás trayectos siguen pendientes de validar. Las coordenadas son orientativas; los mapas no contienen rutas reales de carretera. Todas las fichas muestran fotografías locales. Si se utiliza una imagen de contexto de la zona o de ambiente del viaje, se indica en su pie de foto.</p></div><div class="source-list">${data.sources.map(source => `<article><span class="small-label">${e(source.type)}</span><h2>${source.url ? externalLink(source.url,source.title) : e(source.title)}</h2><p>${e(source.note)}</p></article>`).join('')}</div><p>Mapas: © OpenStreetMap contributors. Fotografías de Unsplash bajo ${externalLink('https://unsplash.com/license','licencia Unsplash')} y fotografías aportadas por el usuario, identificadas en los créditos. Interfaz: Bootstrap 5, Bootstrap Icons y Leaflet, con licencias incluidas en el proyecto.</p><p class="fine-print">Consulta documental: 10 de octubre de 2026. Comprueba la información operativa en las fuentes oficiales antes del viaje.</p></div>`;
}
