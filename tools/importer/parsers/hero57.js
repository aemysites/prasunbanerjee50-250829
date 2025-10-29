/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero57)'];

  // 2. Background image row (leave empty, as in source HTML)
  const bgRow = [''];

  // 3. Content row: headline, subheading, CTA(s), quick facts, overlay card
  const container = element.querySelector('.ds2-stage-presentation--keyvisual-cta-container');
  let contentElements = [];

  if (container) {
    // Title (THE 7)
    const title = container.querySelector('.ds2-stage-presentation--keyvisual-title');
    if (title) contentElements.push(title);

    // Subheading (POTPUNO NOVI BMW SERIJE 7 LIMUZINA.)
    const subheading = container.querySelector('.ds2-stage-presentation--keyvisual-subtitle');
    if (subheading) contentElements.push(subheading);

    // Only one set of CTA buttons (prefer desktop, fallback to tablet)
    let ctaList = null;
    const ctaDesktop = container.querySelector('.show-for-desktop-only');
    if (ctaDesktop) {
      const lis = Array.from(ctaDesktop.querySelectorAll('li'));
      if (lis.length) {
        const ul = document.createElement('ul');
        lis.forEach(li => ul.appendChild(li));
        ctaList = ul;
      }
    } else {
      const ctaTablet = container.querySelector('.show-for-tablet-only ul.ds2-buttonlist');
      if (ctaTablet) ctaList = ctaTablet;
    }
    if (ctaList) contentElements.push(ctaList);

    // Quick facts table (always include)
    const quickFacts = container.querySelector('.show-for-tablet-mobile table.quick-facts-data');
    if (quickFacts) contentElements.push(quickFacts);
  }

  // Compose the content row
  const contentRow = [contentElements];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
