#!/usr/bin/env node

const { Command } = require('commander');
var pjson = require('./package.json');
const { fetchSchemata, showSchemata, generateExampleONL } = require('./main');

const program = new Command();

program
    .version(`${pjson.version}`)
    .description('Work with schemata from onst GitHub repository for ONLang');

program
    .command('help')
    .description('Show help')
    .action(() => program.help());

program
    .command('version')
    .description('Show version')
    .action(() => console.log(program.version()));

program
    .command('fetch')
    .option('-s, --schemastore', 'save generated ONL files to the specified path')
    .description('Fetch schema files from the onst GitHub repository or Schemastore')
    .action(async (options) => {
        fetchSchemata(options.schemastore);
    });

program
    .command('show')
    .option('-s, --schemastore', 'save generated ONL files to the specified path')
    .description('Show schema list in the onst GitHub repository')
    .action((options) => {
        showSchemata(options.schemastore);
    })

program
    .command('example')
    .option('-s, --save', 'save generated ONL files to the specified path')
    .option('-f, --fake', 'use fake values for optional properties')
    .option('-e, --example', 'use example values for required properties')
    .option('-n, --file <path>', 'file name of the generated ONL will be saved')
    .option('-d, --destination <path>', 'destination path where the generated ONL will be saved')
    .description('generate ONL from schema')
    .action((options) => {
        generateExampleONL(options.save, options.fake, options.example, options.file, options.destination);
    })

program.parse(process.argv);