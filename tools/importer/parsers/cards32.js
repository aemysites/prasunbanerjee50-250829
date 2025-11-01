/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards32) block: extract each leader card
  const headerRow = ['Cards (cards32)'];
  const rows = [headerRow];

  // Find all card elements
  const cards = Array.from(element.querySelectorAll('.rad-leaders__leader'));

  cards.forEach(card => {
    // Image: find the portrait image inside the card
    let imageEl = card.querySelector('.rad-leaders__leader-image-container img');
    // Defensive: if not found, try to find any img inside the card
    if (!imageEl) imageEl = card.querySelector('img');

    // Text content
    const nameEl = card.querySelector('.rad-leaders__leader-name');
    const roleEl = card.querySelector('.rad-leaders__leader-role');

    // Compose text cell
    const textCell = [];
    if (nameEl) {
      // Use a heading element for the name
      const hEl = document.createElement('h3');
      hEl.textContent = nameEl.textContent.trim();
      textCell.push(hEl);
    }
    if (roleEl) {
      const pEl = document.createElement('p');
      pEl.textContent = roleEl.textContent.trim();
      textCell.push(pEl);
    }

    // CTA link
    const ctaEl = card.querySelector('a');
    if (ctaEl) {
      // Use only the link text and href
      const link = document.createElement('a');
      link.href = ctaEl.href;
      // Find the button text
      const btnText = ctaEl.querySelector('.rad-button__text');
      link.textContent = btnText ? btnText.textContent.trim() : ctaEl.textContent.trim();
      link.target = ctaEl.target || '_self';
      textCell.push(link);
    }

    // Add row: [image, text content]
    rows.push([
      imageEl,
      textCell
    ]);
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
