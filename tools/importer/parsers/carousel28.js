/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  const carousel = element.querySelector('.ds2-model-carousel');
  if (!carousel) return;

  // Get carousel heading and description (top text)
  let heading = '';
  let description = '';
  const head = carousel.querySelector('.ds2-model-carousel--head');
  if (head) {
    const h2 = head.querySelector('h2');
    if (h2) heading = h2.textContent.trim();
    const descContainer = head.querySelector('.ds2-expand--body-copy-container');
    if (descContainer) {
      const desc = descContainer.querySelector('.ds2-cms-output');
      if (desc) description = desc.textContent.trim();
    }
  }

  // Get all image slides
  const imageSlides = carousel.querySelectorAll('.ds2-model-carousel--image-slide');
  // Get all content slides
  const contentSlides = carousel.querySelectorAll('.ds2-content-slider--description');

  // Build the table rows
  const rows = [];
  // Header row (must match block name exactly)
  rows.push(['Carousel (carousel28)']);

  // Add each slide
  for (let i = 0; i < Math.max(imageSlides.length, contentSlides.length); i++) {
    // Get image for this slide
    let img = null;
    if (imageSlides[i]) {
      img = imageSlides[i].querySelector('img');
    }

    // Get text content for this slide
    let textContent = [];
    // For the first slide, prepend heading/description as plain text if present
    if (i === 0 && (heading || description)) {
      if (heading) {
        const h = document.createElement('h2');
        h.textContent = heading;
        textContent.push(h);
      }
      if (description) {
        const p = document.createElement('p');
        p.textContent = description;
        textContent.push(p);
      }
    }
    if (contentSlides[i]) {
      // Title
      const title = contentSlides[i].querySelector('h3');
      if (title) {
        const h3 = document.createElement('h3');
        h3.textContent = title.textContent.trim();
        textContent.push(h3);
      }
      // CTA button (if any)
      const buttonList = contentSlides[i].querySelector('.ds2-buttonlist');
      if (buttonList) {
        const btn = buttonList.querySelector('a');
        if (btn) {
          const a = document.createElement('a');
          a.href = btn.href;
          a.textContent = btn.textContent.trim();
          textContent.push(a);
        }
      }
    }
    if (textContent.length === 0) textContent = [''];
    rows.push([img, textContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
