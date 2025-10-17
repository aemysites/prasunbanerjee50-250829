/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get main background image (first large image in hero)
  function getBackgroundImage() {
    const bgMedia = element.querySelector('.cmp-backgroundmedia');
    if (!bgMedia) return null;
    const img = bgMedia.querySelector('.cmp-image__image');
    return img ? img.cloneNode(true) : null;
  }

  // Helper: get all hero text (including headings and paragraphs)
  function getHeroText() {
    const titles = element.querySelectorAll('.cmp-title__text');
    const frag = document.createDocumentFragment();
    titles.forEach((t) => {
      frag.appendChild(t.cloneNode(true));
    });
    return frag;
  }

  // Helper: get CTA button (anchor with .cmp-button)
  function getCTA() {
    const btn = element.querySelector('.cmp-button');
    return btn ? btn.cloneNode(true) : null;
  }

  // Helper: get branding logo image ("3 50 YEARS ...")
  function getBrandingLogo() {
    // Find image with alt containing '50 years' or use the second .cmp-image__image
    const allImages = element.querySelectorAll('.cmp-image__image');
    for (const img of allImages) {
      if ((img.alt && img.alt.toLowerCase().includes('50 years')) || (img.title && img.title.toLowerCase().includes('50 years'))) {
        return img.cloneNode(true);
      }
    }
    if (allImages.length > 1) {
      return allImages[1].cloneNode(true);
    }
    return null;
  }

  // Helper: get disclaimer text (bottom small text)
  function getDisclaimer() {
    const disclaimer = element.querySelector('.cmp-text__paragraph');
    return disclaimer ? disclaimer.cloneNode(true) : null;
  }

  // --- Build block table ---
  const headerRow = ['Hero (hero7)'];

  // Row 2: background image (main car image)
  const bgImg = getBackgroundImage();
  const row2 = [bgImg ? bgImg : ''];

  // Row 3: hero text, CTA, branding logo image, disclaimer
  const heroTextFrag = getHeroText();
  const cta = getCTA();
  const brandingLogo = getBrandingLogo();
  const disclaimer = getDisclaimer();

  // Compose content for row 3
  const row3Content = [];
  if (heroTextFrag.childNodes.length > 0) {
    row3Content.push(heroTextFrag);
  }
  if (cta) {
    row3Content.push(cta);
  }
  if (brandingLogo) {
    row3Content.push(brandingLogo);
  }
  if (disclaimer) {
    row3Content.push(disclaimer);
  }
  const row3 = [row3Content];

  // Create table
  const cells = [headerRow, row2, row3];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
