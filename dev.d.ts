/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { CompatData } from './types';

export default CompatData;

export type InternalSupportStatement = SupportStatement | 'mirror';

// External Module Declarations

// XXX Remove once https://github.com/tschaub/es-main/pull/10 merged
declare module 'es-main';
