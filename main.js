const { fetchSchemaList, promptForEntities, fetchMatchingFiles } = require('./github');
const { promptDestinationPath, saveFiles } = require('./fileutil');

require('dotenv').config();

const SCHEMALIST = 'schemaList.json';


const fetchSchemata = () => {
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
};

const showSchemata = () => {
    const { owner, repo, path } = initialize();

    fetchSchemaList(owner, repo, SCHEMALIST)
        .then(schemaList => {
            console.log(schemaList.flatMap(entity => Object.keys(entity)));
        })
}

function initialize() {

    // Load environment variables
    let owner = process.env.GITHUB_OWNER;
    let repo = process.env.GITHUB_REPO;
    let folder_path = process.env.GITHUB_PATH;

    if (!owner || !repo || !folder_path) {
        console.error('GitHub owner, repo, or path is not specified in the .env file.');
        //create new env file
        const fs = require('fs');
        const path = require('path');

        const envFilePath = path.join(__dirname, '.env');

        // Check if .env file exists
        if (!fs.existsSync(envFilePath)) {
            // Create .env file with default values
            const defaultEnvContent = `
GITHUB_OWNER=onlang-org
GITHUB_REPO=onst
GITHUB_PATH=schema
`;

            fs.writeFileSync(envFilePath, defaultEnvContent);

            console.log('.env file created with default values.');
            
        } else {
            // append .env file with default values
            if (!owner) {
                owner = 'onlang-org';
                fs.writeFileSync(envFilePath, `GITHUB_OWNER=${owner}\n`, { flag: 'a' });
            }
            if (!repo) {
                repo = 'onst';
                fs.writeFileSync(envFilePath, `GITHUB_REPO=${repo}\n`, { flag: 'a' });
            }
            if (!folder_path) {
                folder_path = 'schema';
                fs.writeFileSync(envFilePath, `GITHUB_PATH=${folder_path}\n`, { flag: 'a' });
            }
        }

    }

    return { owner, repo, path: folder_path };
}


module.exports = {
    fetchSchemata,
    showSchemata
}