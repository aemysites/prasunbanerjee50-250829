/* global WebImporter */
export default function parse(element, { document }) {
  // There is no content to embed: create a table with header and empty content row
  const headerRow = ['Embed (embedVideo8)'];
  const contentRow = [''];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);
  element.replaceWith(table);
}
