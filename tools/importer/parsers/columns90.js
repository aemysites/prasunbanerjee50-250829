/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get direct children divs
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Find image column (usually first child)
  const imageDiv = children.find(div => div.classList.contains('rad-banner-image-and-text__image'));
  let imageEl = null;
  if (imageDiv) {
    imageEl = imageDiv.querySelector('img');
  }

  // Find text column (usually second child)
  const textDiv = children.find(div => div.classList.contains('rad-banner-image-and-text__text'));
  let textContent = [];
  if (textDiv) {
    // Title
    const titleEl = textDiv.querySelector('.rad-banner-image-and-text__text-title');
    if (titleEl) textContent.push(titleEl);
    // Description (may be a div or p)
    const descEl = textDiv.querySelector('.rad-banner-image-and-text__text-description');
    if (descEl) textContent.push(descEl);
    // CTA button (anchor)
    const ctaEl = textDiv.querySelector('a');
    if (ctaEl) textContent.push(ctaEl);
  }

  // Table header row
  const headerRow = ['Columns (columns90)'];
  // Table content row: [image, text]
  const contentRow = [imageEl, textContent];

  // Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
