/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Columns (columns100)'];

  // 2. Find the main grid containing the two columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const containers = Array.from(grid.children).filter(child => child.classList.contains('container'));
  if (containers.length < 2) return;

  // --- LEFT COLUMN (image) ---
  // Reference the first <img> in the left container
  let leftImage = null;
  const leftImgs = containers[0].querySelectorAll('img');
  if (leftImgs.length > 0) {
    leftImage = leftImgs[0]; // Reference, do not clone
  }

  // --- RIGHT COLUMN (title, text, list, button) ---
  // Gather all content elements in order
  const rightColContent = document.createElement('div');
  // Title
  const title = containers[1].querySelector('.cmp-title__text');
  if (title) rightColContent.appendChild(title);
  // Text block (paragraphs and lists)
  const textBlock = containers[1].querySelector('.cmp-text');
  if (textBlock) {
    // Append all children of textBlock to preserve structure
    Array.from(textBlock.childNodes).forEach(node => {
      rightColContent.appendChild(node.cloneNode(true));
    });
  }
  // Button (link)
  const button = containers[1].querySelector('a.cmp-button');
  if (button) rightColContent.appendChild(button.cloneNode(true));

  // 3. Table row for columns
  const columnsRow = [
    leftImage ? leftImage : '',
    rightColContent
  ];

  // 4. Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // 5. Replace the original element
  element.replaceWith(table);
}
