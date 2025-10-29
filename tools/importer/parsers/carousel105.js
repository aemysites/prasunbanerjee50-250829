/* global WebImporter */
export default function parse(element, { document }) {
  // Find the mediashowcase carousel block
  const showcase = element.querySelector('.cmp-mediashowcase');
  if (!showcase) return;

  // Find all slides and their corresponding info wrappers
  const slideEls = showcase.querySelectorAll('.cmp-mediashowcase__slide');
  const infoWrappers = showcase.querySelectorAll('.cmp-mediashowcase__info-wrapper');

  // Prepare table rows
  const rows = [];
  // Block header row (CRITICAL: must match target block name)
  rows.push(['Carousel (carousel105)']);

  // For each slide, pair image and text
  slideEls.forEach((slideEl, idx) => {
    // Get image (from <img> inside <picture>)
    const img = slideEl.querySelector('picture img');
    if (!img) return; // Defensive: skip if no image

    // Get corresponding info wrapper (text content)
    const info = infoWrappers[idx];
    let cellContent = [];
    if (info) {
      // Heading (as text)
      const headerBtn = info.querySelector('.cmp-mediashowcase__info-header button');
      if (headerBtn && headerBtn.textContent.trim()) {
        const heading = document.createElement('h2');
        heading.textContent = headerBtn.textContent.trim();
        cellContent.push(heading);
      }
      // Description (all paragraphs)
      const descs = info.querySelectorAll('.cmp-mediashowcase__description p');
      descs.forEach(desc => {
        cellContent.push(desc.cloneNode(true));
      });
      // CTA (Show details button)
      const ctaBtn = info.querySelector('.cmp-mediashowcase__cta-button');
      if (ctaBtn) {
        // Only include the currently visible CTA span (first one)
        const ctaSpan = ctaBtn.querySelector('.cmp-mediashowcase__cta-button-text');
        if (ctaSpan && ctaSpan.textContent.trim()) {
          // Use <a> for CTA as per block description
          const link = document.createElement('a');
          link.textContent = ctaSpan.textContent.trim();
          link.href = '#';
          cellContent.push(link);
        }
      }
    }
    // If no text content, use null for the cell
    rows.push([img, cellContent.length ? cellContent : null]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
