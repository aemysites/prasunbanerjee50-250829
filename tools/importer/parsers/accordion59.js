/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion59)'];
  const rows = [headerRow];

  // Find all accordion items (each .cmp-cardlist__item)
  const items = element.querySelectorAll('.cmp-cardlist__item');

  items.forEach((item) => {
    // Title cell: get only the title text
    let titleCellContent = '';
    const button = item.querySelector('button.cmp-cardlist__item-header');
    if (button) {
      const titleText = button.querySelector('.cmp-title__text');
      if (titleText) {
        titleCellContent = titleText.textContent.trim();
      }
    }
    // Defensive: fallback to item text if button/title missing
    if (!titleCellContent) {
      const fallbackTitle = item.querySelector('h3');
      if (fallbackTitle) {
        titleCellContent = fallbackTitle.textContent.trim();
      }
    }

    // Content cell: get the expandable content
    const contentPanel = item.querySelector('.cmp-cardlist__expandable');
    let contentCellContent = '';
    if (contentPanel) {
      const textParagraph = contentPanel.querySelector('.cmp-text__paragraph');
      if (textParagraph) {
        contentCellContent = textParagraph.textContent.trim();
      }
    }

    // Add row: [titleCell, contentCell]
    rows.push([
      titleCellContent,
      contentCellContent
    ]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
