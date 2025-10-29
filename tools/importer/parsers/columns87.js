/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns87)'];

  // --- Top bar extraction ---
  // Find the logo image
  const logoImg = element.querySelector('.cmp-image__image');
  // Find the top bar text
  const topBarText = element.querySelector('.cmp-text p');
  // Find the top bar button/link
  const prijaviteSeBtn = element.querySelector('.cmp-button');

  // Compose the first row: logo, text, button, then the five columns
  // Find all .list elements representing the five columns
  let columnLists = Array.from(element.querySelectorAll('.list'));
  // Defensive: Only keep lists with a heading and menu
  columnLists = columnLists.filter(list =>
    list.querySelector('h3') && list.querySelector('menu')
  );

  // Each column cell will be the entire list block (heading + menu)
  const columnCells = columnLists.map(list => list);

  // Compose the table rows
  // First row: block name
  // Second row: logo, text, button, five columns (all in one row)
  const cells = [
    headerRow,
    [logoImg, topBarText, prijaviteSeBtn, ...columnCells].filter(Boolean)
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
