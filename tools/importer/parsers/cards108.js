/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract a card from its container
  function extractCard(cardContainer) {
    // Find image (mandatory)
    const imageWrapper = cardContainer.querySelector('.image .cmp-image__wrapper');
    let imageEl = null;
    if (imageWrapper) {
      // Use <picture> for responsive images, else fallback to <img>
      const pictureEl = imageWrapper.querySelector('picture');
      imageEl = pictureEl || imageWrapper.querySelector('img');
    }

    // Find title (mandatory)
    let titleEl = cardContainer.querySelector('.title .cmp-title__text');
    if (!titleEl) {
      titleEl = cardContainer.querySelector('h3');
    }

    // Find description (mandatory)
    let descEl = cardContainer.querySelector('.text .cmp-text__paragraph');
    if (!descEl) {
      descEl = cardContainer.querySelector('p');
    }

    // Find CTAs (optional, can be multiple)
    const ctaLinks = Array.from(cardContainer.querySelectorAll('.button a'));
    // Defensive fallback: only add direct anchors if no .button a
    if (ctaLinks.length === 0) {
      ctaLinks.push(...Array.from(cardContainer.querySelectorAll(':scope > a')));
    }

    // Compose the text cell
    const textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    if (descEl) textCellContent.push(descEl);
    if (ctaLinks.length > 0) {
      ctaLinks.forEach((cta) => textCellContent.push(cta));
    }

    // Only return a card if it has at least image and some text
    if (imageEl && (titleEl || descEl)) {
      return [imageEl, textCellContent];
    }
    return undefined;
  }

  // Identify all card containers (each card is a .cmp-container with an image)
  const cardContainers = Array.from(
    element.querySelectorAll('.cmp-container')
  ).filter((container) => container.querySelector('.image .cmp-image__wrapper'));

  // Build table rows
  const rows = [];
  rows.push(['Cards (cards108)']);
  cardContainers.forEach((cardContainer) => {
    const cardRow = extractCard(cardContainer);
    if (cardRow) rows.push(cardRow);
  });

  // Remove any empty rows (except header)
  const validRows = rows.filter((row, i) => i === 0 || (Array.isArray(row) && row[0] && row[1]));

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(validRows, document);

  // Replace the original element
  element.replaceWith(block);
}
