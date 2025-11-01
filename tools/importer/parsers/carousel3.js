/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel3) block parsing

  // Helper to extract slide info from a rad-layout-division__container
  function extractSlide(container) {
    // Find media (image or video)
    let media = null;
    let textCellContent = [];

    // Try image first
    const img = container.querySelector('img');
    if (img) {
      media = img;
    } else {
      // Try video: extract a thumbnail if possible, else use video element
      const video = container.querySelector('video');
      if (video) {
        // Try to find a poster image for the video
        let posterImg = null;
        // Sometimes a poster is set as an attribute
        if (video.hasAttribute('poster')) {
          posterImg = document.createElement('img');
          posterImg.src = video.getAttribute('poster');
        } else {
          // Try to find a background image or first frame image
          const bgImg = container.querySelector('img');
          if (bgImg) posterImg = bgImg;
        }
        media = posterImg || video;
      }
    }

    // Text content extraction
    // Try to find caption wrappers (for both image and video)
    let captionWrapper = container.querySelector('.rad-media--anchored__caption-text__wrapper, .rad-media--mp4__caption');
    if (captionWrapper) {
      if (captionWrapper.tagName === 'A') {
        textCellContent.push(captionWrapper);
      } else {
        Array.from(captionWrapper.children).forEach(child => {
          textCellContent.push(child);
        });
      }
    }

    // Also look for secondary caption text (location, etc.)
    const captionText = container.querySelector('.rad-media--image__caption-text, .rad-media--mp4__caption-text');
    if (captionText) {
      textCellContent.push(captionText);
    }

    // Overlay text (e.g., big text over video)
    // Look for overlay text inside .cmp-video__player, typically in a child div/span with visible text
    const videoPlayer = container.querySelector('.cmp-video__player');
    if (videoPlayer) {
      // Find all direct children that are not video and have visible text
      Array.from(videoPlayer.children).forEach(child => {
        if (
          child.nodeType === 1 && // element
          child.tagName !== 'VIDEO' &&
          child.textContent && child.textContent.trim() &&
          !child.classList.contains('rad-icon') &&
          !child.classList.contains('rad-icon-button')
        ) {
          textCellContent.push(document.createTextNode(child.textContent.trim()));
        }
      });
    }

    // Play/Pause button text (accessibility/controls)
    const playPauseButtons = container.querySelectorAll('.rad-media-overlay__toggle .rad-icon-button__text');
    playPauseButtons.forEach(btn => {
      if (btn.textContent.trim()) {
        textCellContent.push(document.createTextNode(btn.textContent.trim()));
      }
    });

    // Defensive: if no text content found, try to grab any <p> inside the container
    if (textCellContent.length === 0) {
      const fallbackPs = container.querySelectorAll('p');
      fallbackPs.forEach(p => textCellContent.push(p));
    }

    // Defensive: if no media found, use first image or video in container
    if (!media) {
      const fallbackImg = container.querySelector('img');
      if (fallbackImg) media = fallbackImg;
      else {
        const fallbackVideo = container.querySelector('video');
        if (fallbackVideo) media = fallbackVideo;
      }
    }

    // Defensive: if no text content, add empty string
    if (textCellContent.length === 0) textCellContent = [''];

    return [media, textCellContent];
  }

  // Find all rad-layout-division__container elements (each is a slide)
  const slideContainers = element.querySelectorAll('.rad-layout-division__container');

  // Table header
  const headerRow = ['Carousel (carousel3)'];
  const rows = [headerRow];

  // For each slide, extract media and text
  slideContainers.forEach(container => {
    const [media, textCellContent] = extractSlide(container);
    rows.push([media, textCellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
