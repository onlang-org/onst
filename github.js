const { Octokit } = require('@octokit/rest');
const inquirer = require('inquirer');
require('dotenv').config();

async function fetchSchemaList(owner, repo, path) {
    const octokit = process.env.GITHUB_TOKEN ? new Octokit({auth: process.env.GITHUB_TOKEN}) : new Octokit({});

    try {
        const response = await octokit.repos.getContent({
            owner,
            repo,
            path,
        });

        const schemaListContent = Buffer.from(response.data.content, 'base64').toString('utf-8');
        return JSON.parse(schemaListContent);
    } catch (error) {
        throw new Error(`Error fetching schema list: ${error.message}`);
    }
}

async function promptForEntities(schemaList) {
    const questions = [
        {
            type: 'checkbox',
            name: 'entities',
            message: 'Select entities to download:',
            choices: schemaList.map(entity => {
                const entityName = Object.keys(entity)[0];
                const entityValue = entity[entityName];
                return {
                    name: entityName,
                    value: entityValue,
                };
            }),
        },
    ];

    const answers = await inquirer.prompt(questions);

    // Save the selected entities to an environment variable
    process.env.SELECTED_ENTITIES = JSON.stringify(answers.entities);

    return answers;
}

async function fetchMatchingFiles(owner, repo, path, prefix) {
    const octokit = new Octokit({});

    try {
        const response = await octokit.repos.getContent({
            owner,
            repo,
            path,
        });

        // Filter files with the specified prefix
        const matchingFiles = response.data
            .filter(file => {
                const regex = new RegExp("^" + prefix);

                return file.type === 'file' && file.name.match(regex);
            })
            .map(file => ({
                name: file.name,
                download_url: file.download_url,
            }));

        return matchingFiles;
    } catch (error) {
        throw new Error(`Error fetching matching files: ${error.message}`);
    }
}

module.exports = {
    fetchSchemaList,
    promptForEntities,
    fetchMatchingFiles
};