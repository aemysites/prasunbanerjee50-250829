/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main drivetrain switch block
  const drivetrain = element.querySelector('.cmp-drivetrain-switch');
  if (!drivetrain) return;

  // Table header row: always use block name
  const headerRow = ['Table (table73)'];

  // Extract technical data table rows as label-value pairs
  const techTable = drivetrain.querySelector('.cmp-technicaldata__table');
  let specRows = [];
  if (techTable) {
    const rows = techTable.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length === 2) {
        let label = '';
        let value = '';
        const labelDiv = cells[0].querySelector('.cmp-text__paragraph');
        if (labelDiv) {
          label = labelDiv.textContent.trim();
        } else {
          label = cells[0].textContent.trim();
        }
        const valueDiv = cells[1].querySelector('.cmp-text__paragraph');
        if (valueDiv) {
          value = valueDiv.textContent.trim();
        } else {
          value = cells[1].textContent.trim();
        }
        specRows.push([label, value]);
      }
    });
  }

  // Compose table rows: header, then technical data as label-value pairs
  const tableRows = [
    headerRow,
    ...specRows
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
