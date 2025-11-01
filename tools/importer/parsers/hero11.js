/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block requirements
  const headerRow = ['Hero (hero11)'];

  // --- Row 2: Background image (none in this case, so leave cell empty) ---
  const bgRow = [''];

  // --- Row 3: Content (title, subheading, CTA) ---
  // Find the heading (h2)
  const heading = element.querySelector('h2, h1');

  // Find the CTA link (anchor)
  const cta = element.querySelector('a');

  // Compose content cell
  const contentCell = [];
  if (heading) contentCell.push(heading);
  // No subheading present in this HTML
  if (cta) contentCell.push(cta);

  const contentRow = [contentCell];

  // Assemble table rows
  const rows = [headerRow, bgRow, contentRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
