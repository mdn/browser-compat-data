import { exec } from 'node:child_process';
import { promisify } from 'node:util';

/**
 * Executes a command asynchronously.
 * @param command The command to execute asynchronously.
 * @returns The output of the command.
 */
export default async (command: string): Promise<string> => {
  const result = await promisify(exec)(command, { encoding: 'utf-8' });

  return result.stdout.trim();
};
