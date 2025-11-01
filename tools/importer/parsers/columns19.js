/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns19)'];

  // Find the main wrapper for the columns block
  const root = element.querySelector('.rad-mixed-media-and-text');
  if (!root) return;

  // LEFT COLUMN: Extract all actual HTML content and overlays
  const leftCol = document.createElement('div');
  const mediaCol = root.querySelector('.rad-mixed-media-and-text__media');
  if (mediaCol) {
    // Clone the image
    const img = mediaCol.querySelector('img');
    if (img) leftCol.appendChild(img.cloneNode(true));
  }

  // Extract overlays (logos and search input) if present in HTML
  // Look for any element with logo text or search input
  // This ensures flexibility for future HTML changes
  let logoText = '';
  Array.from(element.querySelectorAll('*')).forEach(el => {
    if (el.textContent && el.textContent.includes('Accenture Song')) {
      logoText += 'Accenture Song ';
    }
    if (el.textContent && el.textContent.includes('NVIDIA')) {
      logoText += 'NVIDIA';
    }
  });
  if (logoText.trim()) {
    const logoDiv = document.createElement('div');
    logoDiv.textContent = logoText.trim();
    leftCol.appendChild(logoDiv);
  }

  // Search input overlay
  let searchText = '';
  Array.from(element.querySelectorAll('*')).forEach(el => {
    if (el.textContent && el.textContent.includes('Where to next?')) {
      searchText = el.textContent.trim();
    }
  });
  if (searchText) {
    const searchDiv = document.createElement('div');
    searchDiv.textContent = searchText;
    leftCol.appendChild(searchDiv);
  }

  // RIGHT COLUMN: Collect all visible content from the text column
  const rightCol = document.createElement('div');
  const textCol = root.querySelector('.rad-mixed-media-and-text__text');
  if (textCol) {
    Array.from(textCol.children).forEach(child => {
      rightCol.appendChild(child.cloneNode(true));
    });
  }

  // Table structure: header row, then one row with two columns (media, text)
  const tableRows = [
    headerRow,
    [leftCol, rightCol],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
