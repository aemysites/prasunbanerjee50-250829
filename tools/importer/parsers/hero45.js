/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero45)'];

  // 2. Background image row (none in this case)
  const bgImageRow = [''];

  // 3. Content row: headline, subheading, CTA
  const contentCell = [];

  // Find the headline (h1)
  const headline = element.querySelector('.rad-header__headline');
  if (headline) contentCell.push(headline);

  // Find the subheading (h1 with sub-headline class)
  const subheading = element.querySelector('.rad-header__sub-headline');
  if (subheading) contentCell.push(subheading);

  // Find the CTA link (a)
  const cta = element.querySelector('a');
  if (cta) contentCell.push(cta);

  const contentRow = [contentCell];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImageRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
