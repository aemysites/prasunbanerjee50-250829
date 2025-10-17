/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion root (the element with class 'cmp-accordion')
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Get all accordion items
  const items = Array.from(accordion.querySelectorAll('.cmp-accordion__item'));
  if (!items.length) return;

  // Build table rows
  const rows = [];
  // Header row as per block guidelines
  rows.push(['Accordion (accordion6)']);

  items.forEach((item) => {
    // Title: find the button, then the span with the title
    const button = item.querySelector('button.cmp-accordion__button');
    let title = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        title = titleSpan.textContent.trim();
      } else {
        title = button.textContent.trim();
      }
    }
    // Content: find the panel
    const panel = item.querySelector('.cmp-accordion__panel');
    let content = '';
    if (panel) {
      // Use the first child of the panel (which is usually the text container)
      // If there are multiple children, wrap them in a fragment
      const panelContentNodes = Array.from(panel.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
      if (panelContentNodes.length === 1) {
        content = panelContentNodes[0];
      } else if (panelContentNodes.length > 1) {
        const frag = document.createDocumentFragment();
        panelContentNodes.forEach(n => frag.appendChild(n.cloneNode(true)));
        content = frag;
      } else {
        content = '';
      }
    }
    rows.push([title, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block
  element.replaceWith(block);
}
