/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block requirements
  const headerRow = ['Carousel (carousel5)'];
  const rows = [headerRow];

  // Find all swiper-slide elements (each is a slide)
  const slides = element.querySelectorAll('swiper-slide');

  slides.forEach((slide) => {
    // --- IMAGE CELL ---
    let imgCell = '';
    const img = slide.querySelector('img');
    if (img) imgCell = img;

    // --- TEXT CELL ---
    let textCell = '';
    // Try to get all visible text from the slide, including headings and descriptions
    // The overlay card text is not inside the video, but as text nodes in .cmp-multi-content-item__media
    const mediaDiv = slide.querySelector('.cmp-multi-content-item__media');
    let heading = '', desc = '';
    if (mediaDiv) {
      // Collect all visible text nodes, ignoring video, img, button, picture
      function getVisibleTextNodes(node, arr) {
        if (node.nodeType === Node.ELEMENT_NODE && ['VIDEO', 'IMG', 'BUTTON', 'PICTURE'].includes(node.tagName)) return;
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          arr.push(node.textContent.trim());
        }
        node.childNodes && node.childNodes.forEach(child => getVisibleTextNodes(child, arr));
      }
      const texts = [];
      getVisibleTextNodes(mediaDiv, texts);
      // Use the first non-empty text as heading, and the rest as description
      if (texts.length > 0) {
        heading = texts[0];
        if (texts.length > 1) desc = texts.slice(1).join(' ');
      }
    }
    // Fallback: if no visible text, use video aria-label/aria-description
    if (!heading) {
      const video = slide.querySelector('video');
      if (video) {
        heading = video.getAttribute('aria-label') || '';
        desc = video.getAttribute('aria-description') || '';
      }
    }
    // Compose text cell if we have any text
    if (heading || desc) {
      const frag = document.createDocumentFragment();
      if (heading) {
        const h2 = document.createElement('h2');
        h2.textContent = heading;
        frag.appendChild(h2);
      }
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc;
        frag.appendChild(p);
      }
      textCell = frag;
    }
    rows.push([imgCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
