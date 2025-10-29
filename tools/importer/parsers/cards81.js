/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Cards (cards81)
  const headerRow = ['Cards (cards81)'];

  // Find all card tiles (support multiple cards)
  const cardTiles = element.querySelectorAll('.ds2-content-slider--tile');
  if (!cardTiles.length) return;

  const rows = [];

  cardTiles.forEach(cardTile => {
    // Image: find the <img> inside the .ds2-content-slider--image
    const imageCol = cardTile.querySelector('.ds2-content-slider--image');
    let imageEl = null;
    if (imageCol) {
      imageEl = imageCol.querySelector('img');
    }

    // Text content: title, description, CTA
    const descCol = cardTile.querySelector('.ds2-content-slider--description');
    const textContent = [];
    if (descCol) {
      // Title (h3)
      const title = descCol.querySelector('.ds2-basic-teaser--title');
      if (title) textContent.push(title);
      // Description (ds2-cms-output)
      const desc = descCol.querySelector('.ds2-cms-output');
      if (desc) textContent.push(desc);
      // CTA (a inside .ds2-linklist)
      const cta = descCol.querySelector('.ds2-linklist a');
      if (cta) textContent.push(cta);
    }

    // Build the card row: [image, textContent]
    rows.push([imageEl, textContent]);
  });

  // Compose the table
  const tableCells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element
  element.replaceWith(table);
}
