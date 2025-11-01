/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns35)'];

  // Defensive: find the main content container
  const content = element.querySelector('.content');
  if (!content) return;

  // Each column is a direct child (div) of .content, separated by .divider
  // We'll collect all direct children that are not dividers
  const columns = [];
  content.childNodes.forEach((node) => {
    if (node.nodeType === 1 && node.tagName === 'DIV' && !node.classList.contains('divider')) {
      // Each column div contains a single <a> link with icon and text
      const link = node.querySelector('a');
      if (link) {
        // For robustness, use the entire link element as the column content
        columns.push(link);
      }
    }
  });

  if (columns.length === 0) return;

  // Build the table rows
  const rows = [headerRow, columns];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
