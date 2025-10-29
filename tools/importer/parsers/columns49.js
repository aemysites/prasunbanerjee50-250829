/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per spec
  const headerRow = ['Columns (columns49)'];

  // Find the main content columns: left (text) and right (media)
  const cmpTextMediaTeaser = element.querySelector('.cmp-textmediateaser');
  if (!cmpTextMediaTeaser) return;

  // Get immediate children (media-wrapper and content)
  let mediaWrapper = cmpTextMediaTeaser.querySelector('.cmp-textmediateaser__media-wrapper');
  let contentWrapper = cmpTextMediaTeaser.querySelector('.cmp-textmediateaser__content');

  // Defensive: fallback if not found
  if (!mediaWrapper || !contentWrapper) {
    const children = Array.from(cmpTextMediaTeaser.children);
    [mediaWrapper, contentWrapper] = children;
  }

  // Left column: Only visible content (heading, description, button)
  const leftColElements = [];
  if (contentWrapper) {
    // Heading (h3 or h2 or h1)
    const heading = contentWrapper.querySelector('h3, h2, h1');
    if (heading) leftColElements.push(heading);
    // Description (first .cmp-textmediateaser__description)
    const desc = contentWrapper.querySelector('.cmp-textmediateaser__description');
    if (desc) leftColElements.push(desc);
    // Button (may be inside .button)
    const buttonWrapper = contentWrapper.querySelector('.button');
    if (buttonWrapper) {
      const btn = buttonWrapper.querySelector('button, a');
      if (btn) leftColElements.push(btn);
    }
  }

  // Right column: media (image/video)
  let rightColElement = null;
  if (mediaWrapper) {
    // Try to find a video or image
    const video = mediaWrapper.querySelector('video');
    if (video) {
      // Use the parent container that includes the poster image and play button
      const videoContainer = video.closest('.cmp-video__video');
      if (videoContainer) {
        rightColElement = videoContainer;
      } else {
        rightColElement = video;
      }
    } else {
      // Try image
      const img = mediaWrapper.querySelector('img');
      if (img) {
        rightColElement = img;
      } else {
        // fallback: use the mediaWrapper itself
        rightColElement = mediaWrapper;
      }
    }
  }

  // Build the table rows
  const tableRows = [
    headerRow,
    [leftColElements, rightColElement]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
