/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero36)'];

  // 2. Find the background image (from <img> inside .cmp-video__video)
  let bgImg = '';
  const bgImgCandidate = element.querySelector('.cmp-video__video picture img');
  if (bgImgCandidate) {
    bgImg = bgImgCandidate.cloneNode(true);
  }

  // 3. Extract hero text content (headline, numeral, subheading, CTA)
  let heroTextDiv = document.createElement('div');
  const overlay = element.querySelector('.cmp-backgroundmedia__overlay');
  if (overlay) {
    // Collect all .cmp-title__text elements (THE NEW, 4, NOVI BMW SERIJE 4 GRAN COUPÉ.)
    const titleEls = overlay.querySelectorAll('.cmp-title__text');
    titleEls.forEach((el) => {
      const node = document.createElement(el.tagName.toLowerCase());
      node.textContent = el.textContent.trim();
      heroTextDiv.appendChild(node);
    });
    // CTA Button
    const ctaEl = overlay.querySelector('a.cmp-button');
    if (ctaEl) {
      heroTextDiv.appendChild(ctaEl.cloneNode(true));
    }
  }

  // 4. Find the disclaimer (small text below hero)
  const disclaimerCandidate = element.querySelector('.text .cmp-text__paragraph');
  if (disclaimerCandidate) {
    heroTextDiv.appendChild(disclaimerCandidate.cloneNode(true));
  }

  // 5. Compose the table rows (3 rows only)
  const rows = [
    headerRow,
    [bgImg],
    [heroTextDiv]
  ];

  // 6. Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
