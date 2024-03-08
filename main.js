const { fetchSchemaList, promptForEntities, fetchMatchingFiles } = require('./github');
const { promptDestinationPath, saveFile, saveFilesFromURL, getFileContent } = require('./fileutil');
const { JSONSchemaFaker } = require('json-schema-faker');
const YAML = require('json-to-pretty-yaml');

require('dotenv').config();

const SCHEMALIST = 'schemaList.json';


const fetchSchemata = async () => {
    const { owner, repo, path } = initialize();

    await fetchSchemaList(owner, repo, SCHEMALIST)
        .then(schemaList => promptForEntities(schemaList))
        .then(async answers => {
            const selectedEntities = answers.entities;
            console.log('Selected entities:', selectedEntities);


            const destinationPath = await promptDestinationPath();

            for (const prefix of selectedEntities) {
                const matchingFiles = await fetchMatchingFiles(owner, repo, path, prefix);
                console.log(`Files matching ${prefix}:`, matchingFiles.map(file => file.name));

                await saveFilesFromURL(matchingFiles, destinationPath);
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


const generateExampleONL = async (save, example, fake, fileName, destination) => {
    const { owner, repo, path } = initialize();

    await fetchSchemaList(owner, repo, SCHEMALIST)
        .then(schemaList => promptForEntities(schemaList))
        .then(async answers => {
            const selectedEntities = answers.entities;
            console.log('Selected entities:', selectedEntities);

            for (const prefix of selectedEntities) {
                const matchingFiles = await fetchMatchingFiles(owner, repo, path, prefix);
                promptForEntities(matchingFiles.map(file => {
                    const name = file.name;
                    return JSON.parse(`{ "${name.replace(/\./g, '_')}": "${file.download_url}" }`);
                })).then(async answers => {
                    const fileLinks = answers.entities;

                    fileLinks.forEach(async fileLink => {
                        const schema = await getFileContent(fileLink);

                        const onlExample = YAML.stringify(JSONSchemaFaker.generate(JSON.parse(schema), { useExampleValue: example ? true : false, alwaysFakeOptionals: fake ? true : false }));
                        if (save) {
                            const destinationPath = destination ? destination : await promptDestinationPath();
                            await saveFile(onlExample, fileName ? fileName : fileLink.split("/").pop().replace(".d.json", ".onl"), destinationPath);
                        }
                        else
                            console.log(onlExample);
                    })
                })
            }

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

        console.log('.env file created with default values.');
    }

    return { owner, repo, path: folder_path };
}

const FileType = {
    SCHEMA: 'json',
    QUALTRICS: 'onl'
}


module.exports = {
    fetchSchemata,
    showSchemata,
    generateExampleONL,
    FileType
}