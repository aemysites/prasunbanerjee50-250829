/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row for Tabs block
  const headerRow = ['Tabs (tabs66)'];

  // Find the navigation list containing tab labels
  const nav = element.querySelector('.cmp-scrollnavigation__nav');
  const list = nav && nav.querySelector('.cmp-scrollnavigation__list');
  const tabRows = [];

  if (list) {
    // Each list item is a tab
    list.querySelectorAll('.cmp-scrollnavigation__list-item').forEach((li) => {
      // Tab label: get the tooltip span text
      const labelSpan = li.querySelector('.cmp-scrollnavigation__list-item-tooltip');
      let tabLabel = labelSpan ? labelSpan.textContent.trim() : '';
      // Tab content: no additional content in source, so leave empty
      tabRows.push([tabLabel, '']);
    });
  }

  // Compose table rows: header + tab rows
  const rows = [headerRow, ...tabRows];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
