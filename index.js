#!/usr/bin/env node

// index.js

const { Command } = require('commander');
const { fetchSchemaList, promptForEntities, fetchMatchingFiles } = require('./github');
const { promptDestinationPath, saveFiles } = require('./fileutil');

var pjson = require('./package.json');

require('dotenv').config();

const SCHEMALIST = 'schemaList.json';

const program = new Command();

program
    .version(`${pjson.version}`)
    .description('Fetch relevant files from onst-onst GitHub repository');

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
    .description('Fetch schema files from the onst-onst GitHub repository')
    .action(async () => {

        const { owner, repo, path } = initialize();

        fetchSchemaList(owner, repo, SCHEMALIST)
            .then(schemaList => promptForEntities(schemaList))
            .then(async answers => {
                const selectedEntities = answers.entities;
                console.log('Selected entities:', selectedEntities);


                const destinationPath = await promptDestinationPath();

                for (const prefix of selectedEntities) {
                    const matchingFiles = await fetchMatchingFiles(owner, repo, path, prefix);
                    console.log(`Files matching ${prefix}:`, matchingFiles.map(file => file.name));

                    await saveFiles(matchingFiles, destinationPath);
                }

            })
            .catch(error => {
                console.error(error.message);
            });
    });

program
    .command('s')
    .description('Show schema list in the onst-onst GitHub repository')
    .action(() => {
        const { owner, repo, path } = initialize();

        fetchSchemaList(owner, repo, SCHEMALIST)
            .then(schemaList => {
                console.log(schemaList.flatMap(entity => Object.keys(entity)));
            })
    })

program.parse(process.argv);

function initialize() {

    // Load environment variables
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const path = process.env.GITHUB_PATH;

    if (!owner || !repo || !path) {
        console.error('GitHub owner, repo, or path is not specified in the .env file.');
        //create new env file
        const fs = require('fs');
        const path = require('path');

        const envFilePath = path.join(__dirname, '.env');

        // Check if .env file exists
        if (!fs.existsSync(envFilePath)) {
            // Create .env file with default values
            const defaultEnvContent = `
GITHUB_OWNER=rajatasusual
GITHUB_REPO=onst-onst
GITHUB_PATH=schema
`;

            fs.writeFileSync(envFilePath, defaultEnvContent);

            console.log('.env file created with default values.');

            return { owner: 'rajatasusual', repo: 'onst-onst', path: 'schema' };
        }

    }

    return { owner, repo, path };
}
