/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Cards block
  const headerRow = ['Cards (cards86)'];

  // Find all card elements inside the main container
  // The cards are elements with class 'expertcards profilecards contentfragment card'
  const cardSelector = '.expertcards.profilecards.contentfragment.card';
  const cards = element.querySelectorAll(cardSelector);

  // Prepare rows for each card
  const rows = Array.from(cards).map((card) => {
    // Image: find the first <img> inside the card
    const img = card.querySelector('img');

    // Text content: name, title, LinkedIn link
    const content = card.querySelector('.cmp-expert-card__content');
    let textParts = [];
    if (content) {
      // Name (as heading)
      const name = content.querySelector('.cmp-expert-card__name');
      if (name) {
        // Use a <strong> for the heading style
        const strong = document.createElement('strong');
        strong.textContent = name.textContent.trim();
        textParts.push(strong);
      }
      // Title/Description
      const title = content.querySelector('.cmp-expert-card__title');
      if (title) {
        const div = document.createElement('div');
        div.textContent = title.textContent.trim();
        textParts.push(div);
      }
      // LinkedIn link
      const link = content.querySelector('.cmp-expert-card__link a');
      if (link) {
        // Retain the original link element
        textParts.push(document.createElement('br'));
        textParts.push(link);
      }
    }

    // Build the row: [image, text content]
    return [img, textParts];
  });

  // Compose the table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
