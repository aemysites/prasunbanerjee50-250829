/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero27) block: 1 column, 3 rows
  // Row 1: Block name
  // Row 2: Background image (optional, not present)
  // Row 3: Heading, subheading, CTA (no CTA or image in this case)

  // Helper: Get left column content
  const leftCol = element.querySelector('.cmp-card-listing_first-row_left-col');
  let headingEl = null;
  let subheadingEl = null;

  if (leftCol) {
    // Find heading (h2 inside .cmp-title)
    const titleContainer = leftCol.querySelector('.cmp-title');
    if (titleContainer) {
      headingEl = titleContainer.querySelector('h2');
    }
    // Find subheading/paragraph (p inside .cmp-text)
    const textContainer = leftCol.querySelector('.cmp-text');
    if (textContainer) {
      subheadingEl = textContainer.querySelector('p');
    }
  }

  // Row 1: Header
  const headerRow = ['Hero (hero27)'];
  // Row 2: Background image (none in this HTML)
  const imageRow = [''];
  // Row 3: Content (heading, subheading)
  const content = [];
  if (headingEl) content.push(headingEl);
  if (subheadingEl) content.push(subheadingEl);
  const contentRow = [content];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}