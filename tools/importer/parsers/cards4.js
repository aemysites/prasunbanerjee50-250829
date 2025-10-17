/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the carousel content wrapper
  function getCarouselContentWrapper(root) {
    return root.querySelector('.cmp-carousel__content');
  }

  // Helper to extract cards from a carousel
  function extractCardsFromCarousel(carouselContent) {
    const cards = [];
    const slides = carouselContent.querySelectorAll('.swiper-slide');
    slides.forEach((slide) => {
      // Find image (mandatory)
      let imgEl = slide.querySelector('.cmp-image__image');
      if (!imgEl) {
        imgEl = slide.querySelector('img');
      }
      // Compose text cell: grab all direct text below image
      // Find the image wrapper
      let textCellContent = [];
      // Find all elements after the image
      let afterImg = false;
      Array.from(slide.children).forEach((child) => {
        if (afterImg) {
          // Collect all text content blocks (titles, paragraphs, etc)
          // If it's a container, get its text children
          if (child.querySelector) {
            // Get all headings and paragraphs inside
            const headings = child.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const paragraphs = child.querySelectorAll('p');
            headings.forEach((h) => textCellContent.push(h));
            paragraphs.forEach((p) => textCellContent.push(p));
          }
        }
        // Mark when we've passed the image
        if (!afterImg && (child.contains(imgEl) || child === imgEl)) {
          afterImg = true;
        }
      });
      // Defensive: if nothing found, fallback to all headings and paragraphs in slide
      if (textCellContent.length === 0) {
        const headings = slide.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const paragraphs = slide.querySelectorAll('p');
        headings.forEach((h) => textCellContent.push(h));
        paragraphs.forEach((p) => textCellContent.push(p));
      }
      // Add card row: [image, text]
      if (imgEl && textCellContent.length) {
        cards.push([imgEl, textCellContent]);
      }
    });
    return cards;
  }

  // Find all carousels inside the element
  const carousels = element.querySelectorAll('.cmp-carousel');
  const rows = [];
  // Always start with the header row
  rows.push(['Cards (cards4)']);

  carousels.forEach((carousel) => {
    const contentWrapper = getCarouselContentWrapper(carousel);
    if (contentWrapper) {
      const cardRows = extractCardsFromCarousel(contentWrapper);
      rows.push(...cardRows);
    }
  });

  // Replace element with block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
