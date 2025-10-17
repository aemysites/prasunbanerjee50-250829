/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Columns (columns31)'];

  // 2. Find the two main columns: left=image, right=text
  // The first .aem-Grid > .container is the left (image), the second is the right (text)
  const containers = element.querySelectorAll('.aem-GridColumn');
  const leftCol = Array.from(containers).find(c => c.className.match(/large--7/));
  const rightCol = Array.from(containers).find(c => c.className.match(/large--5/));

  // 2.1. Extract image element from leftCol
  let imageEl = null;
  if (leftCol) {
    const img = leftCol.querySelector('img');
    if (img) {
      const pic = img.closest('picture');
      imageEl = pic ? pic.cloneNode(true) : img.cloneNode(true);
    }
  }

  // 2.2. Extract text content from rightCol
  let textContent = null;
  if (rightCol) {
    // Find the title and text blocks
    const titleBlock = rightCol.querySelector('.cmp-title');
    const textBlock = rightCol.querySelector('.cmp-text');
    const frag = document.createDocumentFragment();
    if (titleBlock) {
      const h = titleBlock.querySelector('h1,h2,h3,h4,h5,h6');
      if (h) frag.appendChild(h.cloneNode(true));
    }
    if (textBlock) {
      Array.from(textBlock.children).forEach(child => {
        frag.appendChild(child.cloneNode(true));
      });
    }
    // Only assign if we actually have content
    if (frag.childNodes.length > 0) {
      textContent = frag;
    }
  }

  // 3. Compose the table
  const tableRows = [
    headerRow,
    [imageEl, textContent],
  ];

  // 4. Create and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
