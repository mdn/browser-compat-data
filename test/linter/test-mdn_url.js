const chalk = require('chalk');

// Used for dictionaries where slugs have format /dictionaryName#valueName
const dictionaryPattern = {
  __default: {
    __slug: key => '#' + key,
  },
};

const noSlugPattern = {
  __slug: '',
};

/*
 * Map of data keys to URL segments
 */
const URLPatternMap = {
  __slug: 'https://developer.mozilla.org/docs',
  api: {
    __slug: '/Web/API',
    XMLHttpRequest: {
      responseType: dictionaryPattern,
      send: dictionaryPattern,
    },
    WebGLRenderingContext: {
      __slug: '/WebGLRenderingContext',
      '^uniformMatrix[234]fv$': {
        __slug: 'uniformMatrix[234]fv',
      },
      '^uniformMatrix[234]fv$': {
        __slug: 'uniformMatrix[234]fv',
      },
    },
    PaintWorkletGlobalScope: {
      // See https://github.com/mdn/browser-compat-data/pull/4416#issuecomment-517339589
      __slug: '/PaintWorklet',
    },
    RTCIceCredentialType: dictionaryPattern,
    ServiceWorkerRegistration: {
      showNotification: {
        __default: {
          __slug: '',
        },
      },
    },
    XREnvironmentBlendMode: dictionaryPattern,
    XREye: dictionaryPattern,
    XRSessionMode: dictionaryPattern,
  },
  css: {
    __slug: '/Web/CSS',
    content: noSlugPattern,
    properties: {
      __slug: '',
      'background-image': {
        __slug: '',
        gradients: {
          // TODO: consider renaming in MDN from gradients to gradient
          __slug: '/gradient',
        },
        'image-rect': {
          // TODO: consider moving MDN page from /-moz-image-rect to /image-rect
          __slug: '/-moz-image-rect',
        },
      },
      'custom-property': {
        __slug: '',
      },
    },
    types: {
      __slug: '',
      angle: dictionaryPattern,
      global_keywords: noSlugPattern,
    },
    'at-rules': {
      __slug: '',
      __default: {
        __slug: key => `/@${key}`,
      },
    },
    selectors: {
      __slug: '',
      id: {
        // TODO: ID_selectors
        __slug: '/ID_selectors',
      },
      namespace: {
        // This property relates to @namespace selector (from at-rules/@namespace)
        // See https://github.com/mdn/browser-compat-data/pull/750
        __slug: '/@namespace',
      },
      __default: {
        __slug: key => `/::?${key}`,
      },
    },
  },
  html: {
    __slug: '/Web',
    elements: {
      __slug: '/HTML/Element',
      input: {
        __default: {
          // Removes "imput-" from "input-something"
          __slug: key => '/' + key.substring('input-'.length),
        },
      },
    },
    global_attributes: {
      __slug: '/HTML/Global_attributes',
    },
    manifest: {
      __slug: '/Manifest',
    },
  },
  http: {
    __slug: '/Web/HTTP',
    methods: {
      __slug: '/Methods',
    },
    headers: {
      __slug: '/Headers',
      csp: noSlugPattern,
    },
    status: {
      __slug: '/Status',
    },
  },
  mathml: {
    __slug: '/Web/MathML',
    elements: {
      __slug: '/Element',
      __default: {
        __default: {
          // TODO: is this convention really necessary?
          __slug: key => `#attr-${key}`,
        },
      },
    },
  },
  javascript: {
    __slug: '/Web/JavaScript/Reference',
    operators: {
      __slug: '/Operators',
    },
    builtins: {
      __slug: '/Global_Objects',
      Intl: {
        // TODO: move Intl?
        // As per https://github.com/mdn/sprints/issues/2537
        __slug: '',
        getCanonicalLocales: {
          //
          __slug: '/Intl/getCanonicalLocales',
        },
      },
    },
    classes: {
      __slug: '/Classes',
    },
    functions: {
      __slug: '/Functions',
    },
    statements: {
      __slug: '/Statements',
    },
  },
  svg: {
    __slug: '/Web/SVG',
    attributes: {
      __slug: '/Attribute',
      conditional_processing: noSlugPattern,
      core: noSlugPattern,
      document: noSlugPattern,
      events: {
        __slug: '',
        global: noSlugPattern,
        document: noSlugPattern,
        animation: noSlugPattern,
        graphical: noSlugPattern,
      },
      graphical: noSlugPattern,
      presentation: noSlugPattern,
      style: noSlugPattern,
    },
    elements: {
      __slug: '/Element',
    },
  },
  webdriver: {
    __slug: '/Web/WebDriver',
    commands: {
      __slug: '/Commands',
    },
  },
  webextensions: {
    __slug: '/Mozilla/Add-ons/WebExtensions',
    api: {
      __slug: '/API',
      devtools: {
        __default: {
          // TODO: may be, move the articles?
          __slug: key => `.${key}`,
        },
      },
    },
    manifest: {
      __slug: '/manifest.json',
      content_security_policy: dictionaryPattern,
      theme: dictionaryPattern,
      theme_experiment: {
        __default: {
          // See https://github.com/mdn/browser-compat-data/pull/5800#issuecomment-596950381
          __slug: '#Syntax',
        },
      },
    },
  },
  xpath: {
    __slug: '/Web/XPath',
    axes: {
      __slug: '/Axes',
    },
  },
  xslt: {
    __slug: '',
    exslt: {
      __slug: '/Web/EXSLT',
    },
    elements: {
      __slug: '/Web/XSLT/Element',
      stylesheet: {
        __default: {
          // TODO: is this convention really necessary?
          __slug: key => `#attr-${key}`,
        },
      },
    },
  },
};

/**
 * @param {Identifier} data
 * @param {import('../utils').Logger} logger
 */
function hasCorrectMDNURLRecursive(data, logger) {
  // stack variable is used to minimize the real VM stack and use depth-first
  // search, saving some resources.
  const stack = [
    {
      currData: data,
      pattern: URLPatternMap.__slug,
      URLPatternMap: URLPatternMap,
    },
  ];

  while (stack.length > 0) {
    const item = stack.pop();

    for (const key in item.currData) {
      const currData = item.currData[key];
      const actualURL = currData && currData.mdn_url;
      const URLPatternMap =
        (item.URLPatternMap && item.URLPatternMap[key]) ||
        (item.URLPatternMap && item.URLPatternMap.__default);

      const slug = URLPatternMap && URLPatternMap.__slug;
      const newItem = {
        currData: currData,
        pattern: undefined,
        URLPatternMap: URLPatternMap,
      };

      switch (key) {
        // Check the actual MDN URL, if such exists
        case '__compat':
          if (actualURL && !actualURL.match(item.pattern)) {
            logger.error(chalk`{red Incorrect mdn_url for {bold ${key}}}
              {yellow Actual: {bold "${actualURL || ''}"}}
              {green Expected: {bold "${item.pattern}"}}`);
          }
          break;

        // worker_support and secure_context_required do not need URLs
        case 'worker_support':
        // fallthrough
        case 'secure_context_required':
          if (actualURL !== undefined) {
            logger.error(chalk`{red Incorrect mdn_url for {bold ${key}}}
              {yellow Actual: {bold "${actualURL || ''}"}}
              {green Expected: {bold undefined}}`);
            continue;
          }
          // no need to push on stack
          break;

        //
        default:
          switch (typeof slug) {
            case 'string':
              newItem.pattern = item.pattern + slug;
              break;
            case 'function':
              newItem.pattern = item.pattern + slug(key);
              break;
            case 'undefined':
              newItem.pattern = item.pattern + '/' + key;
              break;
            default:
              console.log('DEFAULT');
          }

          stack.push(newItem);
          break;
      }
    }
  }
}

/**
 * @param {string} filename
 */
function testMDNUrls(filename) {
  /** @type {Identifier} */
  // TODO(bershanskiy): remove require, if applicable
  // See https://github.com/mdn/browser-compat-data/pull/5795
  const data = require(filename);

  /** @type {string[]} */
  const errors = [];
  const logger = {
    /** @param {...unknown} message */
    error: (...message) => {
      errors.push(message.join(' '));
    },
  };

  hasCorrectMDNURLRecursive(data, logger);

  if (errors.length) {
    console.error(
      chalk`{red   mdn_urls – {bold ${errors.length}} ${
        errors.length === 1 ? 'error' : 'errors'
      }:}`,
    );
    for (const error of errors) {
      console.error(`    ${error}`);
    }
    return true;
  }
  return false;
}

module.exports = testMDNUrls;
