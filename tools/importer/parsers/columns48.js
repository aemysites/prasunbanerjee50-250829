/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the <ul> with the columns
  const ul = element.querySelector('ul.ds2-sticky-sales-bar__item-wrapper');
  if (!ul) return;

  // 2. Find all <li> direct children (each is a column)
  const lis = Array.from(ul.children).filter(li => li.matches('li.ds2-sticky-sales-bar__item'));
  if (lis.length === 0) return;

  // 3. For each <li>, extract the <a> element (the whole column content)
  const columns = lis.map(li => {
    // Defensive: find the link, but if not, use the li itself
    const link = li.querySelector('a.ds2-sticky-sales-bar__link') || li;
    return link;
  });

  // 4. Build the table rows
  const headerRow = ['Columns (columns48)'];
  const columnsRow = columns;
  const cells = [headerRow, columnsRow];

  // 5. Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
