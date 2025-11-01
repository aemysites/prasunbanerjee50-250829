/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards16) block header
  const headerRow = ['Cards (cards16)'];

  // Find all card elements
  const cards = element.querySelectorAll('.rad-editorial-grid__card');
  const rows = [headerRow];

  cards.forEach(card => {
    // --- Image Extraction ---
    // Reference the actual <img> element
    const img = card.querySelector('.editorial-grid-card__image img');
    const imageCell = img || '';

    // --- Text Extraction ---
    const copy = card.querySelector('.editorial-grid-card__copy-wrapper');
    const textCellContent = [];
    if (copy) {
      // Title (h3)
      const title = copy.querySelector('.editorial-grid-card__title');
      if (title) textCellContent.push(title);
      // Description (p)
      const desc = copy.querySelector('.editorial-grid-card__body');
      if (desc) textCellContent.push(desc);
    }
    // If no text content, leave cell empty string
    const textCell = textCellContent.length ? textCellContent : '';

    // Add row: [image, text]
    rows.push([imageCell, textCell]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
