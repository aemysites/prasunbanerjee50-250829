/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Carousel (carousel23)'];
  const rows = [headerRow];

  // Find the slider container (holds all cards)
  const slider = element.querySelector('.flickity-slider');
  // Get all cards (fallback if slider not found)
  const cards = slider
    ? slider.querySelectorAll('.rad-icon-text-carousel-tier-1__carousel-card')
    : element.querySelectorAll('.rad-icon-text-carousel-tier-1__carousel-card');

  cards.forEach(card => {
    // Image cell (mandatory)
    const img = card.querySelector('img');

    // Text cell: collect all relevant content
    const textCell = document.createElement('div');

    // Title (optional)
    const title = card.querySelector('h3');
    if (title) textCell.appendChild(title.cloneNode(true));

    // Description (optional)
    const desc = card.querySelector('p');
    if (desc) textCell.appendChild(desc.cloneNode(true));

    // CTA (optional)
    const cta = card.querySelector('a');
    if (cta) textCell.appendChild(cta.cloneNode(true));

    // Only add text cell if it has content
    rows.push([
      img ? img.cloneNode(true) : '',
      textCell.childNodes.length ? textCell : ''
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
