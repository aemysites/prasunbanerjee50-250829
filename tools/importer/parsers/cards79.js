/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards79) block: 2 columns, multiple rows
  // Header row
  const headerRow = ['Cards (cards79)'];

  // Extract the headline and preserve it above the table
  const headlineEl = element.querySelector('.ds2-showroom-multicontent__headline-spacing h3');
  let headlineBlock = null;
  if (headlineEl) {
    // Clone the headline element so it can be inserted before the table
    headlineBlock = headlineEl.cloneNode(true);
  }

  // Find the parent container for all cards
  const cardsContainer = element.querySelector('.ds2-showroom-multicontent__slider');
  if (!cardsContainer) return;

  // Each card is a .ds2-showroom-multicontent__slide > .ds2-showroom-multicontent__item
  const cardSlides = cardsContainer.querySelectorAll('.ds2-showroom-multicontent__slide');
  const rows = [headerRow];

  cardSlides.forEach((slide) => {
    const card = slide.querySelector('.ds2-showroom-multicontent__item');
    if (!card) return;

    // Image (first cell)
    let imageEl = null;
    const imgContainer = card.querySelector('.ds2-showroom-multicontent__item-image');
    if (imgContainer) {
      // Use the <img> inside <picture>
      const img = imgContainer.querySelector('img');
      if (img) imageEl = img;
    }

    // Text content (second cell)
    const textContent = [];
    // Title
    const title = card.querySelector('.ds2-showroom-multicontent__item-headline');
    if (title) textContent.push(title);
    // Description
    const desc = card.querySelector('.ds2-showroom-multicontent__item-text');
    if (desc) textContent.push(desc);

    rows.push([imageEl, textContent]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Insert headline above the table if present
  if (headlineBlock) {
    element.parentNode.insertBefore(headlineBlock, element);
  }
  element.replaceWith(block);
}
