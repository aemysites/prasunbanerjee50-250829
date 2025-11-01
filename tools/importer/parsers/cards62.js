/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards62) block: two columns per card, first is lottie-player (as link), second is all text content
  const headerRow = ['Cards (cards62)'];
  const rows = [headerRow];

  // Find all card containers
  const cardContainers = element.querySelectorAll('.cmp-floating-awards-card');

  cardContainers.forEach(cardContainer => {
    const card = cardContainer.querySelector('.rad-awards-card');
    if (!card) return;

    // --- Image/Icon cell (first cell) ---
    let visualCell = document.createElement('span');
    visualCell.textContent = '';
    const lottie = card.querySelector('lottie-player');
    if (lottie && lottie.hasAttribute('src')) {
      const link = document.createElement('a');
      link.href = lottie.getAttribute('src');
      link.textContent = 'Animation';
      visualCell = link;
    }

    // --- Text content cell (second cell) ---
    const textCell = document.createElement('div');
    // Main statement
    const toggleBtn = card.querySelector('.rad-awards-card__toggle');
    if (toggleBtn) {
      const p = document.createElement('p');
      p.textContent = toggleBtn.textContent.trim();
      textCell.appendChild(p);
    }
    // Subheader
    const subheader = card.querySelector('.rad-awards-card__subheader');
    if (subheader) {
      const p = document.createElement('p');
      p.textContent = subheader.textContent.trim();
      textCell.appendChild(p);
    }
    // Description paragraphs
    const rte = card.querySelector('.rad-awards-card__rte');
    if (rte) {
      rte.querySelectorAll('p').forEach(par => {
        const txt = par.textContent.trim();
        if (txt && txt !== '\u00A0') {
          const p = document.createElement('p');
          p.textContent = txt;
          textCell.appendChild(p);
        }
      });
    }

    rows.push([visualCell, textCell]);
  });

  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
