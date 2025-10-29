/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards43) block: 2 columns, multiple rows, each row = [image, text]

  // Helper to get all card slides
  const slides = Array.from(
    element.querySelectorAll('.ds2-showroom-multicontent__slide')
  );

  // Build header row
  const headerRow = ['Cards (cards43)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Image: find the first img inside .ds2-showroom-multicontent__item-image
    const imgContainer = slide.querySelector('.ds2-showroom-multicontent__item-image');
    let img = imgContainer ? imgContainer.querySelector('img') : null;

    // Text: get all content from the body
    const body = slide.querySelector('.ds2-showroom-multicontent__item-body');
    const textCell = [];
    if (body) {
      // Title (h4)
      const title = body.querySelector('h4');
      if (title) textCell.push(title);
      // Description: get all paragraphs (not just first)
      const descContainer = body.querySelector('.ds2-showroom-multicontent__item-text');
      if (descContainer) {
        // Get all paragraphs, including info icons
        descContainer.querySelectorAll('p').forEach(p => {
          textCell.push(p);
        });
      }
      // CTA link
      const cta = body.querySelector('.ds2-showroom-multicontent__item-link');
      if (cta) textCell.push(cta);
    }
    rows.push([img, textCell]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
