/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero98)'];

  // 2. Extract the background image (the main hero image)
  let heroImg = null;
  // Find the first <img> inside a .cmp-image__image or .cmp-image
  const imgEl = element.querySelector('.cmp-image__image') || element.querySelector('.cmp-image img');
  if (imgEl) {
    heroImg = imgEl;
  }

  // 3. Extract the hero text content
  // Find the main title (h2 or h1)
  let title = null;
  const titleEl = element.querySelector('.cmp-title__text, h1, h2, h3');
  if (titleEl) {
    title = titleEl;
  }

  // Find the supporting paragraph (body text)
  let body = null;
  const bodyEl = element.querySelector('.cmp-text__paragraph, .cmp-text p, p');
  if (bodyEl) {
    body = bodyEl;
  }

  // Compose the content cell for row 3
  const contentCell = [];
  if (title) contentCell.push(title);
  if (body) contentCell.push(body);

  // 4. Build the table rows
  const rows = [
    headerRow,
    [heroImg ? heroImg : ''],
    [contentCell]
  ];

  // 5. Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace the original element
  element.replaceWith(block);
}
