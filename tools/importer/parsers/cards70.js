/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards70) block: 2 columns, multiple rows, first row is header
  const headerRow = ['Cards (cards70)'];
  const rows = [headerRow];

  // Helper to extract image from image-card
  function getImage(card) {
    const imgWrapper = card.querySelector('.rad-mosaic__image-card-image');
    if (imgWrapper) {
      const img = imgWrapper.querySelector('img');
      if (img) return img;
    }
    return '';
  }

  // Helper to extract text content from card description
  function getTextContent(card) {
    const desc = card.querySelector('.rad-mosaic__card-description');
    if (!desc) return '';
    // Eyebrow
    const eyebrow = desc.querySelector('.rad-mosaic__card-description-eyebrow');
    // Title
    const title = desc.querySelector('.rad-mosaic__card-description-title');
    // Compose
    const frag = document.createDocumentFragment();
    if (eyebrow) frag.appendChild(eyebrow.cloneNode(true));
    if (title) frag.appendChild(title.cloneNode(true));
    return frag;
  }

  // Helper to extract CTA/button from card (for modal card)
  function getCTA(card) {
    const iconButton = card.querySelector('.rad-icon-button');
    if (iconButton) {
      // Create a button with arrow icon and text
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.background = '#a000f2'; // purple
      btn.style.border = 'none';
      btn.style.borderRadius = '2px';
      btn.style.padding = '8px';
      btn.style.display = 'inline-flex';
      btn.style.alignItems = 'center';
      btn.style.justifyContent = 'center';
      btn.style.cursor = 'pointer';
      // Add text
      const textDiv = iconButton.querySelector('.rad-icon-button__text');
      if (textDiv) {
        btn.appendChild(textDiv.cloneNode(true));
      }
      // Arrow icon
      const arrow = iconButton.querySelector('.rad-icon__right');
      if (arrow) {
        btn.appendChild(arrow.cloneNode(true));
      } else {
        // fallback: unicode arrow
        btn.appendChild(document.createTextNode('→'));
      }
      btn.setAttribute('aria-label', textDiv ? textDiv.textContent.trim() : 'Read More');
      return btn;
    }
    return null;
  }

  // Helper to extract modal content for the last card
  function getModalContent(card, document) {
    const modalId = card.getAttribute('aria-controls');
    const modal = modalId ? document.getElementById(modalId) : null;
    if (!modal) return null;
    const frag = document.createDocumentFragment();
    // Modal hero
    const hero = modal.querySelector('.modal-hero__top');
    if (hero) {
      const eyebrow = hero.querySelector('.modal-hero__eyebrow');
      if (eyebrow) frag.appendChild(eyebrow.cloneNode(true));
      const headline = hero.querySelector('h3');
      if (headline) frag.appendChild(headline.cloneNode(true));
      const subheader = hero.querySelector('.modal-hero__subheader');
      if (subheader) frag.appendChild(subheader.cloneNode(true));
    }
    // Stat
    const stat = modal.querySelector('.modal-hero__stat');
    if (stat) frag.appendChild(stat.cloneNode(true));
    // Card stack
    const stack = modal.querySelector('.modal__card-stack');
    if (stack) frag.appendChild(stack.cloneNode(true));
    return frag;
  }

  // Get all card elements (divs and buttons with card classes)
  const cardNodes = Array.from(element.children).filter(
    (child) => child.classList.contains('rad-mosaic__card')
  );

  cardNodes.forEach((card) => {
    // If it's a modal trigger card (button with modal content)
    if (card.tagName === 'BUTTON') {
      // Extract both the summary and the modal content
      const textCell = document.createDocumentFragment();
      // Card summary
      const desc = card.querySelector('.rad-mosaic__card-description');
      if (desc) {
        const eyebrow = desc.querySelector('.rad-mosaic__card-description-eyebrow');
        const title = desc.querySelector('.rad-mosaic__card-description-title');
        if (eyebrow) textCell.appendChild(eyebrow.cloneNode(true));
        if (title) textCell.appendChild(title.cloneNode(true));
      }
      // CTA
      const cta = getCTA(card);
      if (cta) {
        textCell.appendChild(cta);
      }
      // Modal content
      const modalContent = getModalContent(card, document);
      if (modalContent) {
        textCell.appendChild(modalContent);
      }
      rows.push(['', textCell]);
    } else {
      // Normal card: image-card or no-image
      const img = getImage(card);
      const textCell = getTextContent(card);
      rows.push([img, textCell]);
    }
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
