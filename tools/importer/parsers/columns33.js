/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container with the sort and buttons
  const sortFilterContainer = element.querySelector('.sort-filter-container');
  if (!sortFilterContainer) return;

  // 1. First column: Sort options (include all text and links)
  const resultsSortOptions = sortFilterContainer.querySelector('.results-sort-options');
  let col1 = document.createElement('div');
  if (resultsSortOptions) {
    // Clone all children to preserve text and links
    Array.from(resultsSortOptions.childNodes).forEach(node => {
      col1.appendChild(node.cloneNode(true));
    });
  }

  // 2. Second, third, fourth columns: Buttons
  const buttonWrap = sortFilterContainer.querySelector('.cmp-job-results__button-wrap');
  let col2 = document.createElement('div'), col3 = document.createElement('div'), col4 = document.createElement('div');
  if (buttonWrap) {
    // Neue Jobsuche
    const btnNewJobSearch = buttonWrap.querySelector('.cmp-button--new-job-search');
    if (btnNewJobSearch) {
      Array.from(btnNewJobSearch.childNodes).forEach(node => {
        col2.appendChild(node.cloneNode(true));
      });
    }
    // Listenansicht
    const btnListView = buttonWrap.querySelector('.cmp-toggle-btn');
    if (btnListView) {
      Array.from(btnListView.childNodes).forEach(node => {
        col3.appendChild(node.cloneNode(true));
      });
    }
    // Gefilterte Ergebnisse
    const filterDiv = buttonWrap.querySelector('.jobsearchfilter');
    if (filterDiv) {
      const btnFilterResults = filterDiv.querySelector('.cmp-job-search-filtering__cta-results');
      if (btnFilterResults) {
        Array.from(btnFilterResults.childNodes).forEach(node => {
          col4.appendChild(node.cloneNode(true));
        });
      }
    }
  }

  // Build table rows
  const headerRow = ['Columns (columns33)'];
  const columnsRow = [col1, col2, col3, col4];

  // Create the columns table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  element.replaceWith(table);
}
