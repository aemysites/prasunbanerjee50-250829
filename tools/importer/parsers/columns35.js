/* global WebImporter */
export default function parse(element, { document }) {
  // Columns (columns35) block: extract all visible text content from the source html
  // Header row
  const headerRow = ['Columns (columns35)'];

  // Find all visible text nodes (e.g., button text)
  const textNodes = [];
  element.querySelectorAll('*').forEach((el) => {
    if (el.childNodes.length) {
      el.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          textNodes.push(node.textContent.trim());
        }
      });
    }
  });

  // If any text content found, put each in its own column
  let rows;
  if (textNodes.length) {
    rows = [headerRow, textNodes];
  } else {
    rows = [headerRow];
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
