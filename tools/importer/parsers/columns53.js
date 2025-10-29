/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns53)'];

  // Defensive: Get main content wrapper (first .ds2-micro-story inside the block)
  const main = element.querySelector('.ds2-micro-story');
  if (!main) return;

  // Left column: Heading, paragraph, and list
  const title = main.querySelector('.ds2-micro-story--title');
  const textBox = main.querySelector('.ds2-micro-story--textbox');

  // Compose left column content
  const leftColumnContent = [];
  if (title) leftColumnContent.push(title);
  if (textBox) {
    // Find the actual content inside textBox
    const bodyCopy = textBox.querySelector('.ds2-expand--body-copy');
    if (bodyCopy) {
      // Get all children (paragraphs, lists, etc.)
      const copyContent = bodyCopy.querySelector('.ds2-expand--copy-content');
      if (copyContent) {
        // Only push meaningful children (skip empty paragraphs)
        Array.from(copyContent.children).forEach(child => {
          // Defensive: skip empty paragraphs
          if (child.tagName === 'P' && child.textContent.trim() === '') return;
          leftColumnContent.push(child);
        });
      }
    }
  }

  // Right column: Image
  let image = null;
  const mediaContainer = main.querySelector('.ds2-micro-story--media-container');
  if (mediaContainer) {
    image = mediaContainer.querySelector('img');
  }

  // Compose the columns row
  const columnsRow = [
    leftColumnContent,
    image ? image : ''
  ];

  // Create the table
  const cells = [
    headerRow,
    columnsRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
