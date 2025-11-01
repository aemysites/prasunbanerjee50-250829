/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards10) block parsing
  // 1. Header row
  const headerRow = ['Cards (cards10)'];

  // 2. Find card elements directly (not wrappers)
  const cardElements = element.querySelectorAll('.rad-content-grid-card');

  const rows = [headerRow];

  cardElements.forEach((card) => {
    // --- IMAGE/ICON CELL ---
    let imageCell = null;
    // Try full image
    const fullImage = card.querySelector('.rad-content-grid-card__full-image img');
    if (fullImage) {
      imageCell = fullImage.cloneNode(true);
    } else {
      // No image at all for these cards: use empty string (no placeholder, no colored block)
      imageCell = '';
    }

    // --- TEXT CELL ---
    const textCellContent = [];
    // Label (category)
    const label = card.querySelector('.rad-content-grid-card__label');
    if (label && label.textContent.trim()) {
      const labelDiv = document.createElement('div');
      labelDiv.textContent = label.textContent.trim();
      textCellContent.push(labelDiv);
    }
    // Title
    const title = card.querySelector('.rad-content-grid-card__title');
    if (title && title.textContent.trim()) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      textCellContent.push(h3);
    }
    // Description (from back-content)
    const desc = card.querySelector('.rad-content-grid-card__back-content .rad-content-grid-card__content p');
    if (desc && desc.textContent.trim()) {
      const descP = document.createElement('p');
      descP.textContent = desc.textContent.trim();
      textCellContent.push(descP);
    }
    // CTA button (ghost button)
    const cta = card.querySelector('.rad-content-grid-card__back-content .rad-button--ghost');
    if (cta) {
      textCellContent.push(cta.cloneNode(true));
    }

    // Only add row if text content is present
    if (textCellContent.length > 0) {
      rows.push([imageCell, textCellContent]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
