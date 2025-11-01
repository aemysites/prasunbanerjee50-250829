/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion98)'];
  const rows = [headerRow];

  // Find all accordion items (each .accordioncard)
  const accordionCards = element.querySelectorAll('.accordioncard');

  accordionCards.forEach(card => {
    // Title: find the button > h3.rad-accordion__header-title
    const headerBtn = card.querySelector('button.rad-accordion__header');
    let title = '';
    if (headerBtn) {
      const h3 = headerBtn.querySelector('h3.rad-accordion__header-title');
      if (h3) {
        title = h3.textContent.trim();
      }
    }

    // Content: find the .rad-accordion__content-wrapper (contains all content for this item)
    // We'll use the wrapper's children as the content cell
    let contentCell = '';
    const contentWrapper = card.querySelector('.rad-accordion__content-wrapper');
    if (contentWrapper) {
      // Defensive: if contentWrapper has only one child (the .rad-accordion__content), use its children
      const content = contentWrapper.querySelector('.rad-accordion__content');
      if (content) {
        // Collect all children as an array, filter out empty divs
        const contentChildren = Array.from(content.children).filter(child => {
          // Remove empty .rad-accordion__more
          if (child.classList.contains('rad-accordion__more') && !child.textContent.trim()) return false;
          return true;
        });
        if (contentChildren.length === 1) {
          contentCell = contentChildren[0];
        } else if (contentChildren.length > 1) {
          contentCell = contentChildren;
        } else {
          contentCell = '';
        }
      } else {
        // fallback: use contentWrapper itself
        contentCell = contentWrapper;
      }
    }

    // Push row: [title, contentCell]
    rows.push([title, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
