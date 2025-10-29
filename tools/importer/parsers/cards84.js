/* global WebImporter */
export default function parse(element, { document }) {
  // Step 1: Find the carousel content wrapper
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  const contentWrapper = carousel.querySelector('.cmp-carousel__content');
  if (!contentWrapper) return;

  // Step 2: Find all slides (cards)
  const slides = Array.from(contentWrapper.querySelectorAll('[data-cmp-hook-carousel="item"]'));
  if (!slides.length) return;

  // Step 3: Prepare the table rows
  const headerRow = ['Cards (cards84)']; // CRITICAL: Must match block name
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Find the image (poster)
    let cardImg = slide.querySelector('.cmp-video__poster');
    if (!cardImg) cardImg = slide.querySelector('img');

    // Find all title and description paragraphs within the slide
    // This is more flexible: get all .cmp-title__text and .cmp-text__paragraph
    const titles = Array.from(slide.querySelectorAll('.cmp-title__text'));
    const descs = Array.from(slide.querySelectorAll('.cmp-text__paragraph'));

    // Build the text cell
    const textCell = document.createElement('div');
    // Add all titles (as <strong>)
    titles.forEach((title, idx) => {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textCell.appendChild(strong);
      if (descs.length > 0 || idx < titles.length - 1) {
        textCell.appendChild(document.createElement('br'));
      }
    });
    // Add all descriptions (as paragraphs)
    descs.forEach((desc, idx) => {
      textCell.appendChild(desc.cloneNode(true));
      if (idx < descs.length - 1) {
        textCell.appendChild(document.createElement('br'));
      }
    });

    // Add the row: [image, text content]
    rows.push([
      cardImg || '',
      textCell
    ]);
  });

  // Step 4: Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
