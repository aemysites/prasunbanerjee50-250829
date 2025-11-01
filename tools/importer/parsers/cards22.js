/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Cards block header row
  const headerRow = ['Cards (cards22)'];

  // 2. Find the card container (second row of the card listing block)
  const cardContainer = element.querySelector('.cmp-card-listing_second-row .cmp-container');
  if (!cardContainer) return;

  // 3. Find all card elements (teaser cards)
  const cardEls = cardContainer.querySelectorAll('.teaser.content-card');
  if (!cardEls.length) return;

  // 4. Build card rows
  const cardRows = Array.from(cardEls).map(cardEl => {
    // --- IMAGE CELL ---
    let imageEl = null;
    const img = cardEl.querySelector('.cmp-teaser__image img');
    if (img) {
      imageEl = img;
    }

    // --- TEXT CELL ---
    const textCell = document.createElement('div');
    // Card Title (as <strong> for visual match)
    const title = cardEl.querySelector('.cmp-teaser__title');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textCell.appendChild(strong);
      textCell.appendChild(document.createElement('br'));
    }
    // Card Description (may contain links)
    const desc = cardEl.querySelector('.cmp-teaser__description');
    if (desc) {
      Array.from(desc.childNodes).forEach(node => {
        textCell.appendChild(node.cloneNode(true));
      });
    }
    return [imageEl, textCell];
  });

  // 5. Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...cardRows
  ], document);

  // 6. Insert heading and description above the cards table
  const heading = element.querySelector('.cmp-card-listing_first-row_left-col .cmp-title__text');
  const desc = element.querySelector('.cmp-card-listing_first-row_left-col .cmp-text .cmp-text__paragraph-default');
  if (heading || desc) {
    const introDiv = document.createElement('div');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      introDiv.appendChild(h2);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      introDiv.appendChild(p);
    }
    element.replaceWith(introDiv);
    introDiv.insertAdjacentElement('afterend', table);
  } else {
    element.replaceWith(table);
  }
}
