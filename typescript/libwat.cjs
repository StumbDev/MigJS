const VoilaLang = require('voilascript/lib/lib');
const chalk = require('chalk');

function Runner() {
    console.log(chalk.bold('MigJS Runner ${ver}'))
    var ver = "0.0.1-2";
    var gulpfile = "../gulpfile.js";
    const voila = new VoilaLang();
    const code = "./runner.voi";
    voila.execute(code);
}
const {
    program
} = require("commander");
const program = new Command();

program
    .name('MigJS Runner')
    .description('The MigJS library runner')
    .version('0.0.1-2')
program.command("init")
    .description('Initialize a new project')
    .action(function() {
        // use shelljs to create project
        function createProject() {
            console.log(chalk.bold("MigJS Init\n"))
            shell.mkdir('project-migjs')
            shell.cd(['project-migjs'])
            shell.touch('main.voi')
            shell.touch('prg.js')
            shell.mkdir('src')
            shell.touch('src/main.wat')
            shell.touch('src/codMain.ts')
            shell.touch('README.md')
            shell.touch('gulpfile.js')
            shell.touch('tsconfig.json')
            shell.touch('.gitignore')
            shell.touch('migconfig.json')
            exec('npm init -y')
            exec('npm i wabt gulp gulp-cli gulp-typescript gulp-uglify gulp-rename del assemblyscript voilascript migjs')
            exec('npx tsc --init')
            shell.echo(` {
    "migCompilerOptions": {
        "voilaMain": "./main.voi",
        "jsMain": "prg.js",
        "tsMain": "codMain.ts",
        "tscompilerJson": "tsconfig.json",
        "packageJson": "package.json"
    }
}
`,
                'migconfig.json')
            shell.echo(chalk.red("Warning! Some configuration and compiler files are empty!"))
            shell.echo(chalk.bold("empty files:\n", "gulpfile.js\n", "asconfig.json\n", ".gitignore\n"))
            shell.echo('Created files:\n')
            shell.ls('.')
            shell.exit(0);
        };
    });
program.command("editormode")
    .description('Bulit-in editor mode')
    .action(function() {
        //
    });

program.parse();