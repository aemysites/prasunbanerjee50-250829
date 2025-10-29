/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: extract image and ALL text content from a swiper-slide
  function extractCardContent(slide) {
    // Find poster image (prefer .cmp-video__poster)
    const posterImg = slide.querySelector('img.cmp-video__poster');
    const img = posterImg || slide.querySelector('img');

    // Find text content for the card
    let title = '';
    let description = '';

    // Get all visible text content from media and its descendants, preserving order
    const media = slide.querySelector('.cmp-multi-content-item__media');
    if (media) {
      // Try to get title from data-tracking-regionid (last segment after '¦')
      const tracking = media.getAttribute('data-tracking-regionid') || '';
      const parts = tracking.split('¦');
      if (parts.length > 0) {
        title = parts[parts.length - 1].trim();
      }
      // Get all text nodes inside media (including descendants)
      let textContent = '';
      const walker = document.createTreeWalker(media, NodeFilter.SHOW_TEXT, null);
      let node;
      while ((node = walker.nextNode())) {
        const txt = node.textContent.replace(/\s+/g, ' ').trim();
        if (txt) {
          textContent += txt + ' ';
        }
      }
      textContent = textContent.trim();
      // If the title appears at the start, remove it
      if (title && textContent.toLowerCase().startsWith(title.toLowerCase())) {
        description = textContent.slice(title.length).trim();
      } else {
        description = textContent;
      }
    }

    // Compose card text
    const cardText = document.createElement('div');
    if (title) {
      const heading = document.createElement('h3');
      heading.textContent = title;
      cardText.appendChild(heading);
    }
    if (description) {
      const desc = document.createElement('p');
      desc.textContent = description;
      cardText.appendChild(desc);
    }
    return [img, cardText];
  }

  // Find all swiper-slide elements (each is a card)
  const slides = Array.from(element.querySelectorAll('swiper-slide'));
  const rows = slides.map(slide => extractCardContent(slide));

  // Table header row
  const headerRow = ['Cards (cards69)'];
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace element
  element.replaceWith(block);
}
