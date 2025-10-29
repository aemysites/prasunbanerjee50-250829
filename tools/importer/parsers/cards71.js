/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards71) block parser for BMW Mood Preconfiguration
  const headerRow = ['Cards (cards71)'];

  // Find all card items
  const cardNodes = element.querySelectorAll('.ds2-mood-preconfiguration-item');
  const rows = [];

  cardNodes.forEach(card => {
    // --- IMAGE CELL ---
    let imageCell = null;
    const hoverContent = card.querySelector('.ds2-mood-preconfiguration-item__hover-content');
    if (hoverContent) {
      const img = hoverContent.querySelector('img');
      if (img) {
        imageCell = img;
      } else {
        const picture = hoverContent.querySelector('picture');
        if (picture) imageCell = picture;
      }
    }
    if (!imageCell) {
      const img = card.querySelector('img');
      if (img) imageCell = img;
    }

    // --- TEXT CELL ---
    const textCellContent = [];
    const header = card.querySelector('.ds2-mood-preconfiguration-item__header');
    if (header) {
      // Vehicle name (span)
      const name = header.querySelector('.ds2-mood-preconfiguration-item__vehicle-name');
      if (name) {
        const nameDiv = document.createElement('div');
        nameDiv.textContent = name.textContent.trim();
        textCellContent.push(nameDiv);
      }
      // Headline (h2)
      const headline = header.querySelector('.ds2-mood-preconfiguration-item__headline');
      if (headline) {
        textCellContent.push(headline);
      }
    }
    // Add horizontal line before CTA (for visual fidelity)
    const hr = document.createElement('hr');
    textCellContent.push(hr);
    // CTA: find button link in price-list-layer
    let cta = null;
    const priceList = card.querySelector('.ds2-mood-preconfiguration-item__price-list-layer');
    if (priceList) {
      cta = priceList.querySelector('a');
    }
    if (cta) {
      const ctaCloned = cta.cloneNode(true);
      Array.from(ctaCloned.children).forEach(child => {
        if (!child.classList.contains('ds2-button--responsive-line')) {
          ctaCloned.removeChild(child);
        }
      });
      textCellContent.push(ctaCloned);
    }

    rows.push([
      imageCell,
      textCellContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
