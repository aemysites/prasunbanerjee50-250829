/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero21) block parsing
  // 1 column, 3 rows: [header], [image], [content]

  // Header row: block name
  const headerRow = ['Hero (hero21)'];

  // Row 2: Background image (none in this example)
  const imageRow = ['']; // No image present in source HTML or screenshot

  // Row 3: Content (heading, paragraph, CTA if present)
  // Find the main heading
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');

  // Find the main paragraph content
  let paragraph = null;
  // Try to find a <p> inside the nested structure
  const pCandidate = element.querySelector('p');
  if (pCandidate) {
    paragraph = pCandidate;
  } else {
    // Fallback: look for any text nodes
    const textNodes = Array.from(element.childNodes).filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
    if (textNodes.length) {
      paragraph = document.createElement('p');
      paragraph.textContent = textNodes.map(n => n.textContent.trim()).join(' ');
    }
  }

  // Look for CTA (anchor link)
  let cta = null;
  const anchor = element.querySelector('a[href]');
  if (anchor) {
    cta = anchor;
  }

  // Compose content cell
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (paragraph) contentCell.push(paragraph);
  if (cta) contentCell.push(cta);

  // Table structure
  const cells = [
    headerRow,
    imageRow,
    [contentCell]
  ];

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
