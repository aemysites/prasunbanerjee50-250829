/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns21)'];

  // Find the container holding the columns (cards)
  // The structure is: .rad-text-block-with-icon__block-container > .texticoncard > .rad-text-block-with-icon__block
  const blockContainer = element.querySelector('.rad-text-block-with-icon__block-container');
  if (!blockContainer) return;

  // Get all the column blocks
  const columnBlocks = Array.from(blockContainer.querySelectorAll('.rad-text-block-with-icon__block'));
  if (!columnBlocks.length) return;

  // For each column, collect the pictogram, title, and body as a single fragment
  const columns = columnBlocks.map(block => {
    // We'll collect the pictogram, title, and body in order
    const pictogram = block.querySelector('.rad-text-block-with-icon__block-pictogram');
    const title = block.querySelector('.rad-text-block-with-icon__block-title');
    const body = block.querySelector('.rad-text-block-with-icon__block-body');

    // Create a fragment to hold the column's content
    const frag = document.createDocumentFragment();
    if (pictogram) frag.appendChild(pictogram);
    if (title) frag.appendChild(title);
    if (body) frag.appendChild(body);
    return frag;
  });

  // Build the table rows
  const rows = [
    headerRow,
    columns
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
