/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns56)'];

  // Find the main four-cell block
  const fourCellBlock = element.querySelector('.cmp-fourcellblock');
  if (!fourCellBlock) return;

  // --- LEFT COLUMN ---
  // Get the first row, first column (title)
  const firstRow = fourCellBlock.querySelector('.cmp-four-cell__first-row');
  let leftTitle = null;
  if (firstRow) {
    const firstCol = firstRow.querySelector('.cmp-four-cell__first-col');
    if (firstCol) {
      leftTitle = firstCol.querySelector('h2');
    }
  }

  // Get the second row, first column (text)
  const secondRow = fourCellBlock.querySelector('.cmp-four-cell__second-row');
  let leftText = null;
  if (secondRow) {
    const firstCol = secondRow.querySelector('.cmp-four-cell__first-col');
    if (firstCol) {
      // Find the text container
      leftText = firstCol.querySelector('.cmp-text');
    }
  }

  // Compose left column content
  const leftColumnContent = [];
  if (leftTitle) leftColumnContent.push(leftTitle);
  if (leftText) {
    // Remove unnecessary <span> wrappers and empty <p> tags
    const cleanText = leftText.cloneNode(true);
    cleanText.querySelectorAll('span.cmp-text__paragraph-default').forEach(span => {
      span.replaceWith(...span.childNodes);
    });
    cleanText.querySelectorAll('p').forEach(p => {
      if (!p.textContent.trim()) p.remove();
    });
    leftColumnContent.push(cleanText);
  }

  // --- RIGHT COLUMN ---
  // Get the second row, second column (blockquote)
  let rightColumnContent = null;
  if (secondRow) {
    const secondCol = secondRow.querySelector('.cmp-four-cell__second-col');
    if (secondCol) {
      const blockquote = secondCol.querySelector('.cmp-blockquote');
      if (blockquote) {
        // Clean blockquote: remove icon span and empty <p> tags
        const cleanBlockquote = blockquote.cloneNode(true);
        cleanBlockquote.querySelectorAll('.cmp-blockquote__icon').forEach(icon => icon.remove());
        cleanBlockquote.querySelectorAll('p').forEach(p => {
          if (!p.textContent.trim()) p.remove();
        });
        rightColumnContent = cleanBlockquote;
      }
    }
  }

  // Compose the table rows
  const tableRows = [
    headerRow,
    [leftColumnContent, rightColumnContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
