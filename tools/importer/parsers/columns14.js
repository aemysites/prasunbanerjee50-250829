/* global WebImporter */
export default function parse(element, { document }) {
  // Find the fourcellblock container
  const fourCellBlock = element.querySelector('.fourcellblock, .cmp-fourcellblock');
  if (!fourCellBlock) return;

  const cmpFourCell = fourCellBlock.querySelector('.cmp-four-cell');
  if (!cmpFourCell) return;

  // --- First row: block header ---
  const headerRow = ['Columns (columns14)'];

  // --- Second row: two columns ---
  // Left column: Title, paragraphs, button
  const leftColContent = [];
  // Title
  const titleEl = cmpFourCell.querySelector('.cmp-four-cell__first-row .cmp-title h2');
  if (titleEl) leftColContent.push(titleEl);

  // Text paragraphs
  const textEl = cmpFourCell.querySelector('.cmp-four-cell__second-row .cmp-text');
  if (textEl) {
    const paragraphs = Array.from(textEl.querySelectorAll('p'));
    paragraphs.forEach(p => leftColContent.push(p));
  }

  // Button
  const buttonEl = cmpFourCell.querySelector('.cmp-four-cell__second-row .cmp-button');
  if (buttonEl) leftColContent.push(buttonEl);

  // Right column: Image
  const rightColContent = [];
  const imageEl = cmpFourCell.querySelector('.cmp-four-cell__second-row .cmp-image img');
  if (imageEl) rightColContent.push(imageEl);

  // Compose table rows
  const rows = [
    headerRow,
    [leftColContent, rightColContent]
  ];

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
