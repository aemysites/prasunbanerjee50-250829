/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel block
  const showcase = element.querySelector('.cmp-mediashowcase');
  if (!showcase) return;

  // Table header row as per block requirements
  const headerRow = ['Carousel (carousel56)'];
  const rows = [headerRow];

  // Find all slides (images)
  const slides = Array.from(showcase.querySelectorAll('.cmp-mediashowcase__slide'));
  // Find all info wrappers (text content)
  const infoWrappers = Array.from(showcase.querySelectorAll('.cmp-mediashowcase__info-wrapper'));
  // Find all CTA buttons
  const ctaButtons = Array.from(showcase.querySelectorAll('.cmp-mediashowcase__cta-button'));

  // Defensive: If slide count and info count mismatch, fallback to min length
  const slideCount = Math.min(slides.length, infoWrappers.length);

  for (let i = 0; i < slideCount; i++) {
    const slide = slides[i];
    const info = infoWrappers[i];

    // --- IMAGE CELL ---
    let img = slide.querySelector('img');
    let imageCell = img ? img : '';

    // --- TEXT CELL ---
    let textCellContent = [];

    // Use headline as title (h2)
    let title = info.querySelector('.cmp-mediashowcase__headline');
    if (title && title.textContent.trim()) {
      const titleElem = document.createElement('h2');
      titleElem.textContent = title.textContent.trim();
      textCellContent.push(titleElem);
    }

    // Use full description block (may contain more than just <p>)
    let desc = info.querySelector('.cmp-mediashowcase__description');
    if (desc) {
      // Clone all children (not just <p>)
      Array.from(desc.childNodes).forEach((node) => {
        textCellContent.push(node.cloneNode(true));
      });
    }

    // CTA: Use all visible spans inside for possible CTA text
    let ctaBtn = ctaButtons[i];
    if (ctaBtn) {
      const spans = ctaBtn.querySelectorAll('.cmp-mediashowcase__cta-button-text');
      spans.forEach((span) => {
        if (span.textContent.trim()) {
          const ctaElem = document.createElement('p');
          ctaElem.textContent = span.textContent.trim();
          textCellContent.push(ctaElem);
        }
      });
    }

    // If no headline, try to get any text directly from info wrapper (for flexibility)
    if (textCellContent.length === 0) {
      // Get all text nodes from info wrapper
      Array.from(info.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          textCellContent.push(p);
        }
      });
    }

    rows.push([imageCell, textCellContent]);
  }

  // Build the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
