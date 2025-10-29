/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Carousel (carousel107)'];
  const rows = [headerRow];

  // Only add carousel slides from .cmp-colorswitch__slideout-wrapper
  const slideWrappers = element.querySelectorAll('.cmp-colorswitch__slideout-wrapper');
  slideWrappers.forEach((slide) => {
    // Image extraction
    const img = slide.querySelector('.cmp-image__image');
    let imageCell = null;
    if (img) {
      imageCell = img;
    } else {
      const fallbackImg = slide.querySelector('.cmp-colorswitch__slideout-image img');
      if (fallbackImg) imageCell = fallbackImg;
    }
    // Text extraction
    const title = slide.querySelector('.cmp-colorswitch__slideout-title');
    const descContainer = slide.querySelector('.cmp-colorswitch__slideout-text');
    const textCell = [];
    if (title) {
      const heading = document.createElement('h2');
      heading.innerHTML = title.innerHTML;
      textCell.push(heading);
    }
    if (descContainer) {
      const p = descContainer.querySelector('p');
      if (p) {
        textCell.push(p);
      } else if (descContainer.textContent.trim()) {
        const descP = document.createElement('p');
        descP.textContent = descContainer.textContent.trim();
        textCell.push(descP);
      }
    }
    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
