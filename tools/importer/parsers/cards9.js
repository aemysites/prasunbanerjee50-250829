/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards9) block parsing
  const headerRow = ['Cards (cards9)'];
  const rows = [headerRow];

  // Find all .acs-commons-resp-colctrl-col that are NOT hidden
  const cardCols = Array.from(element.querySelectorAll('.acs-commons-resp-colctrl-col')).filter(col => {
    let parent = col;
    while (parent && parent !== element) {
      if (
        parent.classList.contains('ds2-responsive-plus-mobile-hide') ||
        parent.classList.contains('ds2-responsive-plus-tablet-hide') ||
        parent.classList.contains('ds2-responsive-plus-desktop-hide')
      ) {
        return false;
      }
      parent = parent.parentElement;
    }
    return true;
  });

  cardCols.forEach((col) => {
    const teaser = col.querySelector('.ds2-basic-teaser');
    if (!teaser) return;
    // Image: find the <img> inside the .ds2-basic-teaser--image-container
    let img = teaser.querySelector('.ds2-basic-teaser--image-container img');
    if (!img) return;
    // Text content: get the title and CTA link
    const contentContainer = teaser.querySelector('.ds2-basic-teaser--content-container');
    const textCell = [];
    if (contentContainer) {
      const title = contentContainer.querySelector('.ds2-basic-teaser--title, h2, p');
      if (title) textCell.push(title.cloneNode(true));
    }
    let cta = teaser.querySelector('.ds2-linklist a');
    if (cta) textCell.push(cta.cloneNode(true));
    rows.push([img.cloneNode(true), textCell]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
