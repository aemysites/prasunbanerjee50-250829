/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find hero image (background)
  function findHeroImage(el) {
    // Look for video poster image first
    const posterImg = el.querySelector('.cmp-video__poster, picture img');
    if (posterImg) return posterImg;
    // Fallback: any image inside the hero block
    const img = el.querySelector('img');
    return img || null;
  }

  // Helper: Find hero text content (title, paragraph, CTA)
  function findHeroTextContent(el) {
    // Title
    const title = el.querySelector('.cmp-title__text, h1, h2, h3, h4, h5, h6');
    // Paragraph
    const paragraph = el.querySelector('.cmp-text__paragraph, p');
    // CTA/link
    const cta = el.querySelector('.cmp-button, .cmp-multi-content-item__link a, a[href]');
    // Compose content
    const content = [];
    if (title) content.push(title);
    if (paragraph) content.push(paragraph);
    if (cta) content.push(cta);
    // Always reference existing elements, never clone or create new
    return content.length ? content : null;
  }

  // Find the multicontentgallery block (main hero block)
  const gallery = element.querySelector('.multicontentgallery');
  // Defensive: fallback to element itself if not found
  const heroBlock = gallery || element;

  // Find image (background)
  let heroImage = null;
  // The image is inside the video poster
  const mediaSwiper = heroBlock.querySelector('.cmp-multi-content__slider--media swiper-slide');
  if (mediaSwiper) {
    heroImage = findHeroImage(mediaSwiper);
  }
  // Defensive: fallback to any image inside heroBlock
  if (!heroImage) {
    heroImage = findHeroImage(heroBlock);
  }

  // Find text content (title, paragraph, CTA)
  let heroTextContent = null;
  const contentSwiper = heroBlock.querySelector('.cmp-multi-content__slider--content swiper-slide');
  if (contentSwiper) {
    heroTextContent = findHeroTextContent(contentSwiper);
  }
  // Defensive: fallback to any text content inside heroBlock
  if (!heroTextContent) {
    heroTextContent = findHeroTextContent(heroBlock);
  }

  // Compose table rows
  const headerRow = ['Hero (hero78)'];
  const imageRow = [heroImage ? heroImage : ''];
  const contentRow = [heroTextContent ? heroTextContent : ''];
  const cells = [headerRow, imageRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
