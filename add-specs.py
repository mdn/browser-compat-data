#!/usr/bin/env python2
import certifi
import io
import json
import os.path
import sys
import time
import urllib3
from collections import OrderedDict
from lxml.html import parse
from termcolor import cprint
from urlparse import urlparse


def alarm(message):
    cprint('Alarm: %s' % message, 'red', attrs=['bold'])


def getAdjustedSpecURL(url):
    if url.startswith('http://drafts.csswg.org/css-scoping/'):
        return url.replace('http://drafts.csswg', 'https://drafts.csswg')
    if url.startswith('https://drafts.csswg.org/css-logical-props/'):
        return url.replace('/css-logical-props/', '/css-logical/')
    if url.startswith('https://www.w3.org/TR/xpath-20/'):
        return url.replace('/TR/xpath-20/', '/TR/xpath20/')
    if url.startswith('https://w3c.github.io/input-events/index.html'):
        return url.replace('/input-events/index.html', '/input-events/')
    if url.startswith('https://w3c.github.io/webappsec-csp/embedded/'):
        return url.replace('/webappsec-csp/embedded/', '/webappsec-cspee/')
    if url.startswith('https://wicg.github.io/media-capabilities#'):
        return url.replace('/media-capabilities#', '/media-capabilities/#')
    if url.startswith('https://w3c.github.io/keyboard-lock#'):
        return url.replace('/keyboard-lock#', '/keyboard-lock/#')
    if url.startswith('https://dev.w3.org/geo/api/spec-source.html'):
        return url.replace('https://dev.w3.org/geo/api/spec-source.html',
                           'https://www.w3.org/TR/geolocation-API/')
    if '/deviceorientation/spec-source-orientation.html' in url:
        return url.replace('spec-source-orientation.html', '')
    if 'spec.whatwg.org#' in url:
        return url.replace('spec.whatwg.org#', 'spec.whatwg.org/#')
    return url


def isObsolete(url):
    if url.startswith('https://www.w3.org/TR/REC-DOM-Level-1/'):
        return True
    if url.startswith('https://www.w3.org/TR/DOM-Level-2-'):
        return True
    if url.startswith('https://www.w3.org/TR/DOM-Level-3-Core/'):
        return True
    if url.startswith('https://www.w3.org/TR/ElementTraversal/'):
        return True
    if url.startswith('https://www.w3.org/TR/selectors-api/'):
        return True
    if url.startswith('https://dev.w3.org/2006/webapi/selectors-api2'):
        return True
    if url.startswith('https://w3c.github.io/webcomponents/spec/shadow/'):
        return True
    if url.startswith('https://w3c.github.io/staticrange/'):
        return True
    if url.startswith('https://www.w3.org/TR/dom/'):
        return True
    if url.startswith('https://w3c.github.io/microdata/'):
        return True
    if url.startswith('https://www.w3.org/TR/html5'):
        return True
    if url.startswith('https://www.ecma-international.org/'):
        return True
    if url.startswith('https://www.w3.org/TR/CSS1/'):
        return True
    if 'html401' in url:
        return True
    if 'developer.apple.com/library/safari' in url:
        return True
    if 'https://www.w3.org/TR/2014/WD-DOM-Level-3-Events-20140925/' in url:
        return True
    return False


def getSpecURLsArray(mdn_url, sectionname, http):
    url = 'https://developer.mozilla.org' + urlparse(mdn_url).path + \
        '?raw&macros&section=' + sectionname
    print 'Trying %s' % url
    response = http.request('GET', url)
    if response.status == 404:
        return []
    if response.status > 499:
        sys.stderr.write('50x for %s. Will retry after 60s...\n' % url)
        time.sleep(61)
        print 'Retrying %s' % url
        response = http.request('GET', url)
        if response.status == 404:
            return []
        if response.status > 499:
            sys.stderr.write('50x for %s. Giving up.\n' % url)
            return []
    html = response.data.decode('utf-8')
    if html == '':
        return []
    try:
        doc = parse(io.StringIO(unicode(html)))
        rows = doc.xpath('//table[1]//tr[td]')
        if not(rows):
            return []
        spec_urls = []
        has_spec_url = False
        for row in rows:
            hrefs = row.xpath('td[1]//a/@href')
            if not(hrefs):
                continue
            spec_url = hrefs[0].strip()
            if isObsolete(spec_url):
                continue
            if not(urlparse(spec_url).fragment):
                alarm(mdn_url + ' has spec URL with no fragment: ' + spec_url)
                continue
            if not(urlparse(spec_url).hostname):
                alarm(mdn_url + ' has spec URL with no hostname: ' + spec_url)
                continue
            if has_spec_url:
                cprint('Note:  ' + mdn_url + ' has multiple spec URLs', 'cyan')
            spec_url = getAdjustedSpecURL(spec_url)
            cprint('Adding %s' % (spec_url), 'green')
            spec_urls.append(spec_url)
            has_spec_url = True
        return spec_urls
    except Exception, e:
        sys.stderr.write('Something went wrong: %s\n' % str(e))
        return []


def walkL1Data(l2data, filename, http, l2name, l1name, bcd_data):
    for l3name in l2data:
        l3data = l2data[l3name]
        path = '%s.%s.%s' % (l1name, l2name, l3name)
        bcd_data[l1name][l2name][l3name] = \
            processTarget(l3data, filename, http, path)
        for l4name in l3data:
            l4data = l3data[l4name]
            path = '%s.%s.%s.%s' % (l1name, l2name, l3name, l4name)
            bcd_data[l1name][l2name][l3name][l4name] = \
                processTarget(l4data, filename, http, path)
            if not isinstance(l4data, dict):
                continue
            for l5name in l4data:
                l5data = l4data[l5name]
                path = '%s.%s.%s.%s.%s' % \
                    (l1name, l2name, l3name, l4name, l5name)
                bcd_data[l1name][l2name][l3name][l4name][l5name] = \
                    processTarget(l5data, filename, http, path)


def processTarget(target, filename, http, path):
    try:
        if not('__compat' in target):
            return target
        target_data = target['__compat']
        if not('mdn_url' in target_data):
            if '_' not in path:
                alarm('%s in %s has no mdn_url' % (path, filename))
            return target
        if 'spec_url' in target_data:
            if not(len(sys.argv) > 2 and sys.argv[2] == 'fullupdate'):
                return target
            else:
                del target['__compat']['spec_url']
        mdn_url = target_data['mdn_url']
        if urlparse(mdn_url).fragment:
            return target
        spec_urls = getSpecURLsArray(mdn_url, 'Specifications', http)
        if not(spec_urls):
            spec_urls = getSpecURLsArray(mdn_url, 'Specification', http)
        if not(spec_urls):
            cprint('Note:  ' + mdn_url + ' has no spec URL', 'yellow')
            return target
        if len(spec_urls) == 1:
            spec_urls = spec_urls[0]
        updated_data = OrderedDict()
        for key, value in target['__compat'].items():
            if key == 'mdn_url':
                updated_data['mdn_url'] = value
                updated_data['spec_url'] = spec_urls
            else:
                updated_data[key] = value
        target['__compat'] = updated_data
    except TypeError:
        pass
    return target


def main():
    http = urllib3.PoolManager(cert_reqs='CERT_REQUIRED',
                               ca_certs=certifi.where())
    if len(sys.argv) < 2:
        sys.stderr.write('\nError: You must specify a comma-separated' +
                         ' (no spaces) list of directory names. Example:\n\n')
        sys.stderr.write(sys.argv[0] + ' api,css,html,http,javascript,mathml,' +
                         'svg,webdriver,xpath,xslt')
        exit(1)
    dirnames = sys.argv[1].split(',')
    for dirname in dirnames:
        if dirname.strip() == '':
            continue
        files = [os.path.join(dirpath, filename)
                 for (dirpath, dirs, files)
                 in os.walk(dirname)
                 for filename in (dirs + files)]
        files.sort()
        for filename in files:
            if os.path.splitext(filename)[1] != '.json':
                continue
            f = io.open(filename, 'r+', encoding='utf-8')
            bcd_data = json.load(f, object_pairs_hook=OrderedDict)
            for l1name in bcd_data:
                for l2name in bcd_data[l1name]:
                    l2data = bcd_data[l1name][l2name]
                    path = '%s.%s' % (l1name, l2name)
                    bcd_data[l1name][l2name] = \
                        processTarget(l2data, filename, http, path)
                    if l2data:
                        walkL1Data(l2data, filename, http, l2name, l1name,
                                   bcd_data)
            f.seek(0)
            f.write(unicode(json.dumps(bcd_data, indent=2,
                                       separators=(',', ': '),
                                       ensure_ascii=False) + '\n'))
            f.truncate()
            f.close()


main()
