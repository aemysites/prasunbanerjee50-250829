/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the background image (img inside .cmp-image)
  function findBackgroundImage(el) {
    const img = el.querySelector('.cmp-image img');
    return img || '';
  }

  // Helper to find the main heading (h2 or h1 inside .cmp-title)
  function findHeading(el) {
    const heading = el.querySelector('.cmp-title h1, .cmp-title h2, .cmp-title h3');
    return heading || '';
  }

  // Helper to find the subheading/paragraph (p inside .cmp-text that is not disclaimer)
  function findParagraph(el) {
    // Find all .cmp-text elements
    const texts = Array.from(el.querySelectorAll('.cmp-text'));
    // Filter out disclaimer text (has style-text--with-infoi or style-text--disclaimer-1)
    for (const textEl of texts) {
      if (!textEl.classList.contains('style-text--with-infoi') && !textEl.classList.contains('style-text--disclaimer-1')) {
        const p = textEl.querySelector('p');
        if (p) return p;
      }
    }
    return '';
  }

  // Helper to find disclaimer/info text (p inside .cmp-text with style-text--with-infoi or style-text--disclaimer-1)
  // Also includes tooltip content if present
  function findDisclaimer(el) {
    const disclaimerText = el.querySelector('.cmp-text.style-text--with-infoi, .cmp-text.style-text--disclaimer-1');
    if (disclaimerText) {
      const parts = [];
      const p = disclaimerText.querySelector('p');
      if (p) parts.push(p);
      // If there's an info icon, add it (button with info icon)
      const infoIcon = disclaimerText.querySelector('.cmp-infoi__icon');
      if (infoIcon) parts.push(infoIcon);
      // Tooltip content (hidden but present in DOM)
      const tooltipContent = disclaimerText.querySelector('[data-cmp-hook-tooltip="content"] p');
      if (tooltipContent) parts.push(tooltipContent);
      return parts.length ? parts : '';
    }
    return '';
  }

  // 1. Header row
  const headerRow = ['Hero (hero90)'];

  // 2. Background image row
  const backgroundImage = findBackgroundImage(element);
  const imageRow = [backgroundImage];

  // 3. Content row: heading, paragraph, disclaimer
  const contentParts = [];
  const heading = findHeading(element);
  if (heading) contentParts.push(heading);
  const paragraph = findParagraph(element);
  if (paragraph) contentParts.push(paragraph);
  const disclaimer = findDisclaimer(element);
  if (disclaimer) {
    if (Array.isArray(disclaimer)) {
      disclaimer.forEach(part => contentParts.push(part));
    } else {
      contentParts.push(disclaimer);
    }
  }

  const contentRow = [contentParts.length ? contentParts : ''];

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
