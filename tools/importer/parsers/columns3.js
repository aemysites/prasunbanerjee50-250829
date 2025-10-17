/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children divs
  function getImmediateDivs(parent) {
    return Array.from(parent.children).filter((el) => el.tagName === 'DIV');
  }

  // Find all aem-Grid containers (each is a columns block)
  const grids = element.querySelectorAll('.aem-Grid');
  if (!grids.length) return;

  let blockCount = 0;
  grids.forEach((grid) => {
    // Find left and right column containers (first two direct children of grid)
    const gridChildren = getImmediateDivs(grid);
    if (gridChildren.length < 2) return;
    const leftCol = gridChildren[0];
    const rightCol = gridChildren[1];

    // --- Left Column: Find image ---
    let leftImage = leftCol.querySelector('img.cmp-image__image') || leftCol.querySelector('img');
    let leftCell = leftImage ? leftImage.cloneNode(true) : '';

    // --- Right Column: Find ALL text content ---
    let rightCell = [];

    // Get all .title blocks (including eyebrow and headline)
    rightCol.querySelectorAll('.title').forEach((titleBlock) => {
      const cmpTitle = titleBlock.querySelector('.cmp-title');
      if (cmpTitle) {
        // Push all children of .cmp-title (h2, eyebrow, etc)
        Array.from(cmpTitle.children).forEach((child) => {
          rightCell.push(child.cloneNode(true));
        });
      }
    });

    // Get all paragraphs from .text blocks
    rightCol.querySelectorAll('.text').forEach((textBlock) => {
      textBlock.querySelectorAll('p').forEach((para) => {
        if (para.textContent.trim()) {
          rightCell.push(para.cloneNode(true));
        }
      });
    });

    // CTA Button/Link (include full link)
    rightCol.querySelectorAll('.button').forEach((buttonBlock) => {
      const link = buttonBlock.querySelector('a');
      if (link) rightCell.push(link.cloneNode(true));
    });

    // Defensive: If no content found, grab all direct children
    if (rightCell.length === 0) {
      rightCell = getImmediateDivs(rightCol).map((el) => el.cloneNode(true));
    }

    // Ensure all text content is included (fallback: grab all text from rightCol)
    // If still missing, get all text nodes in rightCol
    if (rightCell.length === 0) {
      Array.from(rightCol.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          rightCell.push(document.createTextNode(node.textContent.trim()));
        }
      });
    }

    // --- Compose table rows ---
    const headerRow = ['Columns (columns3)'];
    const contentRow = [leftCell, rightCell];

    // Create the block table
    const cells = [headerRow, contentRow];
    const block = WebImporter.DOMUtils.createTable(cells, document);

    if (blockCount === 0) {
      element.replaceWith(block);
    } else {
      if (element.parentNode) {
        element.parentNode.insertBefore(block, element.nextSibling);
      }
    }
    blockCount++;
  });
}
