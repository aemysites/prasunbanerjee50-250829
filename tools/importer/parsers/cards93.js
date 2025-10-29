/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards93) block header row
  const headerRow = ['Cards (cards93)'];

  // Find carousel content area
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Find all card slides
  const slides = carouselContent.querySelectorAll('[data-cmp-hook-carousel="item"]');
  if (!slides.length) return;

  // Helper: extract image element (reference, not clone)
  function getCardImage(slide) {
    // Prefer .cmp-video__poster img
    const img = slide.querySelector('.cmp-video__poster');
    if (img) return img;
    // Fallback: first img
    return slide.querySelector('img');
  }

  // Helper: extract all text content (title + description)
  function getCardText(slide) {
    const frag = document.createDocumentFragment();
    // Title: get all elements in .title block
    const titleBlock = slide.querySelector('.title');
    if (titleBlock) {
      Array.from(titleBlock.querySelectorAll('*')).forEach(el => frag.append(el));
    }
    // Description: get all elements in .text block
    const descBlock = slide.querySelector('.text');
    if (descBlock) {
      Array.from(descBlock.querySelectorAll('*')).forEach(el => frag.append(el));
    }
    return frag;
  }

  // Compose table rows
  const rows = Array.from(slides).map(slide => {
    const img = getCardImage(slide);
    const textFrag = getCardText(slide);
    // If both are missing, skip
    if (!img && !textFrag.hasChildNodes()) return null;
    return [img, textFrag];
  }).filter(Boolean);

  // Create table with header and card rows
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace element with table
  element.replaceWith(table);
}
