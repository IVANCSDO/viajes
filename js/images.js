// Local photographs remain available without an external image service.
export const fallbackPhoto = {
  image: 'assets/images/highlands.jpg',
  imageAlt: 'Paisaje del Quiraing, en la isla de Skye',
  imageCaption: 'Quiraing, Skye · Imagen de ambiente del viaje'
};

export function photoDetails(place) {
  return place?.image ? place : fallbackPhoto;
}

export function recoverPhoto(event) {
  const img = event.target;
  if (img?.tagName !== 'IMG' || !img.hasAttribute('data-photo')) return;
  const alternatives = [fallbackPhoto, {
    image: 'assets/images/edinburgh.jpg',
    imageAlt: 'Vista de Edimburgo',
    imageCaption: 'Edimburgo · Imagen de ambiente del viaje'
  }];
  const attempt = Number(img.dataset.photoAttempt || 0);
  const photo = alternatives[attempt];
  if (!photo) return;
  img.dataset.photoAttempt = String(attempt + 1);
  img.alt = photo.imageAlt;
  const caption = img.closest('figure')?.querySelector('figcaption')
    || img.closest('.hero')?.querySelector('.hero-caption');
  if (caption) caption.textContent = photo.imageCaption;
  img.src = photo.image;
}
