/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the menu of social icons
  const menu = element.querySelector('menu.cmp-list');
  if (!menu) return;
  const items = Array.from(menu.children).filter(li => li.tagName === 'LI');
  if (!items.length) return;

  // Each column is a social icon link (anchor with image)
  const columns = items.map(li => {
    const link = li.querySelector('a');
    const img = link ? link.querySelector('img') : null;
    // Only reference existing elements, do not clone
    if (link && img) {
      // Remove loading class for cleanliness
      img.classList.remove('loading');
      return link;
    }
    if (img) return img;
    return '';
  });

  // Columns block header must match exactly
  const headerRow = ['Columns (columns27)'];
  const contentRow = columns;

  // Create the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
