/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns68)'];

  // Get the main container
  const container = element.querySelector('.cpc-component__container') || element;

  // Get headline (first column)
  let headline = container.querySelector('.cpc-component__container__headline');
  if (!headline) {
    headline = container.querySelector('h3, h2');
  }
  // Only the text content for the headline
  let headlineCell = '';
  if (headline) {
    const p = document.createElement('p');
    p.textContent = headline.textContent.trim();
    headlineCell = p;
  }

  // Get all button columns (remaining columns)
  // Each button is inside .ds-icon-button__box
  const buttonBoxes = Array.from(container.querySelectorAll('.ds-icon-button__box'));

  // For each button box, extract only the icon and button (remove spinners and extraneous markup)
  const buttonCells = buttonBoxes.map((box) => {
    // Find icon span
    const icon = box.querySelector('span[class*="icon-"]');
    // Find button
    const button = box.querySelector('a.button');
    const cell = document.createElement('div');
    if (icon) cell.appendChild(icon.cloneNode(true));
    if (button) cell.appendChild(button.cloneNode(true));
    return cell;
  });

  // Ensure there are exactly 3 button columns
  while (buttonCells.length < 3) {
    buttonCells.push('');
  }

  // Compose columns: headline, then each button box as its own column
  const columns = [headlineCell, ...buttonCells];

  // Ensure there are exactly four columns in the second row
  while (columns.length < 4) {
    columns.push('');
  }

  // Build the table rows
  const cells = [
    headerRow,
    columns,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
