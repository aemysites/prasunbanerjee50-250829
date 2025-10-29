/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the first image in the hero block
  function findHeroImage(el) {
    // Look for .cmp-image__image inside any picture/img structure
    const img = el.querySelector('.cmp-image__image');
    if (img) return img;
    // Fallback: find first <img> in the block
    return el.querySelector('img');
  }

  // Helper to extract all hero text content (eyebrow, heading, paragraph, CTA)
  function findHeroContent(el) {
    const content = [];
    // Eyebrow: first h3.cmp-title__text or h3
    let eyebrow = el.querySelector('.title .cmp-title h3.cmp-title__text') || el.querySelector('h3');
    if (eyebrow && eyebrow.textContent.trim()) content.push(eyebrow.cloneNode(true));
    // Heading: first h2.cmp-title__text or h2 (but not if same as eyebrow)
    let heading = el.querySelector('.title .cmp-title h2.cmp-title__text') || el.querySelector('h2');
    if (heading && heading.textContent.trim()) {
      // Only add if not duplicate of eyebrow
      if (!eyebrow || heading.textContent.trim() !== eyebrow.textContent.trim()) {
        content.push(heading.cloneNode(true));
      }
    }
    // Paragraph: first .cmp-text__paragraph or p
    let paragraph = el.querySelector('.cmp-text__paragraph') || el.querySelector('p');
    if (paragraph && paragraph.textContent.trim()) content.push(paragraph.cloneNode(true));
    // CTA: first .cmp-button or a[href]
    let cta = el.querySelector('.cmp-button') || el.querySelector('a[href]');
    if (cta && cta.textContent.trim()) content.push(cta.cloneNode(true));
    return content;
  }

  // Find the hero image (row 2)
  const heroImage = findHeroImage(element);

  // Find the hero content (row 3)
  const contentCell = findHeroContent(element);

  // Compose the table rows
  const headerRow = ['Hero (hero83)'];
  const imageRow = [heroImage ? heroImage : ''];
  const contentRow = [contentCell];

  // Create the block table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
