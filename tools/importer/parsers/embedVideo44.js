/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Embed (embedVideo44)
  const headerRow = ['Embed (embedVideo44)'];

  // Find the video poster image
  let posterImg = null;
  const picture = element.querySelector('picture');
  if (picture) {
    posterImg = picture.querySelector('img');
  }

  // Find a usable video source URL (not blob, but actual external link)
  let videoUrl = null;
  const video = element.querySelector('video');
  if (video) {
    videoUrl = video.getAttribute('data-src-large');
    if (!videoUrl || videoUrl.startsWith('blob:')) {
      videoUrl = '';
    }
  } else {
    videoUrl = '';
  }

  // Extract the visible timestamp from the controls (should match screenshot: '0:00 / 1:38')
  let timestamp = '';
  const currentTimeSpan = element.querySelector('.cmp-duration__current-time');
  const totalTimeSpan = element.querySelector('.cmp-duration__total-time');
  if (currentTimeSpan && totalTimeSpan) {
    timestamp = `${currentTimeSpan.textContent.trim()} / ${totalTimeSpan.textContent.trim()}`;
  }

  // Compose cell content: image above the link, then timestamp
  const cellContent = [];
  if (posterImg) {
    cellContent.push(posterImg);
  }
  if (videoUrl) {
    const videoLink = document.createElement('a');
    videoLink.href = videoUrl;
    videoLink.textContent = videoUrl;
    cellContent.push(videoLink);
  }
  if (timestamp) {
    cellContent.push(document.createElement('br'));
    cellContent.push(document.createTextNode(timestamp));
  }

  // Table structure: 1 column, 2 rows
  const rows = [
    headerRow,
    [cellContent]
  ];

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
