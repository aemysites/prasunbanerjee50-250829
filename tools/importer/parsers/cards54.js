/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards54) block: 2 columns, multiple rows (image | text), header row is block name
  const headerRow = ['Cards (cards54)'];
  const rows = [headerRow];

  // Find the parent container holding all cards
  // The cards are .teaser.dcc.dcc-image-title.card inside a responsivegrid/container
  const cardContainers = element.querySelectorAll('.teaser.dcc.dcc-image-title.card');

  cardContainers.forEach((card) => {
    // Image: find the first <img> inside the card
    const img = card.querySelector('img');
    // Text: find the heading (h4) or title link
    const contentDiv = card.querySelector('.cmp-teaser__content');
    let textContent = '';
    if (contentDiv) {
      // Use the heading link if present, else the heading
      const headingLink = contentDiv.querySelector('a');
      if (headingLink) {
        textContent = headingLink;
      } else {
        const heading = contentDiv.querySelector('h4, h3, h2, h1');
        textContent = heading || '';
      }
    }
    // Each row: [image, text]
    rows.push([
      img || '',
      textContent || ''
    ]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
