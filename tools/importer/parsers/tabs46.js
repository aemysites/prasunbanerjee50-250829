/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tab bar header
  const tabBarHeader = element.querySelector('.tab-bar-header');
  if (!tabBarHeader) return;

  // Get tab label buttons
  const tabButtons = Array.from(tabBarHeader.querySelectorAll('button[role="tab"]'));

  // Find the 'Pogled 360 stepeni' element (icon + text)
  let pogledCell = '';
  const flexRow = element.querySelector('.tw-flex-row');
  if (flexRow) {
    // Find the element with 'Pogled 360 stepeni' text
    const nodes = Array.from(flexRow.querySelectorAll('*'));
    for (const node of nodes) {
      if (node.textContent && node.textContent.trim().includes('Pogled 360 stepeni')) {
        // Compose cell: include icon if present (next sibling or child)
        const cell = document.createElement('span');
        // Check for icon in children or siblings
        let icon = null;
        if (node.querySelector('svg')) {
          icon = node.querySelector('svg').cloneNode(true);
        } else if (node.previousElementSibling && node.previousElementSibling.tagName.toLowerCase() === 'svg') {
          icon = node.previousElementSibling.cloneNode(true);
        } else if (node.nextElementSibling && node.nextElementSibling.tagName.toLowerCase() === 'svg') {
          icon = node.nextElementSibling.cloneNode(true);
        }
        if (icon) cell.appendChild(icon);
        cell.append(document.createTextNode('Pogled 360 stepeni'));
        pogledCell = cell;
        break;
      }
    }
  }

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs46)']);

  // Each tab: label in first cell, empty content in second cell
  tabButtons.forEach((btn) => {
    rows.push([btn.textContent.trim(), '']);
  });

  // Add row for 'Pogled 360 stepeni' if found
  if (pogledCell) {
    rows.push(['', pogledCell]);
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
