/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero104) block: 1 column, 3 rows (header, image, content)
  // 1. Header row
  const headerRow = ['Hero (hero104)'];

  // 2. Background image row: leave blank (no image in provided HTML)
  const imageRow = [''];

  // 3. Content row: extract all text content from the provided HTML only
  const contentFrag = document.createDocumentFragment();
  // Extract all h2s (the only headings present)
  const h2s = element.querySelectorAll('h2');
  h2s.forEach(h2 => {
    const clone = document.createElement('h2');
    clone.textContent = h2.textContent;
    contentFrag.appendChild(clone);
  });

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    [contentFrag]
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
