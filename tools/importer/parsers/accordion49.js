/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion49)'];

  // Find all accordion items (cmp-accordion__item)
  const items = Array.from(element.querySelectorAll('.cmp-accordion__item'));

  // Build rows for each accordion item
  const rows = items.map((item) => {
    // Title: find the button with the title span
    const button = item.querySelector('.cmp-accordion__button');
    let title = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        title = titleSpan.textContent.trim();
      } else {
        title = button.textContent.trim();
      }
    }
    // Content: find the panel and extract only the actual content (e.g., <p> elements)
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let content = '';
    if (panel) {
      // Only extract the meaningful content (e.g., paragraphs)
      const paragraphs = Array.from(panel.querySelectorAll('p'));
      if (paragraphs.length) {
        content = paragraphs.map(p => p.cloneNode(true));
      } else {
        // fallback: if no paragraphs, use textContent
        content = panel.textContent.trim();
      }
    }
    // Title cell (string), Content cell (element or array of elements)
    return [title, content];
  });

  // Compose the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
