/* global WebImporter */
export default function parse(element, { document }) {
  // Find carousel container holding the cards
  const carousel = element.querySelector('.cmp-carousel__content');
  if (!carousel) return;
  const slides = Array.from(carousel.querySelectorAll('[data-cmp-hook-carousel="item"]'));

  // Table header must match block name exactly
  const headerRow = ['Cards (cards38)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    // --- IMAGE ---
    const img = slide.querySelector('.cmp-image__image');
    if (!img) return;

    // --- TEXT CONTENT ---
    const textParts = [];
    // Title: Find any heading inside the slide
    const heading = slide.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) textParts.push(heading);
    // Description: Find all paragraphs inside the slide
    const paragraphs = slide.querySelectorAll('p');
    paragraphs.forEach(p => textParts.push(p));
    // CTA: Find all links inside the slide
    const links = slide.querySelectorAll('a');
    links.forEach(a => textParts.push(a));

    // If no text content, skip this card
    if (!textParts.length) return;

    // Compose row: [image, [textParts...]]
    rows.push([img, textParts]);
  });

  // Create table using WebImporter utility
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
