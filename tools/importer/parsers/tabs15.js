/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tab list
  const tabList = element.querySelector('ul[role="tablist"], ul.rad-vertical-tabs__tabs-list');
  if (!tabList) return;
  const tabItems = Array.from(tabList.children).filter(li => li.matches('li'));

  // Compose header row
  const headerRow = ['Tabs (tabs15)'];
  const rows = [headerRow];

  tabItems.forEach(li => {
    // Tab label: get text content from button or anchor
    let tabLabelEl = li.querySelector('button[role="tab"], a[role="tab"], a.rad-vertical-tabs__tabs-list-entry, button.rad-vertical-tabs__tabs-list-entry');
    let tabLabel = '';
    if (tabLabelEl) {
      tabLabel = tabLabelEl.textContent.trim();
    }

    // Tab content: get the description-positioner div
    const descPositioner = li.querySelector('.rad-vertical-tabs__tabs-description-positioner');
    let tabContent = '';
    if (descPositioner) {
      // The actual content is inside .rad-vertical-tabs__tabs-description
      const descPanel = descPositioner.querySelector('.rad-vertical-tabs__tabs-description');
      if (descPanel) {
        // The card is inside .rad-vertical-tabs__tabs-description-card
        const card = descPanel.querySelector('.rad-vertical-tabs__tabs-description-card');
        if (card) {
          // Remove close button if present
          const closeBtn = card.querySelector('.rad-vertical-tabs__tabs-description-close-button');
          if (closeBtn) closeBtn.remove();
          // Compose content: body, button, image (preserve structure)
          const contentParts = [];
          // Body (all paragraphs)
          const body = card.querySelector('.rad-vertical-tabs__tabs-description-body');
          if (body) {
            contentParts.push(body.cloneNode(true));
          }
          // Button (Mehr erfahren)
          const button = card.querySelector('a.rad-button, a.rad-vertical-tabs__tabs-description-button');
          if (button) {
            contentParts.push(button.cloneNode(true));
          }
          // Image
          const imageWrap = card.querySelector('[data-cmp-is="image"]');
          if (imageWrap) {
            contentParts.push(imageWrap.cloneNode(true));
          }
          tabContent = contentParts.length === 1 ? contentParts[0] : contentParts;
        }
      }
    }
    rows.push([
      tabLabel || '',
      tabContent || ''
    ]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
