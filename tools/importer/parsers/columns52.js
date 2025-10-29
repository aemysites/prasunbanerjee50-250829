/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns52)'];

  // Left column: image
  const leftCol = element.querySelector('.ds2-model-brief--copy');
  let imageEl = null;
  if (leftCol) {
    imageEl = leftCol.querySelector('img');
  }

  // Right column: specs as 4 rows (label/value) and button, NO nested table
  const rightCol = element.querySelector('.ds2-model-brief--table');
  const rightColRows = [];

  // Extract specs as 4 rows (arrays of [label, value])
  if (rightCol) {
    const specRows = rightCol.querySelectorAll('table tr');
    specRows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length === 2) {
        let label = '';
        let value = '';
        const labelDiv = cells[0].querySelector('.ds2-cms-output p');
        const valueDiv = cells[1].querySelector('.ds2-cms-output p');
        if (labelDiv) {
          label = labelDiv.textContent.trim();
        } else {
          label = cells[0].textContent.trim();
        }
        if (valueDiv) {
          value = valueDiv.textContent.trim();
        } else {
          value = cells[1].textContent.trim();
        }
        rightColRows.push([label, value]);
      }
    });
  }

  // Get the button (CTA)
  let buttonEl = null;
  if (rightCol) {
    const buttonList = rightCol.querySelector('.ds2-buttonlist');
    if (buttonList) {
      buttonEl = buttonList.querySelector('a');
    }
  }

  // Compose right column content: specs as 4 rows + button
  // Each row is an array of [label, value], last row is button
  const rightColContent = rightColRows.map(([label, value]) => {
    const rowDiv = document.createElement('div');
    rowDiv.innerHTML = `<span>${label}</span> <strong>${value}</strong>`;
    return rowDiv;
  });
  if (buttonEl) rightColContent.push(buttonEl);

  // Build the table rows
  const rows = [
    headerRow,
    [imageEl, rightColContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
