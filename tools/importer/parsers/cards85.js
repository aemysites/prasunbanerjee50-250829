/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards85) block: 2 columns, multiple rows
  // Each card: image (first cell), text (second cell)
  // The block header must be: ['Cards (cards85)']

  const mainSlider = element.querySelector('.ds2-slider--main');
  const bottomSlider = element.querySelector('.ds2-slider--bottom');
  if (!mainSlider || !bottomSlider) return;

  const imageSlides = Array.from(mainSlider.querySelectorAll('.ds2-slider--slide'));
  const textSlides = Array.from(bottomSlider.querySelectorAll('.ds2-slider--slide'));
  const cardCount = Math.min(imageSlides.length, textSlides.length);

  const rows = [];
  rows.push(['Cards (cards85)']);

  for (let i = 0; i < cardCount; i++) {
    // Use the actual <img> src from the HTML, not <source> data-srcset
    let imgEl = '';
    const imgOuter = imageSlides[i].querySelector('.ds2-slider--img-outer');
    if (imgOuter) {
      const picture = imgOuter.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          imgEl = document.createElement('img');
          imgEl.src = img.getAttribute('src');
        }
      }
      // Include magnifier icon overlay as in screenshot
      const icon = imgOuter.querySelector('.ds2-icon--magnifier-white');
      if (icon) {
        const wrapper = document.createElement('div');
        if (imgEl) wrapper.appendChild(imgEl);
        wrapper.appendChild(icon.cloneNode(true));
        imgEl = wrapper;
      }
    }

    // Text cell: use all text content inside .ds2-slider-slide-details
    let textCell = '';
    const details = textSlides[i].querySelector('.ds2-slider-slide-details');
    if (details) {
      textCell = document.createElement('div');
      Array.from(details.childNodes).forEach((node) => {
        textCell.appendChild(node.cloneNode(true));
      });
    }

    rows.push([imgEl, textCell]);
  }

  // Only card rows, no navigation/pagination rows
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
