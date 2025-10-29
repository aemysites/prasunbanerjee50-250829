/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion40)'];
  const rows = [headerRow];

  // Find the accordion container
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Select all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');

  items.forEach(item => {
    // Title cell: find the button and its title span
    const button = item.querySelector('.cmp-accordion__button');
    let titleSpan = button ? button.querySelector('.cmp-accordion__title') : null;
    let titleCell = titleSpan ? titleSpan : button;
    // Defensive: fallback to header text if needed
    if (!titleCell && button) titleCell = document.createTextNode(button.textContent.trim());

    // Content cell: find the panel and its content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = null;
    if (panel) {
      // Find the first child with actual content
      const contentDiv = panel.querySelector('.cmp-text');
      contentCell = contentDiv ? contentDiv : panel;
    }

    // Defensive: fallback to empty cell if missing
    if (!contentCell) contentCell = document.createTextNode('');

    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
