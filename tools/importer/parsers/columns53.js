/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the columns53 block
  const headerRow = ['Columns (columns53)'];

  // Get the two main columns: image and text
  // Defensive: select immediate children
  const children = element.querySelectorAll(':scope > div');

  let imageCol = null;
  let textCol = null;

  // Identify image and text columns
  children.forEach((child) => {
    if (child.classList.contains('rad-banner-image-and-text__image')) {
      imageCol = child;
    } else if (child.classList.contains('rad-banner-image-and-text__text')) {
      textCol = child;
    }
  });

  // Fallback if classes are missing: assume order (image first, text second)
  if (!imageCol && children.length > 0) imageCol = children[0];
  if (!textCol && children.length > 1) textCol = children[1];

  // Prepare the columns row
  const columnsRow = [imageCol, textCol];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
