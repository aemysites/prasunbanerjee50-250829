/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns61)'];

  // Helper to extract text content from a KPI cell
  function extractKPIText(cell) {
    if (!cell) return '';
    // Try to get value and unit
    const value = cell.querySelector('.cmp-carKPIs__value');
    const unit = cell.querySelector('.cmp-carKPIs__unit');
    let text = '';
    if (value) text += value.textContent.trim();
    if (unit) text += ' ' + unit.textContent.trim();
    return text.trim();
  }

  // Helper to extract label text
  function extractLabelText(cell) {
    if (!cell) return '';
    const label = cell.querySelector('.cmp-carKPIs__label-text');
    return label ? label.textContent.trim() : cell.textContent.trim();
  }

  let valuesRow = [];
  let labelsRow = [];

  // Try desktop table first
  const desktopTable = element.querySelector('.cmp-carKPIs__desktop-only .cmp-carKPIs__table');
  if (desktopTable) {
    const valueRow = desktopTable.querySelector('tbody > tr:first-child');
    const labelRow = desktopTable.querySelector('tbody > tr:nth-child(2)');
    if (valueRow && labelRow) {
      const valueCells = valueRow.querySelectorAll('td.cmp-carKPIs__content');
      const labelCells = labelRow.querySelectorAll('td.cmp-carKPIs__label');
      // Extract text for each column
      valuesRow = Array.from(valueCells).map(cell => extractKPIText(cell.querySelector('.cmp-carKPIs__text-section')));
      labelsRow = Array.from(labelCells).map(cell => extractLabelText(cell));
    }
  } else {
    // Fallback: Use mobile table structure
    const mobileTable = element.querySelector('.cmp-carKPIs__mobile-only .cmp-carKPIs__table');
    if (mobileTable) {
      const rows = mobileTable.querySelectorAll('tbody > tr');
      for (let i = 0; i < rows.length; i += 2) {
        const valueCell = rows[i].querySelector('.cmp-carKPIs__text-section');
        const labelCell = rows[i+1] ? rows[i+1].querySelector('.cmp-carKPIs__label') : null;
        valuesRow.push(extractKPIText(valueCell));
        labelsRow.push(extractLabelText(labelCell));
      }
    }
  }

  // Find the button/link below the KPIs
  let buttonWrapper = element.querySelector('.cmp-carKPIs__button-wrapper');
  let button = null;
  if (buttonWrapper) {
    button = buttonWrapper.querySelector('a');
  }

  // Create the block table (header, values, labels)
  const rows = [
    headerRow,
    valuesRow,
    labelsRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);

  // Place the button below the table if it exists
  if (button) {
    block.parentNode.insertBefore(button, block.nextSibling);
  }
}
