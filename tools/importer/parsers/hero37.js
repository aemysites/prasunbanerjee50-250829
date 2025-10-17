/* global WebImporter */
export default function parse(element, { document }) {
  // 1. HEADER ROW
  const headerRow = ['Hero (hero37)'];

  // 2. BACKGROUND IMAGE ROW
  // Find the first <img> inside the hero block (background image)
  let bgImg = null;
  const img = element.querySelector('.cmp-image__image');
  if (img) {
    bgImg = img;
  }

  // 3. CONTENT ROW
  // Instead of only looking for a specific container, gather all relevant elements in order
  let contentCell = [];

  // Title (headline)
  const title = element.querySelector('.cmp-title__text');
  if (title) contentCell.push(title);

  // Paragraph(s)
  const paragraphs = element.querySelectorAll('.cmp-text__paragraph');
  paragraphs.forEach(p => contentCell.push(p));

  // CTA Button (link)
  const cta = element.querySelector('a.cmp-button');
  if (cta) contentCell.push(cta);

  // TABLE ASSEMBLY
  const tableRows = [
    headerRow,
    [bgImg ? bgImg : ''],
    [contentCell.length ? contentCell : ''],
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
