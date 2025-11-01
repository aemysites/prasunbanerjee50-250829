/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards28) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards28)'];
  const rows = [headerRow];

  // Find all card elements within the parent container
  const cardEls = element.querySelectorAll('.cmp-teaser.card');

  cardEls.forEach(card => {
    // Each card is wrapped by an anchor (.cmp-teaser__title-link)
    const link = card.querySelector('.cmp-teaser__title-link');
    if (!link) return;

    // --- First cell: Icon or image ---
    // Use a placeholder for the star icon and label
    const saveJob = card.querySelector('.cmp-teaser__save-job-card');
    let iconCell;
    if (saveJob) {
      iconCell = document.createElement('div');
      // Use a unicode star and label as fallback for the icon
      iconCell.textContent = '★ Speichern';
    } else {
      iconCell = document.createElement('div');
    }

    // --- Second cell: Text content ---
    // Compose: pretitle (location), title, skill/area, posted date
    const textCell = document.createElement('div');

    // Pretitle: MULTIPLE LOCATIONS
    const pretitle = card.querySelector('.cmp-teaser__pretitle.cmp-teaser-city');
    if (pretitle) {
      const pretitleDiv = document.createElement('div');
      pretitleDiv.textContent = pretitle.textContent.trim().toUpperCase(); // ensure uppercase
      textCell.appendChild(pretitleDiv);
    }

    // Title (h3)
    const title = card.querySelector('.cmp-teaser__title');
    if (title) {
      const heading = document.createElement('h3');
      heading.textContent = title.textContent.trim();
      textCell.appendChild(heading);
    }

    // Skill/Area
    const skill = card.querySelector('.cmp-teaser__job-listing-semibold.skill');
    if (skill) {
      const skillDiv = document.createElement('div');
      skillDiv.textContent = skill.textContent.trim();
      textCell.appendChild(skillDiv);
    }

    // Posted date
    const posted = card.querySelector('.cmp-teaser__job-listing-posted-date');
    if (posted) {
      const postedDiv = document.createElement('div');
      postedDiv.textContent = posted.textContent.trim();
      textCell.appendChild(postedDiv);
    }

    // Wrap textCell with the job link
    if (link && link.href) {
      const a = document.createElement('a');
      a.href = link.href;
      a.appendChild(textCell);
      rows.push([iconCell, a]);
    } else {
      rows.push([iconCell, textCell]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
