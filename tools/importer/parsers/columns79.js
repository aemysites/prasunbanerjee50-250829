/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns79)'];

  // Find the cards container
  const cardsContainer = element.querySelector('.rad-absorb-stats__cards-container');
  if (!cardsContainer) return;

  // Find all stat cards
  const cards = Array.from(cardsContainer.querySelectorAll('.rad-absorb-stats__card'));

  // For each card, extract its entire content as a cell
  const cells = cards.map((card) => {
    // Defensive: get the card text container
    const cardText = card.querySelector('.rad-absorb-stats__card-text');
    if (cardText) {
      return cardText;
    }
    // Fallback: use the card itself
    return card;
  });

  // Build the table rows
  const tableRows = [headerRow, cells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
