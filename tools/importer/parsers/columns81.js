/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main columns by .rad-layout-division__container
  const containers = element.querySelectorAll('.rad-layout-division__container');
  if (containers.length < 2) {
    // fallback: just wrap all content in one column
    const headerRow = ['Columns (columns81)'];
    const contentRow = [element.innerHTML];
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      contentRow
    ], document);
    element.replaceWith(table);
    return;
  }

  // LEFT COLUMN: Editorial text (extract only the editorial text block)
  let leftContent = null;
  const leftEditorial = containers[0].querySelector('.editorialtext, .rad-absorb-editorial-text');
  if (leftEditorial) {
    leftContent = document.createElement('div');
    // Move all paragraphs (preserve structure)
    leftEditorial.querySelectorAll('p').forEach(p => leftContent.appendChild(p.cloneNode(true)));
  } else {
    // fallback: all text content
    leftContent = containers[0].cloneNode(true);
  }

  // RIGHT COLUMN: Media block (image with caption and link)
  let rightContent = null;
  // Find the anchor that wraps the image and caption
  const mediaAnchor = containers[1].querySelector('.rad-media--anchored__link');
  if (mediaAnchor) {
    rightContent = document.createElement('div');
    // Reference the actual anchor element (do not clone)
    rightContent.appendChild(mediaAnchor);
  } else {
    // fallback: just use the first image
    const img = containers[1].querySelector('img');
    if (img) {
      rightContent = document.createElement('div');
      rightContent.appendChild(img);
    } else {
      // fallback: all content
      rightContent = containers[1].cloneNode(true);
    }
  }

  // Build the table
  const headerRow = ['Columns (columns81)'];
  const contentRow = [leftContent, rightContent];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
