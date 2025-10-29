/* global WebImporter */
export default function parse(element, { document }) {
  // The screenshot analysis expects 4 columns, but the HTML is a single empty div.
  // To match the screenshot analysis, create 4 empty cells (columns).
  const headerRow = ['Columns (columns58)'];
  const contentRow = ['', '', '', '']; // 4 columns as per screenshot
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
