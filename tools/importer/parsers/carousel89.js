/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel89) block parsing
  // Step 1: Header row
  const headerRow = ['Carousel (carousel89)'];

  // Select all slides
  const slideSelector = '.ds2-slider--slide';
  const slides = element.querySelectorAll(slideSelector);

  const rows = [headerRow];

  // Deduplicate slides by text content
  const seen = new Set();

  slides.forEach((slide) => {
    let imageCell = '';
    let textCell = '';
    const details = slide.querySelector('.ds2-slider-slide-details');
    if (details) {
      const txt = details.textContent.trim();
      if (txt && !seen.has(txt)) {
        seen.add(txt);
        textCell = details;
        rows.push(['', textCell]); // Always two columns, image cell left empty if no image
      }
    }
  });

  // Always replace with a table, even if only header row
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
