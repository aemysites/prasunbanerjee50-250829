/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel96) block
  const headerRow = ['Carousel (carousel96)'];

  // Helper to get image from .ds2-slider--slide
  function getSlideImage(slide) {
    // Look for <picture> or <img> inside slide
    const picture = slide.querySelector('picture');
    if (picture) {
      // Use the <img> inside <picture>
      const img = picture.querySelector('img');
      if (img) return img;
    }
    // Fallback: any <img> inside slide
    const img = slide.querySelector('img');
    if (img) return img;
    return null;
  }

  // Helper to get all text content from .ds2-slider--bottom
  function getSlideText(bottomSlide) {
    // Get all text content from .ds2-slider-slide-details
    const details = bottomSlide.querySelector('.ds2-slider-slide-details');
    if (details) {
      // Collect all child nodes (including <p>, links, etc.)
      const nodes = Array.from(details.childNodes).filter(node => {
        // Only include elements or meaningful text
        return (node.nodeType === Node.ELEMENT_NODE) || (node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      });
      // If only one node and it's a <p>, return it directly
      if (nodes.length === 1 && nodes[0].nodeType === Node.ELEMENT_NODE) {
        return nodes[0];
      }
      // Otherwise, wrap all nodes in a <div>
      const div = document.createElement('div');
      nodes.forEach(node => div.appendChild(node.cloneNode(true)));
      return div;
    }
    return '';
  }

  // Find main slides and bottom slides
  const mainSlides = Array.from(element.querySelectorAll('.ds2-slider--main .ds2-slider--slide'));
  const bottomSlides = Array.from(element.querySelectorAll('.ds2-slider--bottom .ds2-slider--slide'));

  // Build rows for each slide
  const rows = [headerRow];
  for (let i = 0; i < mainSlides.length; i++) {
    const img = getSlideImage(mainSlides[i]);
    // Defensive: If no image, skip this slide
    if (!img) continue;
    // Try to get text from corresponding bottom slide
    let text = '';
    if (bottomSlides[i]) {
      text = getSlideText(bottomSlides[i]);
    }
    rows.push([img, text]);
  }

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
