/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content (left column) and the graphic (right column)
  const root = element.querySelector('.rad-footer');
  if (!root) return;

  // Left column: extract heading, two columns of links, copyright
  const main = root.querySelector('.rad-footer__main');
  let leftCol;
  if (main) {
    const frag = document.createDocumentFragment();
    // Heading
    const heading = main.querySelector('.rad-footer__title');
    if (heading) frag.appendChild(heading.cloneNode(true));

    // Links: two columns of links as two <ul> columns
    const linksContainer = main.querySelector('.rad-footer__links-container');
    if (linksContainer) {
      const columns = Array.from(linksContainer.querySelectorAll('.rad-footer__links-column'));
      const grid = document.createElement('div');
      grid.style.display = 'flex';
      grid.style.gap = '2em';
      columns.forEach(col => {
        const ul = document.createElement('ul');
        col.querySelectorAll('li').forEach(li => {
          ul.appendChild(li.cloneNode(true));
        });
        grid.appendChild(ul);
      });
      frag.appendChild(grid);
    }
    // Copyright
    const copyright = main.querySelector('.rad-footer__copyright');
    if (copyright) frag.appendChild(copyright.cloneNode(true));
    leftCol = frag;
  } else {
    leftCol = root.cloneNode(true);
  }

  // Right column: graphic
  const lottie = root.querySelector('.rad-footer__lottie-positioner');
  const rightCol = lottie ? lottie.cloneNode(true) : null;

  // Build the columns block table
  const headerRow = ['Columns (columns34)'];
  const columnsRow = [leftCol, rightCol].filter(Boolean);

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  element.replaceWith(table);
}
