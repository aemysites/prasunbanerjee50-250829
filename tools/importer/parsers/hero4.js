/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the background media (image or video)
  function getBackgroundMedia() {
    const bgMedia = element.querySelector('.rad-banner__background-media');
    if (bgMedia) {
      const video = bgMedia.querySelector('video');
      if (video && video.src) {
        return video;
      }
      const img = bgMedia.querySelector('img');
      if (img) {
        return img;
      }
    }
    return '';
  }

  // Helper to get all text content (headline, subheading, CTA, play and pause icon text)
  function getTextContent() {
    const textContent = element.querySelector('.rad-banner__text-content');
    const frag = document.createDocumentFragment();

    if (textContent) {
      // Headline
      const headline = textContent.querySelector('.rad-banner__headline, h2, h1');
      if (headline) {
        const h2 = document.createElement('h2');
        h2.textContent = headline.textContent;
        frag.appendChild(h2);
      }
      // Subheading (paragraph)
      const subheading = textContent.querySelector('.rad-banner__body, .rad-banner__subheader, h3, p');
      if (subheading) {
        const p = document.createElement('p');
        p.textContent = subheading.textContent;
        frag.appendChild(p);
      }
      // CTA button (link)
      const cta = textContent.querySelector('.rad-banner__buttons a, a');
      if (cta) {
        const a = document.createElement('a');
        a.href = cta.href;
        a.textContent = cta.querySelector('.rad-button__text')?.textContent || cta.textContent;
        if (cta.getAttribute('aria-label')) {
          a.setAttribute('aria-label', cta.getAttribute('aria-label'));
        }
        frag.appendChild(a);
      }
    }

    // Play icon text (ensure all text content is included)
    const playBtn = element.querySelector('.rad-media-overlay__play.rad-icon-button');
    if (playBtn) {
      const playText = playBtn.querySelector('.rad-icon-button__text');
      if (playText) {
        const span = document.createElement('span');
        span.textContent = playText.textContent;
        frag.appendChild(span);
      }
    }
    // Pause icon text (ensure all text content is included)
    const pauseBtn = element.querySelector('.rad-media-overlay__pause.rad-icon-button');
    if (pauseBtn) {
      const pauseText = pauseBtn.querySelector('.rad-icon-button__text');
      if (pauseText) {
        const span = document.createElement('span');
        span.textContent = pauseText.textContent;
        frag.appendChild(span);
      }
    }

    return frag;
  }

  // Build table rows
  const headerRow = ['Hero (hero4)'];
  const backgroundMedia = getBackgroundMedia();
  const backgroundRow = [backgroundMedia];
  const textContent = getTextContent();
  const contentRow = [textContent];

  const cells = [
    headerRow,
    backgroundRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
