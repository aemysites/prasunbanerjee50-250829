/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Hero (hero101)'];

  // Background image extraction
  let backgroundImg = '';
  const posterImg = element.querySelector('.cmp-video__poster');
  if (posterImg) backgroundImg = posterImg;

  // Extract hero content: logo, headings, subheading, CTAs
  const heroContent = document.createElement('div');

  // Title: THE
  const theTitle = element.querySelector('.cmp-title .cmp-title__text');
  if (theTitle && theTitle.textContent.trim().toUpperCase() === 'THE') {
    const p = document.createElement('p');
    p.textContent = theTitle.textContent.trim();
    heroContent.appendChild(p);
  }

  // Title: i4
  const i4Title = Array.from(element.querySelectorAll('.cmp-title .cmp-title__text')).find(
    el => el.textContent.trim().toUpperCase() === 'I4'
  );
  if (i4Title) {
    const h2 = document.createElement('h2');
    h2.textContent = i4Title.textContent.trim();
    heroContent.appendChild(h2);
  }

  // Branding image and headline
  const brandingBlock = element.querySelector('.cmp-title--branding');
  if (brandingBlock) {
    const img = brandingBlock.querySelector('img');
    if (img) heroContent.appendChild(img.cloneNode(true));
    const headline = brandingBlock.querySelector('h1');
    if (headline) {
      const h1 = document.createElement('h1');
      h1.textContent = headline.textContent.trim();
      heroContent.appendChild(h1);
    }
  }

  // CTA buttons
  const ctaButtons = Array.from(element.querySelectorAll('.cmp-button'));
  ctaButtons.forEach(btn => {
    heroContent.appendChild(btn.cloneNode(true));
  });

  // Disclaimer
  const disclaimerBlock = element.querySelector('.cmp-text');
  if (disclaimerBlock) {
    heroContent.appendChild(disclaimerBlock.cloneNode(true));
  }

  // Build the table rows
  const rows = [
    headerRow,
    [backgroundImg ? backgroundImg : ''],
    [heroContent]
  ];

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
