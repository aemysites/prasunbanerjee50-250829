/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import carousel3Parser from './parsers/carousel3.js';
import cards6Parser from './parsers/cards6.js';
import hero5Parser from './parsers/hero5.js';
import columns8Parser from './parsers/columns8.js';
import hero4Parser from './parsers/hero4.js';
import carousel7Parser from './parsers/carousel7.js';
import tabs9Parser from './parsers/tabs9.js';
import hero11Parser from './parsers/hero11.js';
import accordion13Parser from './parsers/accordion13.js';
import columns14Parser from './parsers/columns14.js';
import cards16Parser from './parsers/cards16.js';
import tabs15Parser from './parsers/tabs15.js';
import columns21Parser from './parsers/columns21.js';
import cards10Parser from './parsers/cards10.js';
import carousel23Parser from './parsers/carousel23.js';
import cards22Parser from './parsers/cards22.js';
import hero27Parser from './parsers/hero27.js';
import columns19Parser from './parsers/columns19.js';
import cards28Parser from './parsers/cards28.js';
import cards32Parser from './parsers/cards32.js';
import cards29Parser from './parsers/cards29.js';
import columns33Parser from './parsers/columns33.js';
import columns35Parser from './parsers/columns35.js';
import columns40Parser from './parsers/columns40.js';
import columns43Parser from './parsers/columns43.js';
import columns44Parser from './parsers/columns44.js';
import hero45Parser from './parsers/hero45.js';
import hero46Parser from './parsers/hero46.js';
import tabs48Parser from './parsers/tabs48.js';
import accordion49Parser from './parsers/accordion49.js';
import columns53Parser from './parsers/columns53.js';
import cards54Parser from './parsers/cards54.js';
import carousel55Parser from './parsers/carousel55.js';
import columns56Parser from './parsers/columns56.js';
import cards50Parser from './parsers/cards50.js';
import cards58Parser from './parsers/cards58.js';
import tabs57Parser from './parsers/tabs57.js';
import cardsNoImages60Parser from './parsers/cardsNoImages60.js';
import carousel61Parser from './parsers/carousel61.js';
import hero65Parser from './parsers/hero65.js';
import cardsNoImages66Parser from './parsers/cardsNoImages66.js';
import cards62Parser from './parsers/cards62.js';
import cards67Parser from './parsers/cards67.js';
import cards68Parser from './parsers/cards68.js';
import columns69Parser from './parsers/columns69.js';
import hero71Parser from './parsers/hero71.js';
import columns72Parser from './parsers/columns72.js';
import columns73Parser from './parsers/columns73.js';
import cardsNoImages74Parser from './parsers/cardsNoImages74.js';
import cards70Parser from './parsers/cards70.js';
import cards75Parser from './parsers/cards75.js';
import cards76Parser from './parsers/cards76.js';
import cards77Parser from './parsers/cards77.js';
import columns79Parser from './parsers/columns79.js';
import cards78Parser from './parsers/cards78.js';
import columns81Parser from './parsers/columns81.js';
import tabs82Parser from './parsers/tabs82.js';
import columns34Parser from './parsers/columns34.js';
import hero84Parser from './parsers/hero84.js';
import cards86Parser from './parsers/cards86.js';
import accordion83Parser from './parsers/accordion83.js';
import cards85Parser from './parsers/cards85.js';
import columns90Parser from './parsers/columns90.js';
import tabs92Parser from './parsers/tabs92.js';
import cards88Parser from './parsers/cards88.js';
import hero94Parser from './parsers/hero94.js';
import cards97Parser from './parsers/cards97.js';
import accordion98Parser from './parsers/accordion98.js';
import cards96Parser from './parsers/cards96.js';
import cards93Parser from './parsers/cards93.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import sectionsTransformer from './transformers/sections.js';
import { TransformHook } from './transformers/transform.js';
import { customParsers, customTransformers, customElements } from './import.custom.js';
import {
  generateDocumentPath,
  handleOnLoad,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  carousel3: carousel3Parser,
  cards6: cards6Parser,
  hero5: hero5Parser,
  columns8: columns8Parser,
  hero4: hero4Parser,
  carousel7: carousel7Parser,
  tabs9: tabs9Parser,
  hero11: hero11Parser,
  accordion13: accordion13Parser,
  columns14: columns14Parser,
  cards16: cards16Parser,
  tabs15: tabs15Parser,
  columns21: columns21Parser,
  cards10: cards10Parser,
  carousel23: carousel23Parser,
  cards22: cards22Parser,
  hero27: hero27Parser,
  columns19: columns19Parser,
  cards28: cards28Parser,
  cards32: cards32Parser,
  cards29: cards29Parser,
  columns33: columns33Parser,
  columns35: columns35Parser,
  columns40: columns40Parser,
  columns43: columns43Parser,
  columns44: columns44Parser,
  hero45: hero45Parser,
  hero46: hero46Parser,
  tabs48: tabs48Parser,
  accordion49: accordion49Parser,
  columns53: columns53Parser,
  cards54: cards54Parser,
  carousel55: carousel55Parser,
  columns56: columns56Parser,
  cards50: cards50Parser,
  cards58: cards58Parser,
  tabs57: tabs57Parser,
  cardsNoImages60: cardsNoImages60Parser,
  carousel61: carousel61Parser,
  hero65: hero65Parser,
  cardsNoImages66: cardsNoImages66Parser,
  cards62: cards62Parser,
  cards67: cards67Parser,
  cards68: cards68Parser,
  columns69: columns69Parser,
  hero71: hero71Parser,
  columns72: columns72Parser,
  columns73: columns73Parser,
  cardsNoImages74: cardsNoImages74Parser,
  cards70: cards70Parser,
  cards75: cards75Parser,
  cards76: cards76Parser,
  cards77: cards77Parser,
  columns79: columns79Parser,
  cards78: cards78Parser,
  columns81: columns81Parser,
  tabs82: tabs82Parser,
  columns34: columns34Parser,
  hero84: hero84Parser,
  cards86: cards86Parser,
  accordion83: accordion83Parser,
  cards85: cards85Parser,
  columns90: columns90Parser,
  tabs92: tabs92Parser,
  cards88: cards88Parser,
  hero94: hero94Parser,
  cards97: cards97Parser,
  accordion98: accordion98Parser,
  cards96: cards96Parser,
  cards93: cards93Parser,
  ...customParsers,
};

const transformers = [
  cleanupTransformer,
  imageTransformer,
  linkTransformer,
  sectionsTransformer,
  ...(Array.isArray(customTransformers)
    ? customTransformers
    : Object.values(customTransformers)),
];

// Additional page elements to parse that are not included in the inventory
const pageElements = [{ name: 'metadata' }, ...customElements];

WebImporter.Import = {
  replaceWithErrorBlock: (element, message) => {
    if (!element || !element.parentElement) return;
    const headerRow = ['Columns (exc-import-error)'];
    const rows = [headerRow, [message]];

    const errorElement = WebImporter.DOMUtils.createTable(rows, document);
    try {
      element.replaceWith(errorElement);
    } catch (e) {
      console.warn(`Failed to replace element with error element: ${message}`, e);
    }
  },
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    transformers.forEach((transformerFn) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

const ReportBuilder = () => {
  const report = { 'Has Failed Parser': 'false', 'Failed Parsers': [] };
  return {
    getReport: () => report,
    addFailedParser: (parserName) => {
      report['Has Failed Parser'] = 'true';
      report['Failed Parsers'].push(parserName);
    },
  };
};

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL }, reportBuilder } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        uuid: instance.uuid,
        section: instance.section,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  const defaultContentElements = inventory.outliers
    .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
    .map((instance) => ({
      ...instance,
      element: WebImporter.Import.getElementByXPath(document, instance.xpath),
    }))
    .filter((block) => block.element);

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, document.body, { ...source });

  // transform all elements using parsers
  [...defaultContentElements, ...blockElements, ...pageElements]
    // sort elements by order in the page
    .sort((a, b) => (a.uuid ? parseInt(a.uuid.split('-')[1], 10) - parseInt(b.uuid.split('-')[1], 10) : 999))
    // filter out fragment elements
    .filter((item) => !fragmentElements.includes(item.element))
    .forEach((item, idx, arr) => {
      const emptyElement = document.createElement('div');
      const { element = emptyElement, ...pageBlock } = item;
      const parserName = WebImporter.Import.getParserName(pageBlock);
      const parserFn = parsers[parserName];

      let parserElement = element;
      if (typeof parserElement === 'string') {
        parserElement = document.body.querySelector(parserElement);
      }
      const originalContent = parserElement.innerHTML;
      try {
        main.append(parserElement);
        // before parse hook
        WebImporter.Import.transform(
          TransformHook.beforeParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
            nextEl: arr[idx + 1],
          },
        );
        if (parserFn) {
          // parse the element
          parserFn.call(this, parserElement, { ...source });
          if (parserElement.parentElement && parserElement.innerHTML === originalContent) {
            WebImporter.Import.replaceWithErrorBlock(parserElement, `Failed to parse content into block - please check the parser ${parserName}`);
            reportBuilder.addFailedParser(parserName);
          }
        }
        // after parse hook
        WebImporter.Import.transform(
          TransformHook.afterParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
          },
        );
      } catch (e) {
        console.warn(`Failed to parse block: ${parserName}`, e);
        WebImporter.Import.reaplceWithErrorBlock(parserElement, `Failed to parse content into block with exception: "${e.message}" - please check the parser ${parserName}`);
        if (parserFn) {
          reportBuilder.addFailedParser(parserName);
        }
      }
    });
}

/**
* Fragment transformation function
*/
function transformFragment(main, {
  fragment, inventory, publishUrl, ...source
}) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth, publishUrl,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          parserFn.call(this, element, source);
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (payload) => {
    const { document, params: { originalURL } } = payload;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    const reportBuilder = ReportBuilder();
    const sourceBody = document.body;
    const main = document.createElement('div');

    // before transform hook
    WebImporter.Import.transform(
      TransformHook.beforeTransform,
      sourceBody,
      { ...payload, inventory },
    );

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      transformFragment(main, {
        ...payload, fragment, inventory, publishUrl, reportBuilder,
      });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...payload, inventory, reportBuilder });
      path = generateDocumentPath(payload, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(
      TransformHook.afterTransform,
      main,
      { ...payload, inventory },
    );

    return [{
      element: main,
      path,
      report: reportBuilder.getReport(),
    }];
  },
};
