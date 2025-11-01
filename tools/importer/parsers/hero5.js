/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero5) block: 1 column, 3 rows
  // Row 1: Block name
  // Row 2: Background image (optional)
  // Row 3: Title, Subheading, CTA

  // Defensive: Find the main banner block
  const banner = element.querySelector('.rad-banner');
  if (!banner) return;

  // Row 2: Background image (optional)
  // These hero banners use a background image via CSS, not <img>. No <img> present in HTML or screenshots.
  // So, row 2 will be empty.
  const backgroundRow = [''];

  // Row 3: Content (headline, subheading, CTA)
  const contentContainer = banner.querySelector('.rad-banner__content-container');
  const content = [];

  // Headline (h2)
  const headline = contentContainer.querySelector('.rad-banner__headline');
  if (headline) content.push(headline);

  // Subheading (h3 or any element after headline)
  // Be flexible: select the next sibling after headline that is not a button container
  let subheading = null;
  if (headline) {
    let next = headline.nextElementSibling;
    while (next) {
      if (
        !next.classList.contains('rad-banner__buttons') &&
        next.textContent.trim() !== ''
      ) {
        subheading = next;
        break;
      }
      next = next.nextElementSibling;
    }
  }
  if (subheading) content.push(subheading);

  // CTA (button link)
  const buttons = contentContainer.querySelector('.rad-banner__buttons');
  if (buttons) {
    // Find anchor(s) inside buttons
    const ctaLinks = Array.from(buttons.querySelectorAll('a'));
    ctaLinks.forEach((cta) => {
      // Ensure button text is included directly (not just the <div> inside the <a>)
      const btnTextDiv = cta.querySelector('.rad-button__text');
      if (btnTextDiv) {
        // Create a new anchor with only the text content and href
        const a = document.createElement('a');
        a.href = cta.href;
        a.textContent = btnTextDiv.textContent.trim();
        if (cta.hasAttribute('target')) a.setAttribute('target', cta.getAttribute('target'));
        if (cta.hasAttribute('aria-label')) a.setAttribute('aria-label', cta.getAttribute('aria-label'));
        content.push(a);
      } else {
        content.push(cta);
      }
    });
  }

  const contentRow = [content];

  // Compose table rows
  const rows = [
    ['Hero (hero5)'],
    backgroundRow,
    contentRow,
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
