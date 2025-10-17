/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Columns block
  const headerRow = ['Columns (columns10)'];

  // Find the list of items (columns)
  const ul = element.querySelector('ul.ds2-sticky-sales-bar__item-wrapper');
  let columns = [];
  if (ul) {
    const items = ul.querySelectorAll('li.ds2-sticky-sales-bar__item');
    columns = Array.from(items).map(li => {
      // Each li contains an <a> with icon and label
      const link = li.querySelector('a');
      if (link) {
        // Reference the existing anchor element (do not clone)
        return link;
      }
      return '';
    });
  }

  // Only create the table if we found columns
  if (columns.length > 0) {
    const tableRows = [
      headerRow,
      columns // Second row: one cell per column item
    ];
    const table = WebImporter.DOMUtils.createTable(tableRows, document);
    element.replaceWith(table);
  }
}
