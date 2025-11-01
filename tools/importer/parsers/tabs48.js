/* global WebImporter */
export default function parse(element, { document }) {
  // Tabs (tabs48) block: extract tab labels, no tab content in this HTML
  // 1. Header row
  const headerRow = ['Tabs (tabs48)'];

  // 2. Find all tab buttons (tab labels)
  const tabButtons = Array.from(element.querySelectorAll('button[role="tab"]'));

  // 3. For each tab, create a row: [label, content]. No content panels present, so leave content cell empty.
  const rows = tabButtons.map(btn => {
    // Use the button's text content as the tab label
    const label = btn.textContent.trim();
    // No content panels in this HTML, so content cell is empty
    return [label, ''];
  });

  // 4. Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // 5. Replace the original element with the new table
  element.replaceWith(table);
}
