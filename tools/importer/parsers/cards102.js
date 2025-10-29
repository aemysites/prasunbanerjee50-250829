/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image element from a card
  function getImage(card) {
    // Find the first <img> inside the card
    return card.querySelector('img');
  }

  // Helper to extract text content (title, description, CTA) from a card
  function getTextContent(card) {
    const fragments = [];
    // Title: look for h3 or h2
    const title = card.querySelector('.cmp-title__text, h3, h2');
    if (title) {
      const heading = document.createElement('div');
      heading.appendChild(title.cloneNode(true));
      fragments.push(heading);
    }
    // Description: look for .cmp-text__paragraph or <p>
    const desc = card.querySelector('.cmp-text__paragraph, p');
    if (desc) {
      fragments.push(desc.cloneNode(true));
    }
    // CTA: look for .cmp-button or <a>
    const cta = card.querySelector('.cmp-button, a[href]');
    if (cta) {
      // Only include visible CTA (not image links)
      if (!cta.querySelector('img')) {
        fragments.push(cta.cloneNode(true));
      }
    }
    return fragments;
  }

  // Find all cards (swiper-slide)
  const cards = Array.from(element.querySelectorAll('.swiper-slide'));

  // Build rows for the table
  const rows = [];
  // Header row
  rows.push(['Cards (cards102)']);

  // For each card, extract image and text content
  cards.forEach(card => {
    // Image cell
    let image = getImage(card);
    // Defensive: if image not found, fallback to picture element
    if (!image) {
      const picture = card.querySelector('picture');
      if (picture) image = picture;
    }
    // Text cell
    const textContent = getTextContent(card);
    rows.push([
      image || '',
      textContent.length ? textContent : ''
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
