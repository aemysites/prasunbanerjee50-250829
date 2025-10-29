/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel39) block parser
  // Header row
  const headerRow = ['Carousel (carousel39)'];

  // Find the carousel track containing slides
  const slickTrack = element.querySelector('.slick-track');
  if (!slickTrack) return;

  // Get all visible slides (ignore slick-cloned)
  const slides = Array.from(slickTrack.children).filter(slide => {
    return slide.classList.contains('ds2-slider--slide') && !slide.classList.contains('slick-cloned');
  });

  // Build rows for each slide
  const rows = slides.map(slide => {
    // Image cell: find the <img> inside the slide
    let imgEl = null;
    const btn = slide.querySelector('.ds2-slider--zoom');
    if (btn) {
      const picture = btn.querySelector('picture');
      if (picture) {
        imgEl = picture.querySelector('img');
      }
    }
    const imgCell = imgEl ? imgEl : '';

    // Text cell: extract all text and elements from details div if present
    let textCell = '';
    const details = slide.querySelector('.ds2-slider-slide-details');
    if (details) {
      // Collect all child nodes (preserving elements like <a>, <strong>, etc.)
      const nodes = Array.from(details.childNodes)
        .map(node => {
          if (node.nodeType === 1) {
            return node.cloneNode(true);
          } else if (node.nodeType === 3) {
            // Text node
            return document.createTextNode(node.textContent);
          }
          return null;
        })
        .filter(n => n && n.textContent.trim() !== '');
      if (nodes.length === 1) textCell = nodes[0];
      else if (nodes.length > 1) textCell = nodes;
      else textCell = '';
    }
    return [imgCell, textCell];
  });

  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace original element
  element.replaceWith(table);
}
