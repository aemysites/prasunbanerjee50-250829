/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards75) block: 2 columns, multiple rows
  // Header row
  const headerRow = ['Cards (cards75)'];
  const rows = [headerRow];

  // Find all card containers
  const cardContainers = element.querySelectorAll('.cmp-floating-awards-card');

  cardContainers.forEach(cardContainer => {
    // Each cardContainer contains one card
    const card = cardContainer.querySelector('.rad-awards-card');
    if (!card) return;

    // --- Image/Icon cell ---
    // Use the lottie-player as the image/icon (convert to a link to its src)
    let iconCell = '';
    const motionBg = card.querySelector('.rad-awards-card__motion-bg');
    if (motionBg) {
      const lottie = motionBg.querySelector('lottie-player');
      if (lottie && lottie.src) {
        // Create a link to the lottie src (MANDATORY: must be present)
        const link = document.createElement('a');
        link.href = lottie.src;
        link.textContent = lottie.src;
        iconCell = link;
      }
    }

    // --- Text cell ---
    // Title: use the button text (visible heading in screenshot)
    let titleText = '';
    const toggleBtn = card.querySelector('.rad-awards-card__toggle');
    if (toggleBtn) {
      titleText = toggleBtn.textContent.trim();
    }
    // Description: use the .rad-awards-card__rte content if present
    let descContent = '';
    const rte = card.querySelector('.rad-awards-card__rte');
    if (rte) {
      descContent = rte.cloneNode(true);
    }

    // Compose text cell
    const textCellElements = [];
    if (titleText) {
      const h3 = document.createElement('h3');
      h3.textContent = titleText;
      textCellElements.push(h3);
    }
    if (descContent) {
      textCellElements.push(descContent);
    }

    // Add row: [iconCell, textCellElements]
    rows.push([
      iconCell || '',
      textCellElements.length > 0 ? textCellElements : ''
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
