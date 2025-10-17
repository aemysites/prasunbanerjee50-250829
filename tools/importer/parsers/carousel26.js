/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel26) block: header row, then one row per visible slide (image only, no text)
  const headerRow = ['Carousel (carousel26)'];
  const rows = [headerRow];

  // Only use non-cloned slides and filter out placeholder/null images
  const slides = Array.from(element.querySelectorAll('.ds2-model-carousel--image-slide:not(.slick-cloned)'));

  // Collect all unique car images by src (excluding placeholders and duplicates)
  const seenSrc = new Set();
  slides.forEach((slide) => {
    const img = slide.querySelector('picture img');
    if (
      img &&
      img.src &&
      !/\/null($|[?#])/.test(img.src) &&
      !seenSrc.has(img.src)
    ) {
      seenSrc.add(img.src);
      rows.push([img]); // Only one column: image
    }
  });

  // Defensive: If fewer than 3 images, check for images in all slides (including clones)
  if (rows.length < 4) {
    const allSlides = Array.from(element.querySelectorAll('.ds2-model-carousel--image-slide'));
    allSlides.forEach((slide) => {
      const img = slide.querySelector('picture img');
      if (
        img &&
        img.src &&
        !/\/null($|[?#])/.test(img.src) &&
        !seenSrc.has(img.src)
      ) {
        seenSrc.add(img.src);
        rows.push([img]);
      }
    });
  }

  // Final check: Only keep the first three unique car images (as shown in the screenshot)
  if (rows.length > 4) {
    rows.length = 4;
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
