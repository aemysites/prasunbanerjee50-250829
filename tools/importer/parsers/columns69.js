/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Columns block
  const headerRow = ['Columns (columns69)'];

  // Find all card elements inside the grid
  const cardSelector = '.cmp-floating-awards-card > .rad-awards-card';
  let cards = Array.from(element.querySelectorAll(cardSelector));
  if (!cards.length) {
    // Defensive: fallback to direct children with card class
    cards = Array.from(element.querySelectorAll('.rad-awards-card'));
  }

  // For each card, extract the cover (title) and the description
  const columns = cards.map(card => {
    // Get the cover (background + title)
    const cover = card.querySelector('.rad-awards-card__cover');
    // Get the description (paragraph)
    const desc = card.querySelector('.rad-awards-card__rte');
    // Compose a fragment containing both
    const fragment = document.createDocumentFragment();
    if (cover) fragment.appendChild(cover.cloneNode(true));
    if (desc) fragment.appendChild(desc.cloneNode(true));
    return fragment;
  });

  // Build the table rows
  const tableRows = [
    headerRow,
    columns
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
