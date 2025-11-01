/* global WebImporter */
export default function parse(element, { document }) {
  // --- Step 1: Table header row ---
  const headerRow = ['Hero (hero71)'];

  // --- Step 2: Background image row (none in this case) ---
  // Screenshot and HTML show NO image in this hero block
  const imageRow = ['']; // Empty cell for background image (optional)

  // --- Step 3: Content row ---
  // Find the main content container (the first rad-layout-division__container)
  const containers = element.querySelectorAll('.rad-layout-division__container');

  // Defensive: If containers not found, fallback to element
  const mainContentContainer = containers[0] || element;

  // Find heading (h2) and all paragraphs
  const editorial = mainContentContainer.querySelector('.editorialtext, .rad-absorb-editorial-text') || mainContentContainer;
  const heading = editorial.querySelector('h2');
  const paragraphs = editorial.querySelectorAll('p');

  // Collect text content elements
  const textElements = [];
  if (heading) textElements.push(heading);
  paragraphs.forEach(p => textElements.push(p));

  // Find CTA button (anchor)
  let ctaAnchor = null;
  if (containers.length > 1) {
    // Second container likely holds CTA
    ctaAnchor = containers[1].querySelector('a[href]');
  } else {
    // Fallback: search anywhere for a CTA anchor
    ctaAnchor = element.querySelector('a[href]');
  }

  // Compose content cell
  const contentCell = [];
  if (textElements.length) {
    contentCell.push(...textElements);
  }
  if (ctaAnchor) {
    contentCell.push(ctaAnchor);
  }

  // --- Step 4: Table assembly ---
  const cells = [
    headerRow,
    imageRow,
    [contentCell]
  ];

  // --- Step 5: Create and replace ---
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
