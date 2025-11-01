/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns8)'];

  // Find all card elements inside the container
  const cards = element.querySelectorAll('.rad-absorb-stats__card');

  // For each card, extract the stat and the detail as a single cell
  const columns = Array.from(cards).map(card => {
    // Get the stat (usually a <p> with class 'rad-absorb-stats__card-stat')
    const stat = card.querySelector('.rad-absorb-stats__card-stat');
    // Get the detail (usually a <div> with class 'rad-absorb-stats__card-detail')
    const detail = card.querySelector('.rad-absorb-stats__card-detail');

    // Defensive: If either is missing, fallback to the card's content
    if (stat && detail) {
      // Wrap both in a div for structure
      const wrapper = document.createElement('div');
      wrapper.appendChild(stat);
      wrapper.appendChild(detail);
      return wrapper;
    } else {
      // Fallback: just use the card's content
      return card;
    }
  });

  // Build the table rows
  const rows = [headerRow, columns];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
