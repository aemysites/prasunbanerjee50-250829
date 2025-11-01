/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards50) block: 2 columns, multiple rows, first row is header
  const headerRow = ['Cards (cards50)'];
  const rows = [headerRow];

  // Select all card elements inside the parent container
  const cardSelector = '.rad-mosaic__card';
  const cards = Array.from(element.querySelectorAll(cardSelector));

  cards.forEach(card => {
    // --- IMAGE CELL ---
    let imageCell = '';
    // Look for image wrapper inside card
    const imageWrapper = card.querySelector('.rad-mosaic__image-card-image');
    if (imageWrapper) {
      // Find the <img> element inside the wrapper
      const img = imageWrapper.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // --- TEXT CELL ---
    // Collect all text content, including eyebrow, title, description, stats, and any other elements
    let textCellContent = [];
    const desc = card.querySelector('.rad-mosaic__card-description');
    if (desc) {
      // Eyebrow
      const eyebrow = desc.querySelector('.rad-mosaic__card-description-eyebrow');
      if (eyebrow) textCellContent.push(eyebrow);
      // Title
      const title = desc.querySelector('.rad-mosaic__card-description-title');
      if (title) textCellContent.push(title);
      // Any other elements or text nodes in description (not eyebrow/title)
      Array.from(desc.childNodes).forEach(node => {
        if (node !== eyebrow && node !== title) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            textCellContent.push(node.cloneNode(true));
          } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            textCellContent.push(document.createTextNode(node.textContent.trim()));
          }
        }
      });
    }
    // Stat cards: add stat figure and stat text if present
    const statFigure = card.querySelector('.rad-mosaic__stat-card-stat-figure');
    const statText = card.querySelector('.rad-mosaic__stat-card-stat-text');
    if (statFigure) textCellContent.push(statFigure);
    if (statText) textCellContent.push(statText);
    // Defensive: If no text found, fallback to card textContent
    if (textCellContent.length === 0) {
      textCellContent = [card.textContent.trim()];
    }

    // --- ROW ASSEMBLY ---
    // Always 2 columns: [image or '', text]
    rows.push([imageCell || '', textCellContent]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
