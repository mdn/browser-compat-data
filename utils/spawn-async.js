import { spawn } from 'node:child_process';

/**
 * @typedef {import('node:child_process').SpawnOptions} SpawnOptions
 */

/**
 * Execute a command
 * @param {string} command The command to execute
 * @param {readonly string[]} args The arguments to pass
 * @param {Omit<SpawnOptions, 'shell'>} [opts] The options to pass to spawnSync
 * @returns {Promise<string>} The output from the command
 */
export default async (command, args, opts) =>
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
