/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block guidelines
  const headerRow = ['Tabs (tabs14)'];

  // Find all tab buttons (tab headers), including hidden ones
  const tabButtons = Array.from(
    element.querySelectorAll('ol[role="tablist"] button[role="tab"]')
  );

  // Defensive: If no tab buttons found, do nothing
  if (!tabButtons.length) return;

  // For this HTML, there are no tab panels/content, only tab headers
  // So, per block spec, we must output tab label in col 1, and empty col 2
  const rows = tabButtons.map((btn) => {
    // Find the visible tab label (usually inside a span)
    let label = btn.querySelector('.cmp-tabs__tabtitle')?.textContent?.trim() || btn.textContent.trim();
    return [label, ''];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
