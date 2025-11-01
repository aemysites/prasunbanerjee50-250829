/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row
  const headerRow = ['Cards (cards85)'];

  // Find section title and CTA
  const sectionTitle = element.querySelector('.cmp-title__text');
  const ctaBtn = element.querySelector('.cmp-button');

  // Find left column card container
  const leftCol = element.querySelector('.cmp-four-cell__second-row .cmp-four-cell__first-col');
  // Find right column card container
  const rightCol = element.querySelector('.cmp-four-cell__second-row .cmp-four-cell__second-col');

  // Helper to extract left column cards (image + text)
  function extractImageCards(container) {
    const cards = [];
    const teasers = container.querySelectorAll('.cmp-teaser');
    teasers.forEach(teaser => {
      const imageLink = teaser.querySelector('.cmp-teaser__image a img');
      if (imageLink) {
        const imgCell = imageLink.closest('a') || imageLink;
        const content = teaser.querySelector('.cmp-teaser__content');
        const textFragments = [];
        const pretitle = content && content.querySelector('.cmp-teaser__pretitle-link');
        if (pretitle) textFragments.push(pretitle);
        const title = content && content.querySelector('.cmp-teaser__title-link');
        if (title) {
          const heading = document.createElement('h3');
          heading.appendChild(title);
          textFragments.push(heading);
        }
        const desc = content && content.querySelector('.cmp-teaser__description');
        if (desc) textFragments.push(desc);
        cards.push([imgCell, textFragments]);
      }
    });
    return cards;
  }

  // Helper to extract right column cards (text only)
  function extractTextCards(container) {
    const cards = [];
    const teasers = container.querySelectorAll('.cmp-teaser');
    teasers.forEach(teaser => {
      if (!teaser.querySelector('.cmp-teaser__image')) {
        const content = teaser.querySelector('.cmp-teaser__content');
        const textFragments = [];
        const pretitle = content && content.querySelector('.cmp-teaser__pretitle-link');
        if (pretitle) textFragments.push(pretitle);
        const title = content && content.querySelector('.cmp-teaser__title-link');
        if (title) {
          const heading = document.createElement('h3');
          heading.appendChild(title);
          textFragments.push(heading);
        }
        cards.push(['', textFragments]);
      }
    });
    return cards;
  }

  // Compose card rows
  const leftCards = leftCol ? extractImageCards(leftCol) : [];
  const rightCards = rightCol ? extractTextCards(rightCol) : [];

  // Compose final table cells
  const cells = [headerRow];

  // Add section heading and CTA as a row if either exists
  if (sectionTitle || ctaBtn) {
    const wrapper = document.createElement('div');
    if (sectionTitle) wrapper.appendChild(sectionTitle.cloneNode(true));
    if (ctaBtn) wrapper.appendChild(ctaBtn.cloneNode(true));
    cells.push([wrapper, '']);
  }

  leftCards.forEach(card => cells.push(card));
  rightCards.forEach(card => cells.push(card));

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace element
  element.replaceWith(block);
}
