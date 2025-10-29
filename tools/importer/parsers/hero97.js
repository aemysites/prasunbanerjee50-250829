/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero97) block: 1 column, 3 rows
  // Row 1: Block name
  // Row 2: Background image (optional)
  // Row 3: Headline, subheading, CTA (optional)

  // 1. Header row: always use block name
  const headerRow = ['Hero (hero97)'];

  // 2. Image row: no image present in HTML or screenshot, so cell is empty
  const imageRow = [''];

  // 3. Content row: extract headline and paragraph
  const contentCell = [];

  // Extract headline (h2, h1)
  const headline = element.querySelector('h2, h1');
  if (headline) {
    contentCell.push(headline);
  }

  // Extract paragraph(s) inside .ds2-cms-output
  const paragraph = element.querySelector('.ds2-cms-output p');
  if (paragraph) {
    contentCell.push(paragraph);
  }

  // No CTA/link present in this example

  // Compose table rows
  const rows = [headerRow, imageRow, [contentCell]];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
