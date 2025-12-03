import {
  spawnSync,
  SpawnSyncOptionsWithStringEncoding,
} from 'node:child_process';

/**
 * Execute a command
 * @param command The command to execute
 * @param args The arguments to pass
 * @param opts The options to pass to spawnSync
 * @returns The output from the command
 */
export default (
  command: string,
  args: readonly string[],
  opts?: Omit<SpawnSyncOptionsWithStringEncoding, 'encoding' | 'shell'>,
): string => {
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
