#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */
/* jshint esversion: 8 */

'use strict';

const isObsolete = url => {
  const obsoleteBase = [
    'dev.w3.org/html5/spec',
    'dev.w3.org/2006/webapi/selectors-api2',
    'dvcs.w3.org/hg/domcore',
    'immersive-web.github.io/webvr/spec/1.1/',
    'www.ecma-international.org/',
    'www.w3.org/TR/cssom-1',
    'www.w3.org/TR/CSS1/',
    'www.w3.org/TR/REC-DOM-Level-1/',
    'www.w3.org/TR/DOM-Level-2-',
    'www.w3.org/TR/DOM-Level-3-Core/',
    'www.w3.org/TR/DOM-Level-3-Events/',
    'www.w3.org/TR/2000/REC-DOM-Level-2',
    'www.w3.org/TR/2009/REC-DOM-Level-2',
    'www.w3.org/TR/2014/WD-DOM-Level-3-Events-20140925/',
    'www.w3.org/TR/ElementTraversal/',
    'www.w3.org/TR/mixed-content/',
    'www.w3.org/TR/selectors-api/',
    'www.w3.org/TR/dom/',
    'www.w3.org/TR/WD-font',
    'www.w3.org/TR/html5',
    'www.w3.org/TR/2011/WD-html5-20110525',
    'www.w3.org/TR/2016/REC-html51-20161101',
    'www.w3.org/TR/MathML2',
    'www.w3.org/TR/resource-hints',
    'w3c.github.io/editing/',
    'w3c.github.io/webcomponents/spec/shadow/',
    'w3c.github.io/staticrange/',
    'w3c.github.io/microdata/',
    'wiki.csswg.org',
  ];
  const obsoleteSubstrings = [
    'html40',
    'performancetiming',
    'performancenavigation',
    '/screen-orientation/published/',
    'developer.apple.com/library/safari',
  ];
  return (
    obsoleteBase.some(substring => url.startsWith(substring)) ||
    obsoleteSubstrings.some(substring => url.includes(substring))
  );
};

const getAdjustedSpecURL = url => {
  const urlAdjustmentMap = {
    // specBaseURL,
    //   [target, replacement]
    'https://www.ecma-international.org/ecma-402/2.0/': [
      'https://www.ecma-international.org/ecma-402/2.0/',
      'https://tc39.es/ecma402/',
    ],
    'https://wicg.github.io/web-share/level-2/': ['wicg', 'w3c'],
    'https://wicg.github.io/web-share/': ['wicg', 'w3c'],
    'https://w3c.github.io/speech-api/speechapi.html': [
      'https://w3c.github.io/speech-api/speechapi.html',
      'https://wicg.github.io/speech-api/',
    ],
    'https://w3c.github.io/speech-api/': ['w3c', 'wicg'],
    'https://w3c.github.io/keyboard-lock/': ['w3c', 'wicg'],
    'https://w3c.github.io/netinfo/': ['w3c', 'wicg'],
    'https://wicg.github.io/mediasession/': ['wicg', 'w3c'],
    'https://wicg.github.io/media-playback-quality/': ['wicg', 'w3c'],
    'https://wicg.github.io/media-capabilities/': ['wicg', 'w3c'],
    'http://www.w3.org/TR/DOM-Level-3-XPath/': [
      'http://www.w3.org',
      'https://www.w3.org',
    ],
    'https://www.w3.org/TR/CSS21/': ['CSS21', 'CSS2'],
    'https://www.w3.org/TR/uievents/': [
      'https://www.w3.org/TR/uievents/',
      'https://w3c.github.io/uievents/',
    ],
    'https://www.w3.org/TR/DOM-Parsing/': [
      'https://www.w3.org/TR/DOM-Parsing/',
      'https://w3c.github.io/DOM-Parsing/',
    ],
    'https://www.w3.org/TR/FileAPI/': [
      'https://www.w3.org/TR/FileAPI/',
      'https://w3c.github.io/FileAPI/',
    ],
    'https://www.w3.org/TR/SVG/': [
      'https://www.w3.org/TR/SVG/',
      'https://www.w3.org/TR/SVG11/',
    ],
    'https://www.w3.org/TR/SVG2/': [
      'https://www.w3.org/TR/SVG2/',
      'https://svgwg.org/svg2-draft/',
    ],
    'http://w3.org/TR/css3-fonts/': [
      'http://w3.org/TR/css3-fonts/',
      'https://drafts.csswg.org/css-fonts-3/',
    ],
    'https://www.w3.org/TR/css4-images/': [
      'https://www.w3.org/TR/css4-images/',
      'https://drafts.csswg.org/css-images-4/',
    ],
    'https://www.w3.org/TR/mediaqueries-4/': [
      'https://www.w3.org/TR/mediaqueries-4/',
      'https://drafts.csswg.org/mediaqueries-4/',
    ],
    'https://www.w3.org/TR/pointerevents/': [
      'https://www.w3.org/TR/pointerevents/',
      'https://w3c.github.io/pointerevents/',
    ],
    'https://www.w3.org/TR/cssom/': [
      'https://www.w3.org/TR/cssom/',
      'https://drafts.csswg.org/cssom/',
    ],
    'https://www.w3.org/TR/css-variables-1/': [
      'https://www.w3.org/TR/css-variables-1/',
      'https://drafts.csswg.org/css-variables/',
    ],
    'https://www.w3.org/TR/cssom-view': [
      'https://www.w3.org/TR/cssom-view',
      'https://drafts.csswg.org/cssom-view',
    ],
    'http://w3.org/TR/css-fonts/': [
      'http://w3.org/TR/css3-fonts/',
      'https://drafts.csswg.org/css-fonts-3/',
    ],
    'https://drafts.csswg.org/css-conditional/': [
      'conditional',
      'conditional-3',
    ],
    'http://drafts.csswg.org/css-scoping/': [
      'http://drafts.csswg',
      'https://drafts.csswg',
    ],
    'https://www.w3.org/TR/compositing-1/': [
      'https://www.w3.org/TR/compositing-1/',
      'https://drafts.fxtf.org/compositing-1/',
    ],
    'https://www.w3.org/TR/filter-effects/': [
      'https://www.w3.org/TR/filter-effects/',
      'https://drafts.fxtf.org/filter-effects/',
    ],
    'https://www.w3.org/TR/css-masking-1/': [
      'https://www.w3.org/TR/css-masking-1/',
      'https://drafts.fxtf.org/css-masking-1/',
    ],
    'https://drafts.csswg.org/css-timing-1/': ['timing', 'easing'],
    'https://drafts.csswg.org/css-logical-props/': [
      '/css-logical-props/',
      '/css-logical/',
    ],
    'https://tc39.github.io/': ['https://tc39.github.io/', 'https://tc39.es/'],
    'https://www.w3.org/TR/xpath-20/': ['/TR/xpath-20/', '/TR/xpath20/'],
    'https://w3c.github.io/input-events/index.html': [
      '/input-events/index.html',
      '/input-events/',
    ],
    'https://w3c.github.io/webappsec-csp/embedded/': [
      '/webappsec-csp/embedded/',
      '/webappsec-cspee/',
    ],
    'https://wicg.github.io/media-capabilities#': [
      '/media-capabilities#',
      '/media-capabilities/#',
    ],
    'https://w3c.github.io/keyboard-lock#': [
      '/keyboard-lock#',
      '/keyboard-lock/#',
    ],
    'https://dev.w3.org/geo/api/spec-source.html': [
      'https://dev.w3.org/geo/api/spec-source.html',
      'https://w3c.github.io/geolocation-api/',
    ],
    'https://w3c.github.io/dnt/drafts/tracking-dnt.html': [
      'https://w3c.github.io/dnt/drafts/tracking-dnt.html',
      'https://www.w3.org/TR/tracking-dnt/',
    ],
    'https://www.w3.org/TR/css-': [
      'https://www.w3.org/TR/css-',
      'https://drafts.csswg.org/css-',
    ],
  };
  if (url.includes('spec.whatwg.org#')) {
    return url.replace('spec.whatwg.org#', 'spec.whatwg.org/#');
  }
  if (url.includes('/deviceorientation/spec-source-orientation.html')) {
    return url.slice(0, -28);
  }
  if (url.startsWith('https://www.w3.org/TR/css3-background/')) {
    return url.replace(
      'https://www.w3.org/TR/css3-background/',
      'https://drafts.csswg.org/css-backgrounds-3/',
    );
  }
  if (url.startsWith('https://www.w3.org/TR/css3-mediaqueries/')) {
    return url.replace(
      'https://www.w3.org/TR/css3-mediaqueries/',
      'https://drafts.csswg.org/mediaqueries-3/',
    );
  }
  if (url.startsWith('https://www.w3.org/TR/css3-selectors/')) {
    return url.replace(
      'https://www.w3.org/TR/css3-selectors/',
      'https://drafts.csswg.org/selectors-3/',
    );
  }
  if (url.startsWith('https://www.w3.org/TR/css3-')) {
    return url.replace(
      /https:\/\/www.w3.org\/TR\/css3-([^/]+)\//,
      'https://drafts.csswg.org/css-$1-3/',
    );
  }
  if (url.startsWith('https://www.w3.org/TR/selectors')) {
    return url.replace(
      /https:\/\/www.w3.org\/TR\/selectors(-)?4\//,
      'https://drafts.csswg.org/selectors-4/',
    );
  }
  if (url.includes('://www.ecma-international.org/ecma-262/')) {
    return url.replace(
      /http(s)?:\/\/www.ecma-international.org\/ecma-262\/[568]\.[01]\/(index.html)?/,
      'https://tc39.es/ecma262/',
    );
  }
  for (var specBaseURL in urlAdjustmentMap) {
    if (url.startsWith(specBaseURL)) {
      var target, replacement;
      [target, replacement] = urlAdjustmentMap[specBaseURL];
      return url.replace(target, replacement);
    }
  }
  return url;
};

const isBrokenSpecURL = (url, parsedURL, SPECURLS) => {
  if (url.startsWith('https://html.spec.whatwg.org/multipage/')) {
    url = 'https://html.spec.whatwg.org/' + parsedURL.hash;
  }
  if (url.startsWith('https://html.spec.whatwg.org/dev/')) {
    url = 'https://html.spec.whatwg.org/' + parsedURL.hash;
  }
  if (url.startsWith('https://tools.ietf.org/html/rfc7168')) {
    // "I'm a teapot" RFC; ignore
    return false;
  }
  return !SPECURLS.includes(url);
};

module.exports = { isObsolete, getAdjustedSpecURL, isBrokenSpecURL };
