#!/usr/bin / env node

import {
    Command
} from 'commander';
import shell from 'shelljs';
import {
    createRequire
} from 'module'; // To support dynamic import in CommonJS-like environments
import {
    promises as fs
} from 'fs';
import path from 'path';
import gulp from 'gulp';
import del from 'del';

// Dynamic import for Chalk (ES Module)
const chalk = await import('chalk');

// File contents for the init command
const tsConfig = `{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true
  }
}`;

const asConfig = `{
  "options": {
    "bindings": "esm",
    "optimizeLevel": 3
  },
  "entry": "src/main.wat"
}`;

const migConfig = `{
    "migCompilerOptions": {
        "voilaMain": "./main.voi",
        "jsMain": "prg.js",
        "tsMain": "codMain.ts",
        "tscompilerJson": "tsconfig.json",
        "packageJson": "package.json"
    }
}`;

const codMainTs = `export function main() {
  console.log("Hello from TypeScript!");
}`;

const mainWat = `(module
  (func $main (export "main")
    ;; Add your WebAssembly Text Format code here
    ;; This is the entry point
  )
)`;

const mainVoi = `// VoilaLang main function
(fn main() {
  (write("Hello from VoilaLang!"))
})`;

const prgJs = `console.log('Hello from JavaScript');`;

const gulpFile = `const gulp = require('gulp');
const shell = require('shelljs');

gulp.task('build-ts', (done) => {
  shell.exec('tsc');
  done();
});

gulp.task('build-wat', (done) => {
  shell.exec('asc src/main.wat -o build.wasm');
  done();
});

gulp.task('default', gulp.series('build-ts', 'build-wat'));
`;

// Function to initialize project structure
function initializeProject() {
    console.log(chalk.green('Initializing project structure...'));

    // Create necessary directories
    shell.mkdir('-p', 'src');

    // Write files with their contents
    fs.writeFileSync('tsconfig.json', tsConfig);
    fs.writeFileSync('asconfig.json', asConfig);
    fs.writeFileSync('migconfig.json', migConfig);
    fs.writeFileSync(path.join('src', 'codMain.ts'), codMainTs);
    fs.writeFileSync(path.join('src', 'main.wat'), mainWat);
    fs.writeFileSync('main.voi', mainVoi);
    fs.writeFileSync('prg.js', prgJs);
    fs.writeFileSync('gulpfile.js', gulpFile);

    console.log(chalk.green('Project structure created successfully!'));

    // Install project dependencies
    console.log(chalk.cyan('Installing project dependencies...'));

    // Run npm install with required dependencies
    const npmInstallCmd = 'npm install wabt gulp gulp-cli gulp-typescript gulp-uglify gulp-rename del assemblyscript voilascript migjs';
    if (shell.exec(npmInstallCmd).code !== 0) {
        console.error(chalk.red('Error: Failed to install dependencies'));
        shell.exit(1);
    }

    console.log(chalk.green('Dependencies installed successfully!'));
}

// Define tasks
gulp.task('build', (done) => {
    console.log(chalk.green('Building project...'));
    shell.exec('gulp');
    done();
});

gulp.task('clean', (done) => {
    console.log(chalk.yellow('Cleaning project...'));
    shell.rm('-rf', 'dist');
    done();
});

// Define CLI commands using Commander.js
program
    .version('0.0.2-3')
    .description('MigJS CLI');

// Add init command
program
    .command('init')
    .description('Initialize a new MigJS project')
    .action(() => {
        initializeProject();
    });

program
    .command('build')
    .description('Build the project')
    .action(() => {
        gulp.series('build')();
    });

program
    .command('clean')
    .description('Clean the build files')
    .action(() => {
        gulp.series('clean')();
    });

program
    .command('run <script>')
    .description('Run a custom shell command')
    .action((script) => {
        console.log(chalk.cyan(`Running script: ${script}`));
        if (shell.exec(script).code !== 0) {
            console.error(chalk.red('Error: Command failed'));
            shell.exit(1);
        }
    });

program.parse(process.argv);