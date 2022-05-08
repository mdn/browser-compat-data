/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/// <reference path="./types.d.ts"/>
import { CompatData } from './types';

// This is necessary to have intellisense in projects which
// import data from this package.
declare const compatData: CompatData;
export = compatData;
