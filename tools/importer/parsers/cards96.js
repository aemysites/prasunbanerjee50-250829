/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards96) block: 2 columns, each row = card (image/icon + text)
  const headerRow = ['Cards (cards96)'];
  const rows = [headerRow];

  // Select all card buttons (each card is a <button> with .rad-mosaic__card)
  const cardEls = element.querySelectorAll('button.rad-mosaic__card');

  cardEls.forEach((cardEl) => {
    // --- IMAGE/ICON CELL ---
    let imageCell = null;
    // Try to find image inside .rad-mosaic__image-card-image
    const imageWrapper = cardEl.querySelector('.rad-mosaic__image-card-image .cmp-image img');
    if (imageWrapper) {
      imageCell = imageWrapper;
    } else {
      // Try to find icon from modal card stack if no image
      const modalId = cardEl.getAttribute('aria-controls');
      let iconImg = null;
      if (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
          // Find first .card img in modal card stack
          const cardIcon = modal.querySelector('.modal__card-stack .card img');
          if (cardIcon) {
            iconImg = cardIcon.cloneNode(true);
          }
        }
      }
      if (iconImg) {
        imageCell = iconImg;
      } else {
        imageCell = document.createElement('span');
        imageCell.textContent = '';
      }
    }

    // --- TEXT CELL ---
    const textCellContent = [];
    // Eyebrow
    const eyebrow = cardEl.querySelector('.rad-mosaic__card-description-eyebrow');
    if (eyebrow) {
      const eyebrowDiv = document.createElement('div');
      eyebrowDiv.textContent = eyebrow.textContent;
      textCellContent.push(eyebrowDiv);
    }
    // Title
    const title = cardEl.querySelector('.rad-mosaic__card-description-title');
    if (title) {
      const titleEl = document.createElement('strong');
      titleEl.textContent = title.textContent;
      textCellContent.push(titleEl);
    }
    // --- Description from modal (headline/subheader/stat/card stack) ---
    const modalId = cardEl.getAttribute('aria-controls');
    if (modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        // Modal headline
        const headline = modal.querySelector('.modal-hero__headline');
        if (headline) {
          const headlineEl = document.createElement('div');
          headlineEl.textContent = headline.textContent;
          textCellContent.push(headlineEl);
        }
        // Modal subheader
        const subheader = modal.querySelector('.modal-hero__subheader');
        if (subheader) {
          const subheaderEl = document.createElement('div');
          subheaderEl.textContent = subheader.textContent;
          textCellContent.push(subheaderEl);
        }
        // Modal stat
        const statDigits = modal.querySelector('.modal-hero__stat .stat__digits');
        const statDetail = modal.querySelector('.modal-hero__stat .stat__detail');
        if (statDigits && statDetail) {
          const statDiv = document.createElement('div');
          statDiv.textContent = `${statDigits.textContent} ${statDetail.textContent}`;
          textCellContent.push(statDiv);
        }
        // Modal card stack (list of subcards)
        const cardStack = modal.querySelectorAll('.modal__card-stack .card');
        cardStack.forEach((subCard) => {
          // Icon
          const subIcon = subCard.querySelector('img');
          // Title
          const subTitle = subCard.querySelector('.card__title');
          // Body
          const subBody = subCard.querySelector('.card__body');
          const subDiv = document.createElement('div');
          if (subIcon) {
            subDiv.appendChild(subIcon.cloneNode(true));
          }
          if (subTitle) {
            const subTitleEl = document.createElement('strong');
            subTitleEl.textContent = subTitle.textContent;
            subDiv.appendChild(subTitleEl);
          }
          if (subBody) {
            subDiv.appendChild(subBody.cloneNode(true));
          }
          textCellContent.push(subDiv);
        });
        // Modal CTA
        const ctaLink = modal.querySelector('.mosaic-modal__cta a');
        if (ctaLink) {
          const a = document.createElement('a');
          a.href = ctaLink.href;
          a.textContent = ctaLink.querySelector('.rad-button__text')?.textContent || ctaLink.textContent;
          textCellContent.push(a);
        }
      }
    }
    rows.push([imageCell, textCellContent]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
