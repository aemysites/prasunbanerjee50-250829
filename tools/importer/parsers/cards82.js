/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards82) block: 2 columns, multiple rows
  // Header row
  const headerRow = ['Cards (cards82)'];
  const rows = [headerRow];

  // Find all card tiles (should handle multiple, but also fallback for single)
  const cardTiles = element.querySelectorAll('.ds2-content-slider--tile');

  // If no tiles found, fallback to single card structure
  const tiles = cardTiles.length > 0 ? cardTiles : [element];

  tiles.forEach((tile) => {
    // --- IMAGE COLUMN ---
    let imageEl = null;
    const imageCol = tile.querySelector('.ds2-content-slider--image');
    if (imageCol) {
      const img = imageCol.querySelector('img');
      if (img) imageEl = img;
    }

    // --- TEXT COLUMN ---
    const descCol = tile.querySelector('.ds2-content-slider--description');
    const textContent = document.createElement('div');
    if (descCol) {
      // Title (h3)
      const title = descCol.querySelector('.ds2-basic-teaser--title');
      if (title) textContent.appendChild(title);
      // Description
      const desc = descCol.querySelector('.ds2-cms-output');
      if (desc) textContent.appendChild(desc);
      // CTA link
      const cta = descCol.querySelector('.ds2-linklist a');
      if (cta) textContent.appendChild(cta);
    }

    // Only add row if there is at least image or text
    if (imageEl || textContent.childNodes.length) {
      rows.push([imageEl, textContent]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
