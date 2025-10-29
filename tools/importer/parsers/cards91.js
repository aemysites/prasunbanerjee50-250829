/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the carousel content wrapper
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const slides = carousel.querySelectorAll('.cmp-carousel__content > .swiper-slide');
  if (!slides.length) return;

  // 2. Prepare the header row
  const headerRow = ['Cards (cards91)'];
  const rows = [headerRow];

  // 3. For each slide, extract image (first cell), and text content (second cell)
  slides.forEach((slide) => {
    // --- IMAGE CELL ---
    // Find the first <img> in the slide
    const img = slide.querySelector('img');
    let imageCell = '';
    if (img) {
      imageCell = img;
    }

    // --- TEXT CELL ---
    // Find the title (look for .cmp-title__text)
    const title = slide.querySelector('.cmp-title__text');
    // Find the description (look for .cmp-text__paragraph)
    const desc = slide.querySelector('.cmp-text__paragraph');
    // Find the CTA (look for .cmp-button)
    const cta = slide.querySelector('.cmp-button');

    // Compose the text cell: title (heading), description, CTA (link)
    const textCellContent = [];
    if (title) {
      // Use <strong> for heading
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textCellContent.push(strong);
    }
    if (desc) {
      textCellContent.push(document.createElement('br'));
      textCellContent.push(desc);
    }
    if (cta) {
      textCellContent.push(document.createElement('br'));
      textCellContent.push(cta);
    }

    rows.push([
      imageCell,
      textCellContent
    ]);
  });

  // 4. Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
