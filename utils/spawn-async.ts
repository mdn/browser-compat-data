import { spawn, SpawnOptions } from 'node:child_process';

/**
 * Execute a command
 * @param command The command to execute
 * @param args The arguments to pass
 * @param opts The options to pass to spawnSync
 * @returns The output from the command
 */
export default async (
  command: string,
  args: readonly string[],
  opts?: Omit<SpawnOptions, 'shell'>,
): Promise<string> =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { ...opts, shell: false });

    let stdout = '';
    let stderr = '';

    if (child.stdout) {
      child.stdout.setEncoding('utf8');
      child.stdout.on('data', (chunk) => {
        stdout += chunk;
      });
    }

    if (child.stderr) {
      child.stderr.setEncoding('utf8');
      child.stderr.on('data', (chunk) => {
        stderr += chunk;
      });
    }

    child.on('error', (err) => reject(err));

    child.on('close', (code) =>
      code == 0
        ? resolve(stdout.trim())
        : reject(
            new Error(
              `The command '${command}' exited with code ${code}: ${stderr.trim()}`,
            ),
          ),
    );
  });
