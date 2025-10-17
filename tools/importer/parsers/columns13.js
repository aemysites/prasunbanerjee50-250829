/* global WebImporter */
export default function parse(element, { document }) {
  // --- HEADER ROW ---
  const headerRow = ['Columns (columns13)'];

  // --- COLUMN ROWS ---
  // Each column is a .list block (with heading and menu)
  const columnDivs = Array.from(element.querySelectorAll('.list'));
  const columnsRow = columnDivs.map(listDiv => {
    const heading = listDiv.querySelector('h3');
    const menu = listDiv.querySelector('menu');
    const cellContent = [];
    if (heading) cellContent.push(heading);
    if (menu) cellContent.push(menu);
    return cellContent;
  });

  // --- BUILD TABLE ---
  const cells = [
    headerRow,
    columnsRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
