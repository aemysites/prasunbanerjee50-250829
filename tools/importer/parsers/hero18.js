/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find the main hero image (img inside picture in keyvisual section)
  function findHeroImage() {
    const keyvisual = element.querySelector('.ds2-content-presentation--keyvisual');
    if (!keyvisual) return null;
    const img = keyvisual.querySelector('img');
    return img || null;
  }

  // Helper: Find the first visible headline (prefer keyvisual-cta, then body)
  function findHeadline() {
    // Prefer visible headline in keyvisual-cta
    const keyvisualCta = element.querySelector('.ds2-content-presentation--keyvisual-cta');
    if (keyvisualCta) {
      const h2 = keyvisualCta.querySelector('h2');
      if (h2 && h2.textContent.trim()) return h2;
    }
    // Fallback: headline in body container (for mobile)
    const bodyContainer = element.querySelector('.ds2-content-presentation--body-container');
    if (bodyContainer) {
      const h2 = bodyContainer.querySelector('h2');
      if (h2 && h2.textContent.trim()) return h2;
    }
    return null;
  }

  // Helper: Find the first visible supporting paragraph (prefer body, then keyvisual-cta)
  function findParagraph() {
    // Try desktop version first
    const bodyContainer = element.querySelector('.ds2-content-presentation--body-container');
    if (bodyContainer) {
      const p = bodyContainer.querySelector('.ds2-cms-output p');
      if (p && p.textContent.trim()) return p;
    }
    // Fallback: screenreader version in keyvisual-cta
    const keyvisualCta = element.querySelector('.ds2-content-presentation--keyvisual-cta');
    if (keyvisualCta) {
      const p = keyvisualCta.querySelector('.ds2-cms-output p');
      if (p && p.textContent.trim()) return p;
    }
    return null;
  }

  // Compose table rows
  const headerRow = ['Hero (hero18)'];

  // Row 2: Image (as element, or empty string)
  const heroImg = findHeroImage();
  const imageRow = [heroImg ? heroImg : ''];

  // Row 3: headline and paragraph (only one of each, no duplicates)
  const headline = findHeadline();
  const paragraph = findParagraph();
  const contentRow = [[headline, paragraph].filter(Boolean)];

  // Build table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(block);
}
