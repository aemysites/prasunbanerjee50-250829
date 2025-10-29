/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards55) block: extract cards with image/video and text
  const headerRow = ['Cards (cards55)'];
  const rows = [headerRow];

  // Find carousel content area
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Find all slides (cards)
  const slides = carouselContent.querySelectorAll('.swiper-slide');
  slides.forEach((slide) => {
    // Card image or video
    let mediaEl = null;
    // Try image
    const img = slide.querySelector('img.cmp-image__image');
    if (img) {
      mediaEl = img;
    } else {
      // Try video poster
      const videoPoster = slide.querySelector('img.cmp-video__poster');
      if (videoPoster) {
        mediaEl = videoPoster;
      }
    }
    // If no image found, try to find video player and create a link to its src
    if (!mediaEl) {
      const video = slide.querySelector('video');
      if (video && video.src) {
        const link = document.createElement('a');
        link.href = video.src;
        link.textContent = 'Video';
        mediaEl = link;
      }
    }

    // Card text content: title + description
    const textCell = document.createElement('div');
    // Title
    const title = slide.querySelector('.cmp-title__text');
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      textCell.appendChild(h3);
    }
    // Description
    const desc = slide.querySelector('.cmp-text__paragraph');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textCell.appendChild(p);
    }

    // Defensive: if nothing found, skip this card
    if (!mediaEl || !textCell.hasChildNodes()) return;

    rows.push([mediaEl, textCell]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
