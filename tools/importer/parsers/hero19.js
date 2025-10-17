/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get direct child swiper containers
  const swiperContainers = Array.from(element.querySelectorAll(':scope > div > swiper-container'));
  // Find the media swiper (background image/video)
  const mediaSwiper = swiperContainers.find(swiper => swiper.classList.contains('cmp-multi-content__slider--media'));
  // Find the content swiper (text, CTA)
  const contentSwiper = swiperContainers.find(swiper => swiper.classList.contains('cmp-multi-content__slider--content'));

  // --- Row 2: Background image (from video poster img) ---
  let backgroundImageEl = null;
  if (mediaSwiper) {
    // Look for an <img> inside the media swiper
    const img = mediaSwiper.querySelector('img');
    if (img) backgroundImageEl = img;
  }

  // --- Row 3: Title, paragraph, CTA ---
  let titleEl = null, paragraphEl = null, ctaEl = null;
  if (contentSwiper) {
    // Find the active slide
    const activeSlide = contentSwiper.querySelector('.cmp-multi-content__slide--active');
    if (activeSlide) {
      // Title
      const titleTextEl = activeSlide.querySelector('.cmp-multi-content-item__title .cmp-title__text');
      if (titleTextEl) {
        // Convert <p> to <h1> for semantic heading, trim whitespace
        const h1 = document.createElement('h1');
        h1.textContent = titleTextEl.textContent.trim();
        titleEl = h1;
      }
      // Paragraph (get all text from .cmp-text)
      const textContainer = activeSlide.querySelector('.cmp-multi-content-item__text .cmp-text');
      if (textContainer) {
        let paragraphText = '';
        textContainer.childNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            paragraphText += node.textContent.trim() + ' ';
          } else if (node.nodeType === Node.TEXT_NODE) {
            paragraphText += node.textContent.trim() + ' ';
          }
        });
        paragraphText = paragraphText.trim();
        if (paragraphText) {
          const p = document.createElement('p');
          p.textContent = paragraphText;
          paragraphEl = p;
        }
      }
      // Only include the actual CTA link (Saznajte više)
      const ctaLink = activeSlide.querySelector('.cmp-multi-content-item__link a');
      if (ctaLink) {
        const a = document.createElement('a');
        a.href = ctaLink.getAttribute('href');
        a.textContent = ctaLink.textContent.trim();
        ctaEl = a;
      }
    }
  }

  // --- Table Construction ---
  const headerRow = ['Hero (hero19)'];
  const imageRow = [backgroundImageEl ? backgroundImageEl : ''];
  // Compose content cell: only visible elements
  const contentCell = [];
  if (titleEl) contentCell.push(titleEl);
  if (paragraphEl) contentCell.push(paragraphEl);
  if (ctaEl) contentCell.push(ctaEl);
  const contentRow = [contentCell.length ? contentCell : ''];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
