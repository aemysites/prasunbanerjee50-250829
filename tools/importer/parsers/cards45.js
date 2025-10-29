/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards45) block header
  const headerRow = ['Cards (cards45)'];

  // Find all card tiles (support for multiple cards if present)
  const cardTiles = element.querySelectorAll('.ds2-content-slider--tile');
  if (!cardTiles.length) return;

  const rows = [headerRow];

  cardTiles.forEach(cardTile => {
    // --- IMAGE CELL ---
    let imageCell = null;
    const imageCol = cardTile.querySelector('.ds2-content-slider--image picture');
    if (imageCol) {
      imageCell = imageCol;
    }

    // --- TEXT CELL ---
    const textCol = document.createElement('div');
    textCol.style.display = 'contents'; // preserve children semantics

    // Title (h3)
    const title = cardTile.querySelector('.ds2-basic-teaser--title');
    if (title) {
      textCol.appendChild(title);
    }

    // Description
    const desc = cardTile.querySelector('.ds2-cms-output');
    if (desc) {
      textCol.appendChild(desc);
    }

    // CTA link
    const cta = cardTile.querySelector('.ds2-buttonlist a');
    if (cta) {
      textCol.appendChild(cta);
    }

    rows.push([imageCell, textCol]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
