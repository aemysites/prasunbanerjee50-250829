/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns73)'];

  // Find all card elements (logo cards) in the correct order
  // The structure is: ... <div class="container responsivegrid"> <div ...> <div class="logocard ... card"> ... </div> ... </div> ...
  // So, first, get the container with all the cards
  const container = element.querySelector('.container.responsivegrid > div');
  if (!container) return;

  // Get all the logo card elements
  const cards = Array.from(container.querySelectorAll(':scope > .logocard.card'));

  // Defensive: if not exactly 6, fallback to all direct children
  const cardCount = cards.length === 6 ? 6 : Math.max(cards.length, 6);

  // Prepare a 2-row, 3-column layout
  // First row: cards 0, 1, 2
  // Second row: cards 3, 4, 5
  const row1 = cards.slice(0, 3).map(card => card);
  const row2 = cards.slice(3, 6).map(card => card);

  // If there are fewer than 6 cards, fill with empty strings
  while (row1.length < 3) row1.push('');
  while (row2.length < 3) row2.push('');

  // Build the table cells
  const cells = [
    headerRow,
    row1,
    row2,
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
