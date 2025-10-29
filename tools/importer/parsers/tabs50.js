/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tab navigation list
  const nav = element.querySelector('.cmp-contentnavigation__list--primary');
  const tabItems = nav ? Array.from(nav.querySelectorAll('.cmp-contentnavigation__list-item')) : [];

  const rows = [['Tabs (tabs50)']];

  tabItems.forEach(item => {
    // Extract tab label
    const link = item.querySelector('.cmp-contentnavigation__list-link');
    const label = link ? link.textContent.trim() : '';
    // For this HTML, there is no associated tab content, so leave content cell blank
    rows.push([label, '']);
  });

  // Extract any additional text content outside the tab navigation
  // For this source, look for the Back to Navigation button
  const backBtn = element.querySelector('.a11y-button-back-to-nav');
  if (backBtn) {
    const btnText = backBtn.textContent.trim();
    if (btnText) {
      // Add as a separate row, not as a tab or tab content
      rows.push(['', btnText]);
    }
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
