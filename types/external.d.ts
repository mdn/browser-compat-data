/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/* eslint no-unused-vars: 0 */

// XXX Remove once https://github.com/tschaub/es-main/pull/10 merged
declare module 'es-main' {
  export default function (meta: ImportMeta): boolean;
  export function stripExt(name: string): string;
}

declare module '@desertnet/html-parser';

declare module 'better-ajv-errors';
