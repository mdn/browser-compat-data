import {
  execSync,
  ExecSyncOptionsWithStringEncoding,
} from 'node:child_process';

/**
 * Execute a command
 * @param command The command to execute
 * @param opts The options to pass to execSync
 * @returns The output from the command
 */
export default (
  command: string,
  opts?: Omit<ExecSyncOptionsWithStringEncoding, 'encoding'>,
): string => execSync(command, { encoding: 'utf8', ...opts }).trim();
