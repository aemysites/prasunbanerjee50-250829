/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero46) block: 1 column, 3 rows
  // Row 1: Block name
  // Row 2: Background image (optional, none in this case)
  // Row 3: Title, subheading (optional), CTA (optional)

  // Helper: get direct child by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Find the content container
  const content = element.querySelector('.cmp-teaser__content');
  if (!content) return;

  // Extract pretitle, title, description, CTA
  const pretitle = getDirectChildByClass(content, 'cmp-teaser__pretitle');
  const title = content.querySelector('.cmp-teaser__title');
  const description = content.querySelector('.cmp-teaser__description');
  const actionContainer = content.querySelector('.cmp-teaser__action-container');
  const cta = actionContainer ? actionContainer.querySelector('a') : null;

  // Compose the content cell
  const cellContent = [];
  if (pretitle && pretitle.textContent.trim()) {
    const pre = document.createElement('div');
    pre.textContent = pretitle.textContent.trim();
    pre.style.fontWeight = 'bold';
    cellContent.push(pre);
  }
  if (title && title.textContent.trim()) {
    // Use an <h1> for the main heading
    const h1 = document.createElement('h1');
    h1.textContent = title.textContent.trim();
    cellContent.push(h1);
  }
  // No subheading in this example
  // Description is empty in this example
  if (cta) {
    cellContent.push(cta);
  }

  // Build the table rows
  const headerRow = ['Hero (hero46)'];
  const imageRow = ['']; // No background image in this example
  const contentRow = [cellContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
