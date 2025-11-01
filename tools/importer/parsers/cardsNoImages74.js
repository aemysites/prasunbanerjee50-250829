/* global WebImporter */
export default function parse(element, { document }) {
  // Cards block header row
  const headerRow = ['Cards (cardsNoImages74)'];

  // Find the main card listing block
  const cardListingBlock = element.querySelector('.cardlistingblock .cmp-card-listing_second-row');
  if (!cardListingBlock) return;

  // Find all card elements within the block
  const cardsContainer = cardListingBlock.querySelector('.cmp-container');
  if (!cardsContainer) return;

  // Each card is a .teaser.content-card
  const cardEls = Array.from(cardsContainer.querySelectorAll('.teaser.content-card'));

  // Helper to extract card content
  function extractCardContent(cardEl) {
    const content = cardEl.querySelector('.cmp-teaser__content');
    if (!content) return '';
    const frag = document.createDocumentFragment();

    // Pretitle (optional)
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      const pretitleDiv = document.createElement('div');
      pretitleDiv.append(pretitle.cloneNode(true));
      frag.append(pretitleDiv);
    }

    // Title (may be a link)
    const title = content.querySelector('.cmp-teaser__title');
    if (title) {
      const titleDiv = document.createElement('div');
      const link = title.querySelector('a');
      if (link) {
        titleDiv.append(link.cloneNode(true));
      } else {
        titleDiv.append(title.cloneNode(true));
      }
      frag.append(titleDiv);
    }

    // Description (optional)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      const descDiv = document.createElement('div');
      descDiv.append(desc.cloneNode(true));
      frag.append(descDiv);
    }

    return frag;
  }

  // Build rows: one per card
  const rows = cardEls.map(cardEl => [extractCardContent(cardEl)]);

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
