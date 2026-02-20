import { spawnSync } from 'node:child_process';

/** @import {SpawnSyncOptionsWithStringEncoding} from 'node:child_process' */

/**
 * Execute a command
 * @param {string} command The command to execute
 * @param {readonly string[]} args The arguments to pass
 * @param {Omit<SpawnSyncOptionsWithStringEncoding, 'encoding' | 'shell'>} [opts] The options to pass to spawnSync
 * @returns {string} The output from the command
 */
export default (command, args, opts) => {
  const result = spawnSync(command, args, {
    ...opts,
    encoding: 'utf8',
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      `The command '${command}' returned non-zero exit status ${result.status}: ${result.stderr}`,
    );
  }

  return result.stdout?.trim() || '';
};
