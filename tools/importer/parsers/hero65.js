/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: always use block name
  const headerRow = ['Hero (hero65)'];

  // Defensive: find the main content container
  // The source HTML nests content inside several divs, but the actual content is inside .rad-banner__content-container
  const contentContainer = element.querySelector('.rad-banner__content-container');

  // Find heading (h2), paragraph, and CTA button
  let heading = null;
  let subheading = null;
  let cta = null;

  if (contentContainer) {
    heading = contentContainer.querySelector('h2');
    subheading = contentContainer.querySelector('p');
    // The CTA button is an <a> inside .rad-banner__buttons
    const buttonsDiv = contentContainer.querySelector('.rad-banner__buttons');
    if (buttonsDiv) {
      cta = buttonsDiv.querySelector('a');
    }
  }

  // Find background image (if present)
  // In this example, there is no <img> element, so background image is decorative (SVG/CSS), not extractable
  // If an <img> is present in future variations, include it in the second row
  let backgroundImage = null;
  // Search for an image inside the banner block
  backgroundImage = element.querySelector('img');

  // Build table rows
  // Row 2: background image (optional)
  const backgroundRow = [backgroundImage ? backgroundImage : ''];

  // Row 3: content (heading, subheading, CTA)
  // Compose an array of present elements
  const contentCells = [];
  if (heading) contentCells.push(heading);
  if (subheading) contentCells.push(subheading);
  if (cta) contentCells.push(cta);

  const contentRow = [contentCells];

  // Compose the table
  const tableCells = [headerRow, backgroundRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
