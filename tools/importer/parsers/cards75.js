/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards75) block: 2 columns, first row is block name, subsequent rows are cards
  const headerRow = ['Cards (cards75)'];
  const rows = [headerRow];

  // Find the parent container for the cards
  const actionBarContent = element.querySelector('.ds2-action-bar-content');
  if (!actionBarContent) return;

  // Get all card link wrappers
  const cardLinks = actionBarContent.querySelectorAll('.ds2-action-bar-link > a');

  cardLinks.forEach((a) => {
    // Icon (first cell)
    const icon = a.querySelector('.ds2-action-bar-icon');
    if (!icon) return;

    // Text (second cell)
    const textDiv = a.querySelector('.ds2-action-bar-text');
    if (!textDiv) return;

    // Compose the text cell: use the text as heading and include the link
    const title = document.createElement('strong');
    title.textContent = textDiv.textContent.trim();
    const link = document.createElement('a');
    link.href = a.href;
    link.textContent = title.textContent;
    rows.push([icon, link]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
