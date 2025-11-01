/* global WebImporter */
export default function parse(element, { document }) {
  // Find the mega-accordion container (the block root)
  const accordionRoot = element.querySelector('.rad-mega-accordion__container');
  if (!accordionRoot) return;

  // Find all accordion items (each is a card)
  const accordionItems = Array.from(accordionRoot.querySelectorAll('.rad-mega-accordion__item'));

  // Prepare the table rows
  const rows = [];

  // Header row: block name
  rows.push(['Accordion (accordion83)']);

  // For each accordion item, extract the title and content
  accordionItems.forEach((item) => {
    // Title: get the h2 text (or fallback to first heading)
    let title = item.querySelector('h2, h3, h4, h5, h6');
    let titleContent;
    if (title) {
      // If the heading contains a link, use the link element itself
      const link = title.querySelector('a');
      titleContent = link ? link : title;
    } else {
      // fallback: use aria-label from icon button
      const btn = item.querySelector('.rad-mega-accordion__icon');
      titleContent = btn && btn.getAttribute('aria-label') ? btn.getAttribute('aria-label') : '';
    }

    // Content: the content wrapper
    const contentWrapper = item.querySelector('.rad-mega-accordion__content-wrapper');
    let contentCell = '';
    if (contentWrapper) {
      // Find the deepest container with children
      let container = contentWrapper;
      while (
        container &&
        container.children.length === 1 &&
        container.firstElementChild &&
        container.firstElementChild.children.length > 0
      ) {
        container = container.firstElementChild;
      }
      // Now, collect all children
      let contentNodes = Array.from(container.children);
      // Remove empty containers
      contentNodes = contentNodes.filter(node => {
        if (node.textContent && node.textContent.trim()) return true;
        if (node.querySelector && node.querySelector('*')) return true;
        return false;
      });
      // If nothing left, fallback to container itself
      if (contentNodes.length === 0) contentNodes = [container];
      contentCell = contentNodes;
    }
    rows.push([titleContent, contentCell]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
