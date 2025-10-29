/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Tabs (tabs62)'];

  // Get all tab buttons (tab triggers)
  const tabButtons = element.querySelectorAll('button[role="tab"]');

  if (!tabButtons.length) return;

  // For each tab, output label and leave content cell empty (since no content in source HTML)
  const rows = Array.from(tabButtons).map((btn) => {
    const labelSpan = btn.querySelector('.cmp-tabs__tabtitle');
    const label = labelSpan ? labelSpan.textContent.trim() : btn.textContent.trim();
    return [label, ''];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
