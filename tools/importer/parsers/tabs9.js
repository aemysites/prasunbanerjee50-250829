/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block requirement
  const headerRow = ['Tabs (tabs9)'];

  // Find the main tabs container
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab buttons (tab headers)
  const tabButtons = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  );

  // Get all tab panels (tab content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: If mismatch, only process up to the minimum count
  const tabCount = Math.min(tabButtons.length, tabPanels.length);

  // Build rows: [Tab Label, Tab Content]
  const rows = [];
  for (let i = 0; i < tabCount; i++) {
    const btn = tabButtons[i];
    const panel = tabPanels[i];
    // Tab label: use textContent of button
    const tabLabel = btn.textContent.trim();
    // Tab content: use the whole panel content (preserves links, lists, etc)
    // Defensive: clone the panel so we don't mutate the original
    const panelClone = panel.cloneNode(true);
    // Remove aria-hidden attribute if present (for clarity)
    panelClone.removeAttribute('aria-hidden');
    rows.push([tabLabel, panelClone]);
  }

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
