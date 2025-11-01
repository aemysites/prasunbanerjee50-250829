/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns72)'];

  // Defensive: Find the main container for image and text
  const mainContainer = element.querySelector('.rad-banner-image-and-text__container');
  if (!mainContainer) return;

  // Extract image (right column)
  const imageContainer = mainContainer.querySelector('.rad-banner-image-and-text__image');
  let imageEl = null;
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Extract text content (left column)
  const textContainer = mainContainer.querySelector('.rad-banner-image-and-text__text');
  let textContentEls = [];
  if (textContainer) {
    // Gather all children (title, description, button)
    textContentEls = Array.from(textContainer.children);
  }

  // Build the second row: [text column, image column]
  const secondRow = [
    textContentEls, // left column: all text elements (title, description, button)
    imageEl ? [imageEl] : [] // right column: image element
  ];

  // Compose the table
  const cells = [headerRow, secondRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
