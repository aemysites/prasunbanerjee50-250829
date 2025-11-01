/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards93) block: 2 columns, multiple rows, first row is header
  const headerRow = ['Cards (cards93)'];
  const rows = [headerRow];

  // Only extract the visible card grid, not modal overlays or modal card stacks
  const cards = element.querySelectorAll('.rad-mosaic__grid > .rad-mosaic__card');

  cards.forEach((card) => {
    // --- IMAGE/ICON CELL ---
    let imageCell = '';
    // Try to find image in card
    const imageWrapper = card.querySelector('.rad-mosaic__image-card-image, .cmp-image');
    let img = null;
    if (imageWrapper) {
      img = imageWrapper.querySelector('img');
    }
    if (img) {
      imageCell = img;
    } else {
      imageCell = '';
    }

    // --- TEXT CELL ---
    let textCellContent = [];
    const desc = card.querySelector('.rad-mosaic__card-description');
    if (desc) {
      // Eyebrow
      const eyebrow = desc.querySelector('.rad-mosaic__card-description-eyebrow');
      if (eyebrow && eyebrow.textContent.trim()) {
        const eyebrowDiv = document.createElement('div');
        eyebrowDiv.textContent = eyebrow.textContent.trim();
        eyebrowDiv.style.fontSize = 'smaller';
        eyebrowDiv.style.textTransform = 'uppercase';
        textCellContent.push(eyebrowDiv);
      }
      // Title
      const title = desc.querySelector('.rad-mosaic__card-description-title');
      if (title && title.textContent.trim()) {
        const titleEl = document.createElement('strong');
        titleEl.textContent = title.textContent.trim();
        textCellContent.push(titleEl);
      }
      // Description: get all text nodes after eyebrow and title
      // If there is extra text in the description (not in eyebrow/title), include it
      // We'll grab all text nodes and <br> tags in desc that aren't eyebrow/title
      const excludeNodes = [eyebrow, title];
      desc.childNodes.forEach((node) => {
        if (!excludeNodes.includes(node) && node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const p = document.createElement('div');
          p.textContent = node.textContent.trim();
          textCellContent.push(p);
        }
      });
    }
    // If card has no image and no description, fallback to all text
    if (textCellContent.length === 0) {
      const txt = card.textContent.trim();
      if (txt) {
        textCellContent.push(txt);
      }
    }
    // Always use 2 columns: first is image (or blank), second is text
    rows.push([imageCell, textCellContent]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
