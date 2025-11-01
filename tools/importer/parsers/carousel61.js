/* global WebImporter */
export default function parse(element, { document }) {
  // Get all carousel slides
  const slides = Array.from(element.querySelectorAll('.rad-carousel-image-and-text__slide'));

  // Block header row (must match target block name exactly)
  const headerRow = ['Carousel (carousel61)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    // --- IMAGE CELL ---
    let imgEl = slide.querySelector('img');
    // If no <img> with src, check for lazyload attribute
    if (!imgEl) {
      const lazyImg = slide.querySelector('[data-flickity-lazyload]');
      if (lazyImg) {
        imgEl = document.createElement('img');
        imgEl.src = lazyImg.getAttribute('data-flickity-lazyload');
        imgEl.alt = lazyImg.getAttribute('alt') || '';
      }
    }

    // --- TEXT CELL ---
    const textContainer = slide.querySelector('.rad-carousel-image-and-text__slide-text');
    const textCellContent = [];
    if (textContainer) {
      // Title (h4)
      const titleEl = textContainer.querySelector('.rad-carousel-image-and-text__slide-title');
      if (titleEl) {
        // Use heading element for semantic meaning
        const heading = document.createElement('h3');
        heading.textContent = titleEl.textContent;
        textCellContent.push(heading);
      }
      // Body (p)
      const bodyEl = textContainer.querySelector('.rad-carousel-image-and-text__slide-body');
      if (bodyEl) {
        textCellContent.push(bodyEl);
      }
      // CTA (a)
      const ctaEl = textContainer.querySelector('a');
      if (ctaEl) {
        // Remove button icon if present
        const icon = ctaEl.querySelector('.rad-button__icon-right');
        if (icon) icon.remove();
        // Remove non-semantic classes/attributes
        ctaEl.className = '';
        ctaEl.removeAttribute('tabindex');
        // Flatten button text if wrapped in div
        const btnText = ctaEl.querySelector('.rad-button__text');
        if (btnText) {
          ctaEl.textContent = btnText.textContent.trim();
        }
        textCellContent.push(ctaEl);
      }
    }

    // Add row: image in first cell, text content in second cell
    rows.push([
      imgEl || '',
      textCellContent.length > 0 ? textCellContent : ''
    ]);
  });

  // Create and replace with table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
