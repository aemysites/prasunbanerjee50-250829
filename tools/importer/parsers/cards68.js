/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all card elements
  function getCards() {
    // Cards are .teaser.card.has-ellipsis
    return Array.from(element.querySelectorAll('.teaser.card.has-ellipsis'));
  }

  // Helper to extract image from a card
  function getCardImage(card) {
    // Find the img inside .cmp-teaser__image
    const img = card.querySelector('.cmp-teaser__image img');
    return img ? img : '';
  }

  // Helper to extract card text content
  function getCardTextContent(card) {
    const frag = document.createDocumentFragment();

    // Pretitle (Cloud)
    const pretitle = card.querySelector('.cmp-teaser__pretitle');
    if (pretitle) {
      frag.appendChild(pretitle.cloneNode(true));
    }

    // Title (h3)
    const title = card.querySelector('.cmp-teaser__title');
    if (title) {
      frag.appendChild(title.cloneNode(true));
    }

    // Description
    const desc = card.querySelector('.cmp-teaser__description');
    if (desc) {
      frag.appendChild(desc.cloneNode(true));
    }

    // CTA link
    const cta = card.querySelector('.cmp-teaser__action-link');
    if (cta) {
      frag.appendChild(cta.cloneNode(true));
    }

    return frag;
  }

  // Build the table rows
  const headerRow = ['Cards (cards68)'];
  const rows = [headerRow];

  // Card rows only (do NOT include section heading as a row)
  const cards = getCards();
  cards.forEach(card => {
    const img = getCardImage(card);
    const textContent = getCardTextContent(card);
    rows.push([
      img,
      textContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
