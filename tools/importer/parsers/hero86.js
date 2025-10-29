/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find the background image (poster)
  function findBackgroundImage(el) {
    const img = el.querySelector('.cmp-video__video picture img');
    if (img) return img.cloneNode(true);
    return '';
  }

  // Helper: Extract all hero text content in correct hierarchy and include all text
  function findTextContent(el) {
    // Find all .cmp-title__text elements in order of appearance
    const texts = Array.from(el.querySelectorAll('.cmp-title__text'));
    const fragment = document.createElement('div');
    // Expecting: [NOVI, iX2, PRVI BMW iX2. 100% ELEKTRIČNI.]
    if (texts[0]) {
      // NOVI - small label
      const label = document.createElement('span');
      label.textContent = texts[0].textContent.trim();
      fragment.appendChild(label);
    }
    if (texts[1]) {
      // iX2 - large heading (should be h2)
      const h2 = document.createElement('h2');
      h2.textContent = texts[1].textContent.trim();
      fragment.appendChild(h2);
    }
    if (texts[2]) {
      // PRVI BMW iX2. 100% ELEKTRIČNI. - main heading (should be h1)
      const h1 = document.createElement('h1');
      h1.textContent = texts[2].textContent.trim();
      fragment.appendChild(h1);
    }
    return fragment;
  }

  // Helper: Find CTA button
  function findCTA(el) {
    const btn = el.querySelector('.button .cmp-button');
    if (btn) {
      const clone = btn.cloneNode(true);
      clone.textContent = btn.textContent.trim(); // Remove trailing whitespace
      return clone;
    }
    return null;
  }

  // Compose table rows
  const headerRow = ['Hero (hero86)'];
  const bgImg = findBackgroundImage(element);
  const bgRow = [bgImg ? bgImg : ''];
  const textFragment = findTextContent(element);
  const cta = findCTA(element);
  if (cta) {
    textFragment.appendChild(cta);
  }
  const contentRow = [textFragment];

  // Create the table
  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
