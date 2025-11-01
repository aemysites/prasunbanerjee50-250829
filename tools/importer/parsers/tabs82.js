/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get tab labels and content panels
  function getTabsAndPanels(root) {
    // Find tab triggers (buttons)
    const tablist = root.querySelector('[role="tablist"]');
    const tabButtons = tablist ? Array.from(tablist.querySelectorAll('[role="tab"]')) : [];
    // Find tab panels
    const tabPanels = Array.from(root.querySelectorAll('[role="tabpanel"]'));
    // Defensive: Only match tabs to panels if counts are equal
    // If not, fallback to matching by aria-controls/id
    let tabs = [];
    tabButtons.forEach((btn) => {
      // Try to find the corresponding panel
      let panel = tabPanels.find(p => p.id === btn.getAttribute('aria-controls'));
      if (panel) {
        tabs.push({
          label: btn.textContent.trim(),
          panel
        });
      }
    });
    return tabs;
  }

  // Extract tab data
  const tabsData = getTabsAndPanels(element);

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs82)']);

  // For each tab, extract label and content
  tabsData.forEach(({ label, panel }) => {
    // For tab content, try to get the main content area
    // Defensive: find all direct children with meaningful content
    // For this block, content is typically a two-column layout (text + image)
    let leftContent = null;
    let rightContent = null;
    // Try to find layout division containers
    const divisionContainers = panel.querySelectorAll('.rad-layout-division__container');
    if (divisionContainers.length === 2) {
      // Left: text, Right: image/media
      leftContent = divisionContainers[0];
      rightContent = divisionContainers[1];
    } else {
      // Fallback: use all content
      leftContent = panel;
      rightContent = null;
    }
    // Compose tab content cell
    let tabContentCell;
    if (rightContent) {
      tabContentCell = [leftContent, rightContent];
    } else {
      tabContentCell = [leftContent];
    }
    rows.push([
      label,
      tabContentCell
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
