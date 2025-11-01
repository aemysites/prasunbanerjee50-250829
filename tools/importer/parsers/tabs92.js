/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block requirements
  const headerRow = ['Tabs (tabs92)'];
  const rows = [headerRow];

  // Find the main tabs container
  const tabsContainer = element.querySelector('.rad-vertical-tabs__tabs');
  if (!tabsContainer) return;

  // Get all tab <li> elements
  const tabItems = tabsContainer.querySelectorAll('ul > li');

  tabItems.forEach((tabItem) => {
    // Tab label (button text)
    const tabButton = tabItem.querySelector('button[role="tab"]');
    let tabLabel = '';
    if (tabButton) {
      tabLabel = tabButton.textContent.trim();
    }

    // Tab content: find the description card
    const descCard = tabItem.querySelector('.rad-vertical-tabs__tabs-description-card');
    if (!descCard) {
      // If no card, skip this tab
      return;
    }

    // Remove close button from card (not needed in block)
    const closeBtn = descCard.querySelector('.rad-vertical-tabs__tabs-description-close-button');
    if (closeBtn) closeBtn.remove();

    // Remove duplicate sub-header if it matches header
    const header = descCard.querySelector('.rad-vertical-tabs__tabs-description-header');
    const subHeader = descCard.querySelector('.rad-vertical-tabs__tabs-description-sub-header');
    if (header && subHeader && header.textContent.trim() === subHeader.textContent.trim()) {
      subHeader.remove();
    }

    // Compose tab content: keep the card's children (header, sub-header if present, body, CTA, image)
    // We'll collect all children except the close button (already removed)
    const tabContentEls = Array.from(descCard.childNodes).filter(
      (node) => node.nodeType === 1 // ELEMENT_NODE
    );

    // Add row: [tab label, tab content]
    rows.push([
      tabLabel,
      tabContentEls
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
