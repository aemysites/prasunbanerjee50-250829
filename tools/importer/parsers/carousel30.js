/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  const carousel = element.querySelector('.ds2-model-carousel');
  if (!carousel) return;

  // Header row
  const headerRow = ['Carousel (carousel30)'];
  const rows = [headerRow];

  // --- Extract main heading and intro paragraph (above carousel) ---
  const mainHeading = carousel.querySelector('.ds2-model-carousel--head h1');
  const introContainer = carousel.querySelector('.ds2-model-carousel--head .ds2-expand--copy-content');
  let introParagraph = null;
  if (introContainer) {
    introParagraph = introContainer.querySelector('p');
  }
  if (mainHeading || introParagraph) {
    const cellContent = [];
    if (mainHeading) cellContent.push(mainHeading);
    if (introParagraph) cellContent.push(introParagraph);
    rows.push(['', cellContent]);
  }

  // Find the image slider and content slider
  const imageSlider = carousel.querySelector('.ds2-model-carousel--image-slider .slick-track');
  const contentSlider = carousel.querySelector('.ds2-model-carousel--content-slider .slick-track');
  if (!imageSlider || !contentSlider) return;

  // Get all visible image slides (skip .slick-cloned)
  const imageSlides = Array.from(imageSlider.children).filter(slide => !slide.classList.contains('slick-cloned'));
  // Get all visible content slides (skip .slick-cloned)
  const contentSlides = Array.from(contentSlider.children).filter(slide => !slide.classList.contains('slick-cloned'));

  // Defensive: Use the minimum of the two lengths
  const slideCount = Math.min(imageSlides.length, contentSlides.length);

  for (let i = 0; i < slideCount; i++) {
    // Image cell: get the <img> from the <picture> in the image slide
    const imgPicture = imageSlides[i].querySelector('picture');
    let imgEl = null;
    if (imgPicture) {
      imgEl = imgPicture.querySelector('img');
    }

    // Text cell: get the content slide's content
    const contentSlide = contentSlides[i];
    // We'll collect: title (h3), price table, and button list
    const textContent = [];
    // Title
    const h3 = contentSlide.querySelector('h3');
    if (h3) textContent.push(h3);
    // Table (price)
    const table = contentSlide.querySelector('.ds2-table-element table');
    if (table) textContent.push(table);
    // Buttons
    const buttonList = contentSlide.querySelector('ul.ds2-buttonlist');
    if (buttonList) textContent.push(buttonList);

    // Add row: [image, text content]
    rows.push([
      imgEl ? imgEl : '',
      textContent.length ? textContent : ''
    ]);
  }

  // --- Extract ALL .ds2-text-only blocks after the carousel (for section heading and description) ---
  let parent = carousel.parentElement;
  const textOnlyBlocks = parent.querySelectorAll('.ds2-text-only');
  textOnlyBlocks.forEach(textBlock => {
    const secHeading = textBlock.querySelector('h2');
    const secContent = textBlock.querySelector('.ds2-expand--copy-content p');
    const cellContent = [];
    if (secHeading) cellContent.push(secHeading);
    if (secContent) cellContent.push(secContent);
    if (cellContent.length) {
      rows.push(['', cellContent]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
