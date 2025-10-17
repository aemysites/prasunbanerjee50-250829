/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the columns2 block
  const headerRow = ['Columns (columns2)'];

  // Defensive: find the main float container (should be direct child)
  const float = element.querySelector('.ds2-expand--float') || element;

  // Find the image (left column)
  let imageEl = null;
  const mediaContainer = float.querySelector('.ds2-micro-story--media-container');
  if (mediaContainer) {
    // Find the first <img> inside the media container
    imageEl = mediaContainer.querySelector('img');
    // If the <img> is wrapped in a <picture>, use the <picture> for better semantics
    const pic = mediaContainer.querySelector('picture');
    if (pic && pic.contains(imageEl)) {
      imageEl = pic;
    }
  }
  if (!imageEl) {
    imageEl = element.querySelector('img') || '';
  }

  // Find the heading (h2 or h3)
  let headingEl = float.querySelector('h2, h3');
  // Find the text (right column)
  let textEl = null;
  const textbox = float.querySelector('.ds2-micro-story--textbox');
  if (textbox) {
    // Clone textbox so we can prepend the heading
    textEl = textbox.cloneNode(true);
    if (headingEl) {
      // Insert the heading at the top
      textEl.insertBefore(headingEl.cloneNode(true), textEl.firstChild);
    }
  } else {
    // Fallback: just use the heading and the largest text div
    const divs = Array.from(element.querySelectorAll('div'));
    const mainDiv = divs.sort((a, b) => (b.textContent.length - a.textContent.length))[0] || '';
    if (mainDiv && headingEl) {
      textEl = document.createElement('div');
      textEl.appendChild(headingEl.cloneNode(true));
      textEl.appendChild(mainDiv.cloneNode(true));
    } else {
      textEl = mainDiv || '';
    }
  }

  // Build the columns row (two columns: image, text)
  const columnsRow = [imageEl, textEl];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
