#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';

const { exec } = require('child_process');

exec('node scripts/fix-feature-order.js');
