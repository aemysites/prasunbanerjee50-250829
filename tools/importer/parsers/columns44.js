/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns44)'];

  // Get all direct <a> children (each contains a logo image)
  const logoLinks = Array.from(element.querySelectorAll(':scope > a'));

  // Defensive: If no logos, do nothing
  if (!logoLinks.length) return;

  // Arrange into 2 rows: first row 5 columns, second row 4 columns (no empty cell)
  const firstRow = logoLinks.slice(0, 5);
  const secondRow = logoLinks.slice(5, 9);

  // Table cells: header, then two rows
  const cells = [
    headerRow,
    firstRow,
    secondRow,
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
