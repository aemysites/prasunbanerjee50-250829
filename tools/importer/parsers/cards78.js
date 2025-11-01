/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards78) block: 'no images' variant, single column per card
  // 1. Header row
  const rows = [['Cards (cards78, no images)']];

  // 2. Find all card containers
  const cardNodes = element.querySelectorAll('.cmp-floating-awards-card > .rad-awards-card');

  cardNodes.forEach(card => {
    // --- Text cell ---
    // Title: from .rad-awards-card__toggle (button)
    const btn = card.querySelector('.rad-awards-card__toggle');
    let title = '';
    if (btn) {
      const h3 = document.createElement('h3');
      h3.textContent = btn.textContent.trim();
      title = h3;
    }
    // Description: from .rad-awards-card__rte (if present)
    const desc = card.querySelector('.rad-awards-card__rte');
    // CTA: look for a direct <a> inside .rad-awards-card__detail
    const cta = card.querySelector('.rad-awards-card__detail > a');

    // Compose text cell content
    const textCellContent = [];
    if (title) textCellContent.push(title);
    if (desc) textCellContent.push(desc);
    if (cta) textCellContent.push(cta);

    rows.push([textCellContent]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
