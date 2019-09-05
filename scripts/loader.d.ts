/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */
import { CompatData } from '../types';

/**
 * Recursively load one or more directories passed as arguments.
 */
declare function load(files: string[]): CompatData;
declare function load(...files: string[]): CompatData;
export = load;
