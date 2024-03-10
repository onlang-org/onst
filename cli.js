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
    .option('-s, --schemastore', 'use Schemastore.org (default is false)')
    .description('Fetch schema files from the onst GitHub repository or Schemastore')
    .action(async (options) => {
        fetchSchemata(options.schemastore);
    });

program
    .command('show')
    .option('-s, --schemastore', 'use Schemastore.org (default is false)')
    .description('Show schema list in the onst GitHub repository')
    .action((options) => {
        showSchemata(options.schemastore);
    })

program
    .command('example')
    .option('-w, --write', 'write generated ONL files to the specified path')
    .option('-s, --schemastore', 'use Schemastore.org (default is false)')
    .option('-r, --random', 'use random values for optional properties')
    .option('-e, --example', 'use example values for required properties')
    .option('-f, --file <path>', 'file name of the generated ONL will be saved')
    .option('-d, --destination <path>', 'destination path where the generated ONL will be saved')
    .description('generate ONL from schema')
    .action((options) => {
        generateExampleONL({
            write: options.write, 
            random: options.random, 
            example: options.example, 
            file: options.file, 
            destination: options.destination,
            schemastore: options.schemastore
        });
    })

program.parse(process.argv);