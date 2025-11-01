/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards97) block parsing
  // 1. Header row
  const headerRow = ['Cards (cards97)'];

  // 2. Find the cards container
  const grid = element.querySelector('.rad-awards-grid__grid');
  if (!grid) return;

  // 3. Find all card elements
  const cardEls = grid.querySelectorAll('.cmp-floating-awards-card');
  if (!cardEls.length) return;

  // 4. Parse each card
  const rows = [];
  cardEls.forEach((cardEl) => {
    // --- IMAGE/ICON CELL ---
    let imageCell = null;
    const motionBg = cardEl.querySelector('.rad-awards-card__motion-bg');
    if (motionBg) {
      const lottie = motionBg.querySelector('lottie-player');
      if (lottie && lottie.getAttribute('src')) {
        // Convert lottie-player to a link to its src
        const lottieSrc = lottie.getAttribute('src');
        const a = document.createElement('a');
        a.href = lottieSrc;
        a.textContent = lottieSrc;
        imageCell = a;
      }
    }
    if (!imageCell) {
      const img = cardEl.querySelector('img');
      if (img) imageCell = img;
    }

    // --- TEXT CELL ---
    const textCellContent = [];
    // Use the visible button text as the card title (not aria-hidden h3)
    const btn = cardEl.querySelector('.rad-awards-card__toggle');
    if (btn) {
      const h3 = document.createElement('h3');
      h3.textContent = btn.textContent;
      textCellContent.push(h3);
    }
    // Description (inside .rad-awards-card__rte)
    const desc = cardEl.querySelector('.rad-awards-card__rte');
    if (desc) {
      textCellContent.push(desc);
    }
    // CTA (link)
    const cta = cardEl.querySelector('a.rad-button');
    if (cta) {
      textCellContent.push(cta);
    }
    rows.push([
      imageCell || '',
      textCellContent.length ? textCellContent : '',
    ]);
  });

  // 5. Add heading above table if present
  const headingEl = element.querySelector('.rad-awards-grid__heading');
  if (headingEl) {
    element.parentNode.insertBefore(headingEl, element);
  }

  // 6. Build table
  const tableCells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);

  // 7. Replace original element
  element.replaceWith(table);
}
