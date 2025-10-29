/* global WebImporter */
export default function parse(element, { document }) {
  // Columns block header
  const headerRow = ['Columns (columns106)'];

  // Find the main cmp-textmediateaser block
  const teaser = element.querySelector('.cmp-textmediateaser');

  // --- LEFT COLUMN: Media ---
  let mediaCell = null;
  if (teaser) {
    const mediaWrapper = teaser.querySelector('.cmp-textmediateaser__media-wrapper');
    if (mediaWrapper) {
      // Find poster image and play button
      const posterImg = mediaWrapper.querySelector('img');
      const playButton = mediaWrapper.querySelector('.cmp-progressiveplaybutton');
      const mediaDiv = document.createElement('div');
      if (posterImg) mediaDiv.appendChild(posterImg.cloneNode(true));
      if (playButton) mediaDiv.appendChild(playButton.cloneNode(true));
      mediaCell = mediaDiv.childNodes.length ? mediaDiv : mediaWrapper.cloneNode(true);
    }
  }

  // --- RIGHT COLUMN: Text ---
  let textCell = document.createElement('div');
  if (teaser) {
    const content = teaser.querySelector('.cmp-textmediateaser__content');
    if (content) {
      // Title
      const title = content.querySelector('.cmp-textmediateaser__title');
      if (title) textCell.appendChild(title.cloneNode(true));
      // Description
      const desc = content.querySelector('.cmp-textmediateaser__description');
      if (desc) textCell.appendChild(desc.cloneNode(true));
      // CTA button
      const ctaBtn = content.querySelector('button, .cmp-button');
      if (ctaBtn) textCell.appendChild(ctaBtn.cloneNode(true));
    }
  }

  // If no text content found, fallback to all textmediateaser content
  if (!textCell.childNodes.length && teaser) {
    textCell = teaser.cloneNode(true);
  }

  // Build table: header, then content row (media | text)
  const cells = [
    headerRow,
    [mediaCell, textCell]
  ];

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
