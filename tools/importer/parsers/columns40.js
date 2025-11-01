/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct child li.locationcard elements
  const cards = Array.from(element.querySelectorAll(':scope > li.locationcard'));
  if (!cards.length) return;

  // Build the columns row: each card becomes a column (cell)
  const columns = cards.map(card => {
    const link = card.querySelector('a.rad-locations__city-link');
    if (!link) return card; // fallback: use the whole card

    // Reference the existing <img> element (do not clone)
    const img = link.querySelector('img');
    // Get the name text
    const nameDiv = link.querySelector('.rad-locations__city-name');
    const label = nameDiv ? nameDiv.textContent.trim() : link.textContent.trim();

    // Compose: image + label, both wrapped in the link
    // Reference the existing <img> (not clone), and create a new text node
    const a = document.createElement('a');
    a.href = link.href;
    a.setAttribute('target', link.getAttribute('target') || '_self');
    if (img) a.appendChild(img);
    a.appendChild(document.createTextNode(label));
    return a;
  });

  // Compose the table
  const rows = [
    ['Columns (columns40)'], // header row (must match block name exactly)
    columns,                 // columns row (one cell per card)
  ];

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
