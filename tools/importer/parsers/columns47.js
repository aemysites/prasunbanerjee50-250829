/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns (columns47)'];

  // --- LEFT COLUMN: Find video/image wrapper ---
  let leftCol = [];
  // Prefer video wrapper, fallback to image
  const videoWrapper = element.querySelector('.cmp-video__wrapper') || element.querySelector('.cmp-video');
  let posterImg = null;
  if (videoWrapper) {
    // Always include the poster image if present
    posterImg = videoWrapper.querySelector('img');
    if (posterImg) leftCol.push(posterImg);
    // If there's a video, convert it to a link (not an embedded video)
    const video = videoWrapper.querySelector('video');
    if (video && video.getAttribute('data-src-large')) {
      const link = document.createElement('a');
      link.href = video.getAttribute('data-src-large');
      link.textContent = 'Video';
      leftCol.push(link);
    }
    // Add a simple play icon overlay if present
    const playIcon = videoWrapper.querySelector('.cmp-progressiveplaybutton__icon.cmp-progressiveplaybutton--play');
    if (playIcon) {
      // Clone just the icon, not the full button
      leftCol.push(playIcon.cloneNode(true));
    }
  } else {
    // Fallback to image
    posterImg = element.querySelector('picture img') || element.querySelector('img');
    if (posterImg) leftCol.push(posterImg);
  }
  if (leftCol.length === 1) leftCol = leftCol[0];

  // --- RIGHT COLUMN: Collect all text content ---
  const rightColContent = [];
  // Find the title text
  const titleText = element.querySelector('.cmp-title .cmp-title__text');
  if (titleText) rightColContent.push(titleText);
  // Find all paragraphs within .cmp-text
  const textBlock = element.querySelector('.cmp-text');
  if (textBlock) {
    const paragraphs = textBlock.querySelectorAll('p');
    paragraphs.forEach(p => rightColContent.push(p));
  }
  // Fallbacks if missing
  if (rightColContent.length === 0) {
    const headings = element.querySelectorAll('h1, h2, h3');
    headings.forEach(h => rightColContent.push(h));
    const paragraphs = element.querySelectorAll('p');
    paragraphs.forEach(p => rightColContent.push(p));
  }
  // If still nothing, fallback to the element itself
  let rightCol;
  if (rightColContent.length > 0) {
    rightCol = rightColContent;
  } else {
    rightCol = element;
  }

  // --- Compose table rows ---
  const rows = [
    headerRow,
    [leftCol, rightCol]
  ];

  // --- Create table block ---
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // --- Replace original element ---
  element.replaceWith(block);
}
