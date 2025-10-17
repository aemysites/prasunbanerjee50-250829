/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Prepare columns array
  const columns = [];

  // --- Column 1: Image ---
  // Reference the actual image element, not a clone
  const imageCol = grid.querySelector('.image');
  let imageEl = null;
  if (imageCol) {
    imageEl = imageCol.querySelector('img');
    if (imageEl) {
      columns.push(imageEl);
    } else {
      columns.push('');
    }
  } else {
    columns.push('');
  }

  // --- Column 2: Text ---
  const textCol = grid.querySelector('.text');
  let textEl = null;
  if (textCol) {
    // Use the actual paragraph element, preserving semantic meaning
    textEl = textCol.querySelector('p, .cmp-text__paragraph');
    if (textEl) {
      columns.push(textEl);
    } else {
      columns.push('');
    }
  } else {
    columns.push('');
  }

  // --- Column 3: Button ---
  // Button is inside a nested container > grid > button
  let buttonEl = null;
  const buttonContainer = grid.querySelector('.container .aem-Grid .button');
  if (buttonContainer) {
    buttonEl = buttonContainer.querySelector('a');
    if (buttonEl) {
      columns.push(buttonEl);
    } else {
      columns.push('');
    }
  } else {
    columns.push('');
  }

  // Header row: Always use the block name exactly
  const headerRow = ['Columns (columns1)'];
  const contentRow = columns;
  const cells = [headerRow, contentRow];

  // Create the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
