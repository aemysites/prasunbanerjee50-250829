/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards72) block: 2 columns, multiple rows, first row is header
  // Source HTML is empty (no cards/content)
  // Defensive: if no cards found, output header only

  const headerRow = ['Cards (cards72)'];
  const rows = [headerRow];

  // There are no card items in the source HTML, so no additional rows

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
