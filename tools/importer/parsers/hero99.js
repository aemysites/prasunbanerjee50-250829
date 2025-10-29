/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero99)'];

  // 2. Extract the background image (poster image for video)
  let posterImg = null;
  const picture = element.querySelector('picture');
  if (picture) {
    posterImg = picture.querySelector('img');
  }

  // 3. Extract text content (heading, subheading, CTA)
  // Try to find any visible text within the video wrapper or its parent
  let textContent = [];
  const videoWrapper = element.querySelector('.cmp-video__wrapper');
  if (videoWrapper) {
    // Collect all text nodes inside the video wrapper
    const walker = document.createTreeWalker(videoWrapper, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        if (node.textContent && node.textContent.trim().length > 0) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      }
    });
    let node;
    while ((node = walker.nextNode())) {
      textContent.push(node.textContent.trim());
    }
  }
  // Also check for any text in direct children of the main element (outside the video wrapper)
  Array.from(element.childNodes).forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE && child.textContent.trim().length > 0) {
      textContent.push(child.textContent.trim());
    }
  });

  // Remove duplicate or empty entries
  textContent = Array.from(new Set(textContent)).filter(Boolean);

  // 4. Build table rows
  const rows = [
    headerRow,
    [posterImg ? posterImg : ''], // row 2: image only
    [textContent.length ? textContent.join(' ') : ''] // row 3: text/cta (empty if none)
  ];

  // 5. Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace the original element with the block table
  element.replaceWith(block);
}
