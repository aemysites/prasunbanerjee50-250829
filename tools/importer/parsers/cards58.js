/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards58) block parsing
  const headerRow = ['Cards (cards58)'];
  const rows = [headerRow];

  // Find the cards container
  const cardsContainer = element.querySelector('.rad-editorial-grid__cards-container');
  if (!cardsContainer) return;

  // Select all card elements
  const cardEls = Array.from(cardsContainer.querySelectorAll('.rad-editorial-grid__card'));

  cardEls.forEach((cardEl) => {
    // --- Image extraction ---
    // Find the image container (anchor wrapping image)
    const imageLink = cardEl.querySelector('.editorial-grid-card__image');
    let imageEl = null;
    if (imageLink) {
      // Find the actual image element inside the anchor
      imageEl = imageLink.querySelector('img');
    }

    // --- Text extraction ---
    const copyWrapper = cardEl.querySelector('.editorial-grid-card__copy-wrapper');
    const textNodes = [];
    if (copyWrapper) {
      // Title (h3)
      const titleEl = copyWrapper.querySelector('.editorial-grid-card__title');
      if (titleEl) textNodes.push(titleEl);
      // Description (p)
      const descEl = copyWrapper.querySelector('.editorial-grid-card__body');
      if (descEl) textNodes.push(descEl);
      // CTA (button link)
      const ctaEl = copyWrapper.querySelector('.rad-button');
      if (ctaEl) textNodes.push(ctaEl);
    }

    // Add row: [image, textContent]
    rows.push([
      imageEl ? imageEl : '',
      textNodes.length ? textNodes : ''
    ]);
  });

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
