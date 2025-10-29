/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get tab label
  function getTabLabel(btn) {
    if (!btn) return '';
    const span = btn.querySelector('.cmp-tabs__tabtitle');
    return span ? span.textContent.trim() : btn.textContent.trim();
  }

  // Find tabs root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab buttons
  const tabBtns = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  );
  if (!tabBtns.length) return;

  // Get tab panels
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );
  if (!tabPanels.length) return;

  // Build rows: match tab label to panel content
  const rows = [];
  for (let i = 0; i < tabBtns.length; i++) {
    const label = getTabLabel(tabBtns[i]);
    if (!tabPanels[i]) continue;
    const panel = tabPanels[i];

    // Extract only the visible card content for each tab
    // Find all .cmp-multi-content-item__wrapper elements inside the panel
    const wrappers = panel.querySelectorAll('.cmp-multi-content-item__wrapper');
    const contentFragment = document.createDocumentFragment();
    wrappers.forEach(wrapper => {
      // For each card, extract heading, description, button, and image if present
      const cardFragment = document.createElement('div');
      cardFragment.className = 'tab-card';

      // Image (poster)
      const img = wrapper.closest('.cmp-multi-content__slide')?.querySelector('img.cmp-video__poster');
      if (img) {
        cardFragment.appendChild(img.cloneNode(true));
      }

      // Heading
      const heading = wrapper.querySelector('.cmp-multi-content-item__expand-title, .cmp-title__text');
      if (heading) {
        const h = document.createElement('h4');
        h.textContent = heading.textContent.trim();
        cardFragment.appendChild(h);
      }
      // Description
      const desc = wrapper.querySelector('.cmp-multi-content-item__text p');
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        cardFragment.appendChild(p);
      }
      // Button (Prikaži više)
      const btn = wrapper.querySelector('.cmp-multi-content-item__content-toggle, .cmp-multi-content-item__expand');
      if (btn) {
        const button = document.createElement('p');
        let btnLabel = btn.getAttribute('data-text-more') || btn.textContent.trim();
        if (!btnLabel) {
          const span = btn.querySelector('span');
          btnLabel = span ? span.textContent.trim() : '';
        }
        button.textContent = btnLabel;
        cardFragment.appendChild(button);
      }
      // Saznajte više link (for Povezivanje tab)
      const link = wrapper.querySelector('.cmp-multi-content-item__link a');
      if (link) {
        cardFragment.appendChild(link.cloneNode(true));
      }
      contentFragment.appendChild(cardFragment);
    });
    rows.push([
      label,
      contentFragment
    ]);
  }

  // Table header must match block name exactly
  const headerRow = ['Tabs (tabs60)'];
  const tableRows = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace original element
  element.replaceWith(table);
}
