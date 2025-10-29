/* global WebImporter */
export default function parse(element, { document }) {
  // Find the menu containing the social icons
  const menu = element.querySelector('menu.cmp-list');
  if (!menu) return;

  // Each <li> contains an <a> with an <img>
  const items = Array.from(menu.querySelectorAll(':scope > li'));
  if (!items.length) return;

  // For each item, reference the anchor (with its image inside)
  const columns = items.map(li => {
    const a = li.querySelector('a');
    // Reference the existing anchor element (do not clone)
    return a || document.createTextNode('');
  });

  // Build the table rows
  const headerRow = ['Columns (columns103)'];
  const iconsRow = columns;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    iconsRow
  ], document);

  element.replaceWith(table);
}
