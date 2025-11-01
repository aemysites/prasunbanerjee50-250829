/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from teaser (if present)
  function extractImage(teaser) {
    const imgContainer = teaser.querySelector('.cmp-teaser__image');
    if (imgContainer) {
      const img = imgContainer.querySelector('img');
      if (img) return img;
    }
    return '';
  }

  // Helper to extract title (as heading), description, and CTA (arrow)
  function extractTextContent(teaser) {
    const content = teaser.querySelector('.cmp-teaser__content');
    if (!content) return document.createElement('div');
    const titleEl = content.querySelector('.cmp-teaser__title');
    const descEl = content.querySelector('.cmp-teaser__description');
    // Compose cell content: heading + description + CTA
    const cell = document.createElement('div');
    if (titleEl) {
      const link = titleEl.querySelector('a');
      if (link) {
        // Create heading
        const heading = document.createElement('h3');
        // Heading text (preserve exact whitespace)
        let headingText = '';
        link.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            headingText += node.textContent;
          }
        });
        heading.textContent = headingText;
        // CTA arrow as a link (preserve href and arrow span)
        const arrowSpan = link.querySelector('.cmp-teaser__arrow-tag');
        if (arrowSpan) {
          const cta = document.createElement('a');
          cta.href = link.href;
          cta.className = 'card-arrow-cta';
          cta.appendChild(arrowSpan.cloneNode(true));
          heading.appendChild(cta);
        }
        cell.appendChild(heading);
      } else {
        // fallback: just use the text
        const heading = document.createElement('h3');
        heading.textContent = titleEl.textContent;
        cell.appendChild(heading);
      }
    }
    if (descEl) {
      // Add description below heading
      let descContent = descEl;
      if (descEl.querySelector('span')) {
        descContent = descEl.querySelector('span');
      }
      const para = document.createElement('p');
      para.textContent = descContent.textContent;
      cell.appendChild(para);
    }
    return cell;
  }

  // Find all card teasers (cards)
  const container = element.querySelector('.cmp-container');
  const cardParent = container || element;
  // Only select direct .teaser children (not nested)
  const teasers = Array.from(cardParent.querySelectorAll(':scope > .teaser'));

  // Build table rows
  const rows = [];
  rows.push(['Cards (cards77)']);

  teasers.forEach(teaser => {
    const img = extractImage(teaser);
    const textCell = extractTextContent(teaser);
    rows.push([img || '', textCell]);
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
