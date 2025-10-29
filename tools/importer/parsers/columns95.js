/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Columns (columns95)'];

  // 2. Get the thumbnail images from the carousel
  // The images are inside: ul.category-list > li.thumbnail-item > button > div > img
  // Defensive: find the ul with class 'category-list' (should be unique in block)
  const ul = element.querySelector('ul.category-list');
  let columnsRow = [];
  if (ul) {
    // Get all li.thumbnail-item (each contains a button > div > img)
    const items = ul.querySelectorAll('li.thumbnail-item');
    columnsRow = Array.from(items).map(li => {
      // Find the image inside
      const img = li.querySelector('img');
      // Defensive: only include if img exists
      return img ? img : '';
    });
  }

  // 3. Build the table rows
  const rows = [headerRow, columnsRow];

  // 4. Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // 5. Replace the original element with the block table
  element.replaceWith(block);
}
