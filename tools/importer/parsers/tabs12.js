/* global WebImporter */
export default function parse(element, { document }) {
  // Only include the header row since the screenshot is blank and there is no visible content
  const rows = [['Tabs (tabs12)']];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
