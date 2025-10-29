/* global WebImporter */
export default function parse(element, { document }) {
  // Find the textmediateaser block (contains headline, description, and BMW iX3 image)
  const heroTextSection = element.querySelector('.textmediateaser');

  // --- Extract the correct background image: BMW iX3 vehicle image ---
  let backgroundImg = null;
  if (heroTextSection) {
    const img = heroTextSection.querySelector('img');
    if (img) backgroundImg = img;
  }

  // --- Extract headline and description ---
  let headlineEl = null;
  let descriptionEl = null;
  if (heroTextSection) {
    headlineEl = heroTextSection.querySelector('h2');
    descriptionEl = heroTextSection.querySelector('.cmp-textmediateaser__description');
  }

  // Compose the text content cell
  const textContent = [];
  if (headlineEl) textContent.push(headlineEl);
  if (descriptionEl) textContent.push(descriptionEl);

  // Table construction
  const headerRow = ['Hero (hero80)'];
  const imageRow = [backgroundImg ? backgroundImg : ''];
  const contentRow = [textContent.length ? textContent : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
