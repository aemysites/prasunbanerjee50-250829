/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: must match block name exactly
  const headerRow = ['Hero (hero94)'];

  // 2. Image extraction: reference the actual <img> element
  const img = element.querySelector('.cmp-image img');
  let imageRow = [''];
  if (img) {
    imageRow = [img]; // Reference, do not clone or use src
  }

  // 3. Text content extraction
  // Headline
  const title = element.querySelector('.rad-carousel-block__title');
  // Body text
  const body = element.querySelector('.rad-carousel-block__body');
  // CTA (link)
  const cta = element.querySelector('.rad-carousel-image-and-text__slide-cta');

  // Compose cell content, preserving semantic structure and all text
  const textContent = [];
  if (title) textContent.push(title); // Heading
  if (body) textContent.push(body);   // Paragraph
  if (cta) textContent.push(cta);     // CTA link

  // Handle edge case: if all are missing, cell should be empty
  const textRow = [textContent.length ? textContent : ''];

  // 4. Build the table
  const rows = [
    headerRow,
    imageRow,
    textRow,
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 5. Replace the original element
  element.replaceWith(table);
}
