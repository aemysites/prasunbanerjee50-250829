/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel block header row
  const headerRow = ['Carousel (carousel77)'];
  const cells = [headerRow];

  // Select all slides, including clones, but filter by unique image src
  const slideNodes = Array.from(element.querySelectorAll('.ds2-slider--slide'));
  const seenSrc = new Set();
  const uniqueSlides = [];
  slideNodes.forEach(slide => {
    const img = slide.querySelector('img');
    if (img && !seenSrc.has(img.src)) {
      seenSrc.add(img.src);
      uniqueSlides.push(slide);
    }
  });

  uniqueSlides.forEach(slide => {
    // Image: find the <img> inside the slide
    const img = slide.querySelector('img');
    // Play button overlay: include if present
    const playBtn = slide.querySelector('.ds2-video-player--play');
    let imgCell;
    if (img) {
      // Create a container for image + play button
      const container = document.createElement('div');
      container.appendChild(img.cloneNode(true));
      if (playBtn) container.appendChild(playBtn.cloneNode(true));
      imgCell = container;
    } else {
      imgCell = '';
    }
    // Text: gather all content from .ds2-slider-slide-details
    let textContent = '';
    const details = slide.querySelector('.ds2-slider-slide-details');
    if (details) {
      textContent = details.cloneNode(true);
    }
    // First cell: image + play button
    // Second cell: text content (optional)
    const row = [imgCell, textContent || ''];
    cells.push(row);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
