/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards16) block: 2 columns, first row is header, each card is a row
  const headerRow = ['Cards (cards16)'];
  const rows = [headerRow];

  // Find the parent container for the cards
  const actionBar = element.querySelector('.ds2-action-bar-content .ds2-action-bar-links');
  if (!actionBar) return;

  // Each card is a .ds2-action-bar-link
  const cardLinks = Array.from(actionBar.querySelectorAll('.ds2-action-bar-link'));

  cardLinks.forEach(card => {
    // The icon and text are inside the <a>
    const link = card.querySelector('a');
    if (!link) return;

    // Find the icon div
    const icon = link.querySelector('.ds2-action-bar-icon');
    // Find the text div
    const text = link.querySelector('.ds2-action-bar-text');
    if (!icon || !text) return;

    // Cell 1: icon (as element)
    // Cell 2: text wrapped in link (as element)
    const cardLink = document.createElement('a');
    cardLink.href = link.href;
    if (link.title) cardLink.title = link.title;
    cardLink.appendChild(text.cloneNode(true));

    rows.push([
      icon.cloneNode(true),
      cardLink
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
