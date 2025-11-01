/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from card
  function extractImage(card) {
    let img = card.querySelector('.rad-content-grid-card__full-image img');
    if (!img) {
      img = card.querySelector('.rad-content-grid-card__half-image img');
    }
    return img;
  }

  // Helper to extract text content from card
  function extractTextContent(card) {
    const frag = document.createDocumentFragment();
    const label = card.querySelector('.rad-content-grid-card__label');
    if (label) {
      const small = document.createElement('div');
      small.textContent = label.textContent.trim();
      small.style.fontSize = 'smaller';
      frag.appendChild(small);
    }
    const title = card.querySelector('.rad-content-grid-card__title');
    if (title) {
      const h2 = document.createElement('h2');
      h2.textContent = title.textContent.trim();
      frag.appendChild(h2);
    }
    const desc = card.querySelector('.rad-content-grid-card__back-content .rad-content-grid-card__content');
    if (desc) {
      Array.from(desc.childNodes).forEach(node => frag.appendChild(node.cloneNode(true)));
    }
    const cta = card.querySelector('.rad-content-grid-card__back-content a.rad-button');
    if (cta) {
      const btnText = cta.querySelector('.rad-button__text');
      const link = document.createElement('a');
      link.href = cta.href;
      link.textContent = btnText ? btnText.textContent.trim() : cta.textContent.trim();
      frag.appendChild(link);
    }
    return frag;
  }

  const cardWrappers = element.querySelectorAll('.rad-grid-card-carousel__card-wrapper');
  const rows = [];
  rows.push(['Carousel (carousel55)']);

  cardWrappers.forEach(wrapper => {
    const card = wrapper.querySelector('.rad-content-grid-card');
    if (!card) return;
    const img = extractImage(card);
    const textContent = extractTextContent(card);
    rows.push([
      img ? img : '',
      textContent.childNodes.length ? textContent : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
