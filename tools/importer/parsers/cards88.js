/* global WebImporter */
export default function parse(element, { document }) {
  // Find all carousel slides representing cards
  const slides = Array.from(
    element.querySelectorAll('.cmp-carousel__content > .swiper-slide')
  );

  // Table header row must match block name exactly
  const headerRow = ['Cards (cards88)'];
  const rows = [headerRow];

  // Parse each card/slide
  slides.forEach((slide) => {
    // Extract image: reference the actual <img> element
    const img = slide.querySelector('.cmp-image__image');
    let imageEl = img || null;

    // Extract title (first h3 inside slide)
    const title = slide.querySelector('h3');
    // Extract description (first p inside slide)
    const desc = slide.querySelector('p');
    // Extract CTA (first .cmp-button a inside slide)
    const cta = slide.querySelector('.cmp-button');

    // Compose text cell: preserve semantic order
    const textCell = [];
    if (title) textCell.push(title);
    if (desc) textCell.push(desc);
    if (cta) textCell.push(cta);

    // Add row: [image, text content]
    rows.push([
      imageEl,
      textCell
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
