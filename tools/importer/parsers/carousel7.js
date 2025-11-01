/* global WebImporter */
export default function parse(element, { document }) {
  // The block expects a table with only the header row if no slides are present
  // There are no slides/images/text content in this HTML, only controls
  // So output only the header row
  const headerRow = ['Carousel (carousel7)'];
  const table = WebImporter.DOMUtils.createTable([headerRow], document);
  element.replaceWith(table);
}
