/* global WebImporter */
export default function parse(element, { document }) {
  // Table (no header, tableNoHeader20) block
  const headerRow = ['Table (no header, tableNoHeader20)'];

  // Find the list of links
  const ul = element.querySelector('ul.cmp-linklist__list');
  if (!ul) return;
  const items = Array.from(ul.querySelectorAll('li.cmp-linklist__list-item'));
  if (!items.length) return;

  // Extract the anchor elements for each item
  const links = items.map(li => {
    const a = li.querySelector('a.cmp-button');
    return a ? a : document.createTextNode('');
  });

  // Arrange links into 3 columns and 4 rows (column-major order)
  const columns = 3;
  const rows = Math.ceil(links.length / columns);
  const tableRows = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      const idx = j * rows + i;
      if (links[idx]) {
        row.push(links[idx]);
      } else {
        row.push('');
      }
    }
    tableRows.push(row);
  }

  // Compose the table data
  const tableData = [headerRow, ...tableRows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  element.replaceWith(table);
}
