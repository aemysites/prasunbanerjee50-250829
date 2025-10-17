/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards25) block parsing
  // 1. Header row
  const headerRow = ['Cards (cards25)'];

  // 2. Find the parent container for the cards
  // The cards are represented by pairs of swiper-slide elements in two swiper-containers:
  // - One for media (image/video)
  // - One for content (title, description, CTA)

  // Get both swiper-containers (media and content)
  const swiperMedia = element.querySelector('.cmp-multi-content__slider--media');
  const swiperContent = element.querySelector('.cmp-multi-content__slider--content');

  // Defensive: Ensure both exist
  if (!swiperMedia || !swiperContent) return;

  // Get all slides for media and content
  const mediaSlides = Array.from(swiperMedia.querySelectorAll('.cmp-multi-content__slide'));
  const contentSlides = Array.from(swiperContent.querySelectorAll('.cmp-multi-content__slide'));

  // Defensive: Ensure same number of slides
  const cardCount = Math.min(mediaSlides.length, contentSlides.length);

  // Collect card rows
  const rows = [headerRow];

  for (let i = 0; i < cardCount; i++) {
    // --- Media cell ---
    // For this block, use the poster image from the video as the card image
    const mediaSlide = mediaSlides[i];
    let imageEl = null;
    const posterImg = mediaSlide.querySelector('img.cmp-video__poster');
    if (posterImg) {
      imageEl = posterImg;
    } else {
      // Fallback: look for any img in the media slide
      imageEl = mediaSlide.querySelector('img');
    }
    // Defensive: If no image, use an empty string
    const mediaCell = imageEl ? imageEl : '';

    // --- Content cell ---
    const contentSlide = contentSlides[i];
    // Find the title (h4) and description (p)
    let titleEl = contentSlide.querySelector('.cmp-title__text');
    let descEl = contentSlide.querySelector('.cmp-text__paragraph');
    // Find CTA button ("Prikaži više")
    let ctaBtn = contentSlide.querySelector('.cmp-multi-content-item__content-toggle');
    // Compose content cell
    const contentCell = [];
    if (titleEl) contentCell.push(titleEl);
    if (descEl) contentCell.push(descEl);
    if (ctaBtn) contentCell.push(ctaBtn);
    // Defensive: If nothing found, use empty string
    rows.push([mediaCell, contentCell.length ? contentCell : '']);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
