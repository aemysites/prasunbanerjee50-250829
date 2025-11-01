/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion13)'];
  const rows = [headerRow];

  // Find all accordion items (each .accordioncard)
  const cards = element.querySelectorAll('.accordioncard');
  cards.forEach(card => {
    // Title: inside button > h3.rad-accordion__header-title
    const headerBtn = card.querySelector('button.rad-accordion__header');
    let title = '';
    if (headerBtn) {
      const h3 = headerBtn.querySelector('.rad-accordion__header-title');
      if (h3) {
        title = h3.textContent.trim();
      }
    }
    // Defensive fallback: if not found, use first text node
    if (!title) {
      title = card.textContent.trim().split('\n')[0];
    }

    // Content: everything inside .rad-accordion__content-wrapper
    const contentWrapper = card.querySelector('.rad-accordion__content-wrapper');
    let contentCell;
    if (contentWrapper) {
      // Use the wrapper directly to preserve all content (text, images, links, etc)
      contentCell = contentWrapper;
    } else {
      // Defensive fallback: empty cell
      contentCell = document.createElement('div');
    }
    rows.push([title, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
