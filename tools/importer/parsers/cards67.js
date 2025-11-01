/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards67) block parser
  const headerRow = ['Cards (cards67)'];
  const rows = [headerRow];

  // Find all card elements
  const cardSelector = '.rad-editorial-grid__card';
  const cards = element.querySelectorAll(cardSelector);

  cards.forEach((card) => {
    // --- IMAGE CELL ---
    // The image is inside an anchor with class 'editorial-grid-card__image'
    const imageLink = card.querySelector('.editorial-grid-card__image');
    let imageCell = '';
    if (imageLink) {
      // The image is inside a <div> with data-cmp-is="image" and contains an <img>
      const img = imageLink.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // --- TEXT CELL ---
    // The text content is inside '.editorial-grid-card__copy-wrapper'
    const copyWrapper = card.querySelector('.editorial-grid-card__copy-wrapper');
    let textCellContent = [];
    if (copyWrapper) {
      // Title (h3)
      const title = copyWrapper.querySelector('.editorial-grid-card__title');
      if (title) {
        // Use a heading element for semantic value
        const h = document.createElement('h3');
        h.textContent = title.textContent;
        textCellContent.push(h);
      }
      // Description (p)
      const desc = copyWrapper.querySelector('.editorial-grid-card__body');
      if (desc) {
        textCellContent.push(desc);
      }
      // CTA Button (a.rad-button)
      const cta = copyWrapper.querySelector('a.rad-button');
      if (cta) {
        textCellContent.push(cta);
      }
    }

    // Add the card row: [image, text content]
    rows.push([
      imageCell,
      textCellContent
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}