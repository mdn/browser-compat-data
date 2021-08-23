import { execSync } from 'node:child_process';
import chalk from 'chalk';

const testFormat = () => {
  try {
    execSync('npx prettier --list-different "**/*.js" "**/*.ts" "**/*.md"');
  } catch (err) {
    let errorText = err.stdout.toString();
    console.error(chalk`{red   Prettier – formatting errors:}`);
    console.error(chalk`{red.bold → ${errorText}}`);
    console.error(
      chalk`{blue Tip: Run {bold npm run fix} to fix formatting automatically}`,
    );

    return true;
  }

  return false;
};

export default testFormat;
