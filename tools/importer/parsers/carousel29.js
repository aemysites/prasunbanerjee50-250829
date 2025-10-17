/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all slides from a carousel block
  function getSlides(mediaSwiper, contentSwiper) {
    const mediaSlides = Array.from(mediaSwiper.querySelectorAll('swiper-slide'));
    const contentSlides = Array.from(contentSwiper.querySelectorAll('swiper-slide'));
    // Defensive: Only pair up to the minimum length
    const count = Math.min(mediaSlides.length, contentSlides.length);
    const slides = [];
    for (let i = 0; i < count; i++) {
      // Get image from media slide
      let img = null;
      const picture = mediaSlides[i].querySelector('picture');
      if (picture) {
        img = picture.querySelector('img');
      }
      // Get content from content slide
      let contentWrapper = contentSlides[i].querySelector('.cmp-multi-content-item__wrapper');
      let title = null;
      let description = null;
      const contentCell = [];
      if (contentWrapper) {
        // Title
        const titleEl = contentWrapper.querySelector('.cmp-title h4, .cmp-title__text');
        if (titleEl) {
          title = document.createElement('h4');
          title.textContent = titleEl.textContent.trim();
          contentCell.push(title);
        }
        // Description
        const descEl = contentWrapper.querySelector('.cmp-text__paragraph');
        if (descEl) {
          description = document.createElement('p');
          description.textContent = descEl.textContent.trim();
          contentCell.push(description);
        }
        // CTA link (e.g. 'Saznajte više')
        const ctaEl = contentWrapper.querySelector('.cmp-multi-content-item__link a');
        if (ctaEl) {
          contentCell.push(ctaEl);
        }
        // Expand/collapse button ("Prikaži više") as CTA link at bottom
        const expandEl = contentWrapper.querySelector('.cmp-multi-content-item__content-toggle');
        if (expandEl) {
          let btnText = expandEl.getAttribute('data-text-more') || expandEl.textContent;
          if (btnText && btnText.trim()) {
            // Use <a> for CTA as per block description
            const expandLink = document.createElement('a');
            expandLink.textContent = btnText.trim();
            expandLink.href = '#';
            expandLink.setAttribute('role', 'button');
            contentCell.push(expandLink);
          }
        }
      }
      slides.push([
        img || '',
        contentCell.length ? contentCell : ''
      ]);
    }
    return slides;
  }

  // Find all carousel blocks in the tabs
  const tabPanels = element.querySelectorAll('[role="tabpanel"]');
  tabPanels.forEach(tabPanel => {
    const multiContent = tabPanel.querySelector('.cmp-multi-content');
    if (!multiContent) return;
    // Find media and content swipers
    const mediaSwiper = multiContent.querySelector('.cmp-multi-content__slider--media');
    const contentSwiper = multiContent.querySelector('.cmp-multi-content__slider--content');
    if (!mediaSwiper || !contentSwiper) return;
    // Build table rows
    const headerRow = ['Carousel (carousel29)'];
    const rows = [headerRow];
    const slides = getSlides(mediaSwiper, contentSwiper);
    rows.push(...slides);
    // Create block table
    const block = WebImporter.DOMUtils.createTable(rows, document);
    // Replace the carousel block in the DOM
    multiContent.replaceWith(block);
  });
}
