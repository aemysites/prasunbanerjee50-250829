/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the section heading
  function getSectionHeading() {
    const heading = element.querySelector('.cmp-title__text');
    if (heading) {
      return heading.cloneNode(true);
    }
    const h2 = element.querySelector('h2');
    return h2 ? h2.cloneNode(true) : null;
  }

  // Helper to extract all card elements
  function getCards() {
    const cardRow = element.querySelector('.cmp-card-listing_second-row');
    if (!cardRow) return [];
    return Array.from(cardRow.querySelectorAll('.teaser.icon-card.card, .teaser.icon-card.card.has-tooltip'));
  }

  // Helper to extract card content
  function extractCardContent(cardEl) {
    let imageCell = null;
    const imageWrap = cardEl.querySelector('.cmp-teaser__image');
    if (imageWrap) {
      const imgLink = imageWrap.querySelector('a.cmp-image__link');
      if (imgLink) {
        imageCell = imgLink.cloneNode(true);
      } else {
        const img = imageWrap.querySelector('img');
        if (img) imageCell = img.cloneNode(true);
      }
    }
    const textFragments = [];
    const title = cardEl.querySelector('.cmp-teaser__title');
    if (title) textFragments.push(title.cloneNode(true));
    const desc = cardEl.querySelector('.cmp-teaser__description');
    if (desc) textFragments.push(desc.cloneNode(true));
    const cta = cardEl.querySelector('.cmp-teaser__action-link');
    if (cta) textFragments.push(cta.cloneNode(true));
    return [imageCell, textFragments];
  }

  const headerRow = ['Cards (cards88)'];
  const rows = [headerRow];

  const cards = getCards();
  cards.forEach(cardEl => {
    const [imageCell, textFragments] = extractCardContent(cardEl);
    rows.push([
      imageCell,
      textFragments
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Insert the section heading above the block, safely
  const sectionHeading = getSectionHeading();
  if (sectionHeading && block.parentNode) {
    block.parentNode.insertBefore(sectionHeading, block);
  } else if (sectionHeading) {
    // If block has no parent yet, wrap in a fragment
    const frag = document.createDocumentFragment();
    frag.appendChild(sectionHeading);
    frag.appendChild(block);
    element.replaceWith(frag);
    return;
  }

  element.replaceWith(block);
}
