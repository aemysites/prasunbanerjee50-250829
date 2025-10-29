/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns92)'];

  // Defensive: Get all top-level grid columns
  // This will find the two main columns: image and text
  const gridColumns = Array.from(element.querySelectorAll(':scope > div > div > div > div > div > div > div'));

  let imageCell = null;
  let textCell = document.createElement('div');

  // Find image (left column)
  for (const col of gridColumns) {
    const img = col.querySelector('img');
    if (img) {
      imageCell = img;
      break;
    }
  }

  // Find text (right column)
  for (const col of gridColumns) {
    // Look for title and text blocks
    const title = col.querySelector('.cmp-title__text');
    const text = col.querySelector('.cmp-text__paragraph');
    if (title || text) {
      // Always create a new container for text cell to avoid referencing same node
      const textContainer = document.createElement('div');
      if (title) textContainer.appendChild(title);
      if (text) textContainer.appendChild(text);
      textCell = textContainer;
      break;
    }
  }

  // Edge case: If imageCell or textCell is missing, ensure table still has correct columns
  const rowCells = [imageCell || '', textCell || ''];

  // Build the table rows
  const cells = [
    headerRow,
    rowCells
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
