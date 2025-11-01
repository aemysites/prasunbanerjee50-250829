/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns43)'];

  // Defensive: Get the three main sections
  const logoDiv = element.querySelector('.cmp-global-footer__logo');
  const linksDiv = element.querySelector('.cmp-global-footer__links');
  const shareDiv = element.querySelector('.cmp-global-footer__share');

  // 1. Logo cell: use the entire logo div (contains anchor and img)
  let logoCell = '';
  if (logoDiv) {
    logoCell = logoDiv;
  }

  // 2. Links cell: use the entire links div (contains all nav links)
  let linksCell = '';
  if (linksDiv) {
    linksCell = linksDiv;
  }

  // 3. Social icons cell: use the entire share div (contains all social icons)
  let shareCell = '';
  if (shareDiv) {
    shareCell = shareDiv;
  }

  // Build the columns row: logo | links | social
  const columnsRow = [logoCell, linksCell, shareCell];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
