import {escapeHTML as e,icon} from './utils.js';
import {sourceLinks} from './components.js';

export function renderMiniGuide(place,data,{embedded=false} = {}) {
  const guide = place.miniGuide;
  if (!guide) return '';
  const heading = embedded ? 'h4' : 'h3';
  return `<section class="mini-guide ${embedded ? 'embedded-guide' : ''}" aria-label="Mini guía de ${e(place.name)}">
    ${embedded ? '' : `<div class="guide-heading"><span class="eyebrow">TU MINI FREE TOUR</span><h2>Las historias de este lugar.</h2><p>Lee, mira a tu alrededor y descubre los detalles.</p></div>`}
    <div class="guide-intro"><${heading}>${icon('geo-alt')} Qué es</${heading}><p>${e(guide.intro)}</p></div>
    <div class="guide-story"><${heading}>${icon('chat-quote')} La historia que te contaría un guía</${heading}><p>${e(guide.story)}</p></div>
    <div class="guide-sights"><${heading}>${icon('binoculars')} Qué ver y en qué fijarte</${heading}><ol>${guide.highlights.map(item => `<li><strong>${e(item.title)}</strong><p>${e(item.text)}</p></li>`).join('')}</ol></div>
    <div class="guide-curiosities"><${heading}>${icon('lightbulb')} ¿Sabías que…?</${heading}>${guide.curiosities.map(item => `<article class="guide-curiosity ${item.kind === 'leyenda' ? 'is-legend' : ''}"><span>${item.kind === 'leyenda' ? 'Leyenda local' : 'Dato curioso'}</span><p>${e(item.text)}</p></article>`).join('')}</div>
    <details class="guide-sources"><summary>Fuentes de esta mini guía</summary>${sourceLinks(guide.sourceIds,data)}</details>
  </section>`;
}
