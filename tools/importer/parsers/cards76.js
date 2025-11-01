/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards76) block: 2 columns, multiple rows, each row = card (image, text)
  // Source HTML: 4 cards, each with only an image, no text content

  // Helper to get the image from a rad-layout-division__container
  function extractImageFromContainer(container) {
    // Find the first <img> inside this container
    const img = container.querySelector('img');
    return img || null;
  }

  // Find all card containers (rad-layout-division__container)
  const cardContainers = element.querySelectorAll('.rad-layout-division__container');

  // Build table rows
  const rows = [];
  // Header row (block name)
  rows.push(['Cards (cards76)']);

  // For each card, extract image and (empty) text cell
  cardContainers.forEach((container) => {
    const image = extractImageFromContainer(container);
    // Only add row if image is found
    if (image) {
      rows.push([image, '']); // Image in first cell, empty text cell
    }
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
