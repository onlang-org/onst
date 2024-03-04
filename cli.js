#!/usr/bin/env node

const { Command } = require('commander');
var pjson = require('./package.json');
const { fetchSchemata, showSchemata } = require('./main');

const program = new Command();

program
    .version(`${pjson.version}`)
    .description('Work with schemata from onst GitHub repository for ONLang');

program
    .command('h')
    .description('Show help')
    .action(() => program.help());

program
    .command('v')
    .description('Show version')
    .action(() => console.log(program.version()));

program
    .command('f')
    .description('Fetch schema files from the onst GitHub repository')
    .action(async () => {
        fetchSchemata();
    });

program
    .command('s')
    .description('Show schema list in the onst GitHub repository')
    .action(() => {
        showSchemata();
    })

program.parse(process.argv);