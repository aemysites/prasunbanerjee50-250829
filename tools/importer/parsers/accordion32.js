/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion container
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;
  const items = accordion.querySelectorAll('.cmp-accordion__item');

  // Table header: must match block name exactly
  const headerRow = ['Accordion (accordion32)'];
  const rows = [headerRow];

  // For each accordion item, extract title and content
  items.forEach((item) => {
    // Title: Find the button and extract the title span
    let titleCell = null;
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        titleCell = titleSpan;
      } else {
        // Fallback: use button text if no span
        titleCell = document.createElement('span');
        titleCell.textContent = button.textContent.trim();
      }
    }

    // Content: Find the panel and extract its visible content
    let contentCell = null;
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Use the first .cmp-text or all children if present
      const cmpText = panel.querySelector('.cmp-text');
      if (cmpText) {
        contentCell = cmpText;
      } else if (panel.children.length > 0) {
        // If there are multiple children, wrap them in a div
        if (panel.children.length === 1) {
          contentCell = panel.children[0];
        } else {
          contentCell = document.createElement('div');
          Array.from(panel.children).forEach(child => contentCell.appendChild(child));
        }
      } else {
        // Fallback to text content
        contentCell = document.createElement('div');
        contentCell.textContent = panel.textContent.trim();
      }
    }

    // Only add row if both title and content are present
    if (titleCell && contentCell) {
      rows.push([titleCell, contentCell]);
    }
  });

  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
