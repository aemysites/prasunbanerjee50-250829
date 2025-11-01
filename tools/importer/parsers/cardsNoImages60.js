/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the cards container (the one with all the card teasers)
  const cardsContainer = element.querySelector('.cmp-card-listing_second-row .cmp-container');
  if (!cardsContainer) return;

  // 2. Find all card elements inside the container
  const cardEls = Array.from(cardsContainer.querySelectorAll('.teaser.content-card'));
  if (!cardEls.length) return;

  // 3. Prepare the header row as required
  const headerRow = ['Cards (cardsNoImages60)'];
  const rows = [headerRow];

  // 4. For each card, extract pretitle, title, description, and CTA (if any)
  cardEls.forEach(cardEl => {
    // Content container
    const content = cardEl.querySelector('.cmp-teaser__content');
    if (!content) return;

    // Pretitle (optional)
    const pretitleEl = content.querySelector('.cmp-teaser__pretitle');
    let pretitle = '';
    if (pretitleEl) {
      pretitle = pretitleEl.textContent.trim();
    }

    // Title (mandatory, usually inside h3 > a)
    let title = '';
    let titleEl = content.querySelector('.cmp-teaser__title');
    let ctaEl = null;
    if (titleEl) {
      // If there's a link, use it as CTA
      ctaEl = titleEl.querySelector('a');
      title = titleEl.textContent.trim();
    }

    // Description (optional)
    const descEl = content.querySelector('.cmp-teaser__description');
    let desc = '';
    if (descEl) {
      desc = descEl.textContent.trim();
    }

    // Compose the card cell content
    const cellContent = [];
    if (pretitle) {
      const pretitleDiv = document.createElement('div');
      pretitleDiv.textContent = pretitle;
      cellContent.push(pretitleDiv);
    }
    if (title) {
      // Use heading for title
      const h3 = document.createElement('h3');
      if (ctaEl) {
        // Use the existing anchor as the heading content
        h3.appendChild(ctaEl.cloneNode(true));
      } else {
        h3.textContent = title;
      }
      cellContent.push(h3);
    }
    if (desc) {
      const descDiv = document.createElement('div');
      descDiv.textContent = desc;
      cellContent.push(descDiv);
    }

    // Add to rows
    rows.push([cellContent]);
  });

  // 5. Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}