/* global WebImporter */
export default function parse(element, { document }) {
  // Tabs (tabs57) block: extract tab labels and their content panels
  const headerRow = ['Tabs (tabs57)'];
  const rows = [headerRow];

  // Find all tab items (li elements)
  const tabItems = element.querySelectorAll(':scope ul > li');

  tabItems.forEach((tabItem) => {
    // Tab label: find the button inside each li
    const tabButton = tabItem.querySelector('button[role="tab"]');
    let tabLabel = '';
    if (tabButton) {
      tabLabel = tabButton.textContent.trim();
    }

    // Tab content: find the description card
    const descCard = tabItem.querySelector('.rad-vertical-tabs__tabs-description-card');
    let tabContentParts = [];
    if (descCard) {
      // Header
      const header = descCard.querySelector('.rad-vertical-tabs__tabs-description-header');
      if (header) tabContentParts.push(header);
      // Sub-header
      const subHeader = descCard.querySelector('.rad-vertical-tabs__tabs-description-sub-header');
      if (subHeader) tabContentParts.push(subHeader);
      // Body
      const body = descCard.querySelector('.rad-vertical-tabs__tabs-description-body');
      if (body) tabContentParts.push(body);
      // CTA Button (anchor)
      const cta = descCard.querySelector('a.rad-vertical-tabs__tabs-description-button');
      if (cta) tabContentParts.push(cta);
      // Image
      const imageWrapper = descCard.querySelector('.cmp-image');
      if (imageWrapper) tabContentParts.push(imageWrapper);
    }
    // Defensive: if no card, fallback to any description
    if (!descCard) {
      const fallbackDesc = tabItem.querySelector('.rad-vertical-tabs__tabs-description');
      if (fallbackDesc) tabContentParts.push(fallbackDesc);
    }
    // Defensive: if no label, skip this row
    if (!tabLabel) return;
    rows.push([tabLabel, tabContentParts]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}