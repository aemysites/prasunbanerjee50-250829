/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards6) block parsing
  // 1. Header row
  const headerRow = ['Cards (cards6)'];

  // 2. Find all card elements (specific selector for cards)
  // Each card is a .teaser.icon-card.card inside the container
  const cardSelector = '.teaser.icon-card.card';
  const cards = element.querySelectorAll(cardSelector);
  const rows = [headerRow];

  cards.forEach(card => {
    // Image/Icon (first cell)
    let imageCell = null;
    const imageWrapper = card.querySelector('.cmp-teaser__image .cmp-image');
    if (imageWrapper) {
      // Use the actual <img> element
      const img = imageWrapper.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // Text Content (second cell)
    const content = card.querySelector('.cmp-teaser__content');
    const textCellParts = [];
    if (content) {
      // Title (h3)
      const title = content.querySelector('.cmp-teaser__title');
      if (title) {
        textCellParts.push(title);
      }
      // Description (div > p)
      const desc = content.querySelector('.cmp-teaser__description');
      if (desc) {
        textCellParts.push(desc);
      }
      // CTA Link
      const cta = content.querySelector('.cmp-teaser__action-link');
      if (cta) {
        textCellParts.push(cta);
      }
    }
    // Defensive: fallback to card if nothing found
    const textCell = textCellParts.length ? textCellParts : card;

    // Add row: [image/icon, text content]
    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
