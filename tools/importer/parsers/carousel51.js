/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel slide container
  const colorswitch = element.querySelector('.cmp-colorswitch');
  if (!colorswitch) return;

  // Find the main car image (first .cmp-colorswitch__image with data-selected="true")
  const imageWrapper = colorswitch.querySelector('.cmp-colorswitch__image-wrapper');
  let mainImage = null;
  if (imageWrapper) {
    mainImage = imageWrapper.querySelector('.cmp-colorswitch__image[data-selected="true"]');
  }

  // Find the color label text
  const colorLabel = colorswitch.querySelector('.cmp-colorswitch__title');

  // Find the color swatches row
  const swatchList = colorswitch.querySelector('.cmp-colorswitch__swatches-elements');

  // Find the CTA button ("Drugi spoljni detalji")
  // It's outside the colorswitch block, in the next container
  let ctaButton = null;
  const nextContainer = element.querySelector('.container.responsivegrid.style-container--center');
  if (nextContainer) {
    ctaButton = nextContainer.querySelector('button.cmp-button');
  }

  // Compose the text cell: color label, swatch row, CTA button
  const textCellContent = [];
  if (colorLabel) textCellContent.push(colorLabel.cloneNode(true));
  if (swatchList) textCellContent.push(swatchList.cloneNode(true));
  if (ctaButton) textCellContent.push(ctaButton.cloneNode(true));

  // Build the table rows
  const headerRow = ['Carousel (carousel51)'];
  const rows = [headerRow];

  // Only add the slide if we have an image
  if (mainImage) {
    rows.push([
      mainImage.cloneNode(true),
      textCellContent
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
