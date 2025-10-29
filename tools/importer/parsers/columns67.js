/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns67)'];

  // Find the image element
  const image = element.querySelector('.cmp-image__wrapper img');

  // Find the content wrapper
  const contentWrapper = element.querySelector('.cmp-textmediateaser__content');

  // Extract left and right column content
  let leftCol, rightCol;

  if (contentWrapper) {
    // Left column: image + heading (h2)
    const title = contentWrapper.querySelector('.cmp-textmediateaser__title');
    leftCol = document.createElement('div');
    if (image) leftCol.appendChild(image.cloneNode(true));
    if (title) leftCol.appendChild(title.cloneNode(true));

    // Right column: description (div)
    const description = contentWrapper.querySelector('.cmp-textmediateaser__description');
    rightCol = description ? description.cloneNode(true) : document.createElement('div');
  } else {
    // Fallback: Use first and second child divs if contentWrapper missing
    const children = element.querySelectorAll(':scope > div');
    leftCol = document.createElement('div');
    if (image) leftCol.appendChild(image.cloneNode(true));
    if (children[0]) leftCol.appendChild(children[0].cloneNode(true));
    rightCol = children[1] ? children[1].cloneNode(true) : document.createElement('div');
  }

  // Build the table: header row, then columns row
  const rows = [
    headerRow,
    [leftCol, rightCol]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
