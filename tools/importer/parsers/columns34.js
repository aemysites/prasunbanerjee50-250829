/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match block name exactly
  const headerRow = ['Columns (columns34)'];

  // Defensive: get the main content container
  const main = element.querySelector(':scope > div');
  if (!main) return;

  // Left column: heading + text
  // Heading is the first h3 inside the block
  const heading = main.querySelector('h3');
  // The descriptive text is inside .ds2-micro-story--textbox
  const textbox = main.querySelector('.ds2-micro-story--textbox');

  // Compose left column content
  const leftColumnContent = document.createElement('div');
  if (heading) leftColumnContent.appendChild(heading);
  if (textbox) {
    // Only reference, do not clone
    leftColumnContent.appendChild(textbox);
  }

  // Right column: image
  // The image is inside .ds2-micro-story--media-container
  const mediaContainer = main.querySelector('.ds2-micro-story--media-container');
  let image = '';
  if (mediaContainer) {
    const img = mediaContainer.querySelector('img');
    if (img) image = img; // Reference the actual element
  }

  // Build the columns row: text left, image right
  const columnsRow = [
    leftColumnContent,
    image
  ];

  // Table: header, then columns row
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  element.replaceWith(table);
}
