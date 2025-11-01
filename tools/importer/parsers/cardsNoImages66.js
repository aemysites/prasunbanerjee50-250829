/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cardsNoImages66) block
  const headerRow = ['Cards (cardsNoImages66)'];
  const rows = [headerRow];

  // Find all card nodes
  const cardNodes = element.querySelectorAll('.teaser.content-card');

  cardNodes.forEach(card => {
    const content = card.querySelector('.cmp-teaser__content');
    if (!content) return;

    // Create a fragment for the card's content
    const frag = document.createDocumentFragment();

    // Pretitle (always uppercase, remove extra spaces)
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle) {
      const pretitleText = pretitle.textContent.replace(/\s*-\s*/g, '-').trim().toUpperCase();
      frag.append(document.createTextNode(pretitleText + '\n'));
    }

    // Title (always plain text, never a link)
    const title = content.querySelector('.cmp-teaser__title');
    if (title) {
      frag.append(document.createTextNode(title.textContent.trim() + '\n'));
    }

    // Description (plain text only)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) {
      frag.append(document.createTextNode(desc.textContent.trim()));
    }

    // Add this card as a row (single cell)
    rows.push([frag]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
