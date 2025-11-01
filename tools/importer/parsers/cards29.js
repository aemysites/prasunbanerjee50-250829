/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards29) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards29)'];
  const rows = [headerRow];

  // Find all card containers within the grid
  // Each card is inside a div.cmp-floating-awards-card
  const cardContainers = element.querySelectorAll('.cmp-floating-awards-card');

  cardContainers.forEach((cardContainer) => {
    // The actual card content is inside .rad-awards-card
    const card = cardContainer.querySelector('.rad-awards-card');
    if (!card) return;

    // --- IMAGE/ICON CELL ---
    // Find the lottie-player (acts as the card's visual/illustration)
    let visual = card.querySelector('.rad-awards-card__lp');
    let visualCell = visual || '';

    // --- TEXT CELL ---
    // Collect all text content from the card: title, subheader, description, CTA
    const textCellContent = [];

    // Title: Prefer .rad-awards-card__title, fallback to button text
    let titleEl = card.querySelector('.rad-awards-card__title');
    let titleText = titleEl ? titleEl.textContent.trim() : '';
    if (!titleText) {
      const btn = card.querySelector('button');
      if (btn) titleText = btn.textContent.trim();
    }
    if (titleText) {
      const strong = document.createElement('strong');
      strong.textContent = titleText;
      textCellContent.push(strong);
    }

    // Subheader (h4)
    let subheaderEl = card.querySelector('.rad-awards-card__subheader');
    if (subheaderEl && subheaderEl.textContent.trim()) {
      // Use <h4> for semantic accuracy
      const h4 = document.createElement('h4');
      h4.textContent = subheaderEl.textContent.trim();
      textCellContent.push(h4);
    }

    // Description (rich text)
    let descEl = card.querySelector('.rad-awards-card__rte');
    if (descEl) {
      // Only append the children (e.g., <p>), not the wrapper div
      Array.from(descEl.childNodes).forEach((node) => {
        textCellContent.push(node);
      });
    }

    // CTA: .rad-button.rad-button--ghost (may not exist)
    let ctaEl = card.querySelector('.rad-button.rad-button--ghost');
    if (ctaEl) {
      textCellContent.push(ctaEl);
    }

    // Defensive: always provide at least title
    if (textCellContent.length === 0 && titleText) {
      textCellContent.push(document.createTextNode(titleText));
    }

    rows.push([
      visualCell,
      textCellContent.length === 1 ? textCellContent[0] : textCellContent
    ]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
