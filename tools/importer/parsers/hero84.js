/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero84)'];

  // 2. Background image row
  // Find the background image (full-width image)
  let bgImgEl = null;
  // Try to find the image in the .parallaxImg container (which is visually shown)
  const parallaxImg = element.querySelector('.parallaxImg img');
  if (parallaxImg) {
    bgImgEl = parallaxImg;
  } else {
    // fallback: try any .cmp-image__image that is visible
    const visibleImg = element.querySelector('.cmp-image__image:not([style*="display:none"])');
    if (visibleImg) bgImgEl = visibleImg;
  }

  // 3. Content row (title, pretitle, description, CTA)
  // The content is in .teaser or .cmp-teaser__content
  let contentEl = null;
  const teaser = element.querySelector('.teaser, .cmp-teaser');
  if (teaser) {
    // Use the entire teaser block for resilience
    contentEl = teaser;
  } else {
    // fallback: try the first card/content block
    const card = element.querySelector('.content-card, .cmp-teaser__content');
    if (card) contentEl = card;
  }

  // Defensive: fallback to the whole element if not found
  if (!contentEl) contentEl = element;

  // 4. Build the table rows
  const rows = [
    headerRow,
    [bgImgEl ? bgImgEl : ''],
    [contentEl]
  ];

  // 5. Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
