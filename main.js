const { fetchSchemaList, promptForEntities, fetchMatchingFiles } = require('./github');
const { promptDestinationPath, saveFile, saveFilesFromURL, getFileContent } = require('./fileutil');
const { JSONSchemaFaker } = require('json-schema-faker');
const YAML = require('json-to-pretty-yaml');

require('dotenv').config();

const SCHEMALIST = 'schemaList.json';


const fetchSchemata = async (schemastore) => {

    const destinationPath = await promptDestinationPath();

    if (schemastore) {
        await fetchSchemaStoreSchemata()
            .then(async result => {
                const schemata = result.schemas.flatMap(schema => {
                    return JSON.parse(`{ "${schema['name']}": "${schema['url']}" }`);
                });

                const answers = await promptForEntities(schemata);

                console.log('Selected entities:', answers.entities);
                const files = answers.entities.map(url => {
                    return JSON.parse(`{ "name":"${url.split('/').pop()}", "download_url": "${url}" }`);
                })
                saveFilesFromURL(files, destinationPath).then(() => {
                    console.log('Schemata downloaded successfully');
                    process.exit(0);
                });

            })


    } else {

        const { owner, repo, path } = initialize();

        await fetchSchemaList(owner, repo, SCHEMALIST)
            .then(schemaList => promptForEntities(schemaList))
            .then(async answers => {
                const selectedEntities = answers.entities;
                console.log('Selected entities:', selectedEntities);

                for (const prefix of selectedEntities) {
                    const matchingFiles = await fetchMatchingFiles(owner, repo, path, prefix);
                    console.log(`Files matching ${prefix}:`, matchingFiles.map(file => file.name));

                    await saveFilesFromURL(matchingFiles, destinationPath);
                }

            })
            .catch(error => {
                console.error(error.message);
            });

    }

};

const fetchSchemaStoreSchemata = () => {
    const onstSchemaStore = require('@onlang-org/onst-schemastore');
    return onstSchemaStore.fetchSchemaFromSchemaStore();
}

const showSchemata = async (schemastore) => {

    if (schemastore) {
        const result = await fetchSchemaStoreSchemata();

        console.log(result.schemas.flatMap(entity => entity['name']));

    } else {
        const { owner, repo } = initialize();

        fetchSchemaList(owner, repo, SCHEMALIST)
            .then(schemaList => {
                console.log(schemaList.flatMap(entity => Object.keys(entity)));
            })
    }

}

const createExamples = async (fileLinks, options) => {
    for (const link of fileLinks) {
        try {
            const schema = await getFileContent(link);
            const onlExample = YAML.stringify(JSONSchemaFaker.generate(JSON.parse(schema), { useExampleValue: options.example ? true : false, alwaysFakeOptionals: options.random ? true : false }));
            if (options.write) {
                await saveFile(onlExample, options.file ? options.file : link.split("/").pop().replace(".json", ".onl"), options.destination);
            }
            else
                console.log(onlExample);
        } catch (error) {
            console.log(`Error creating example for ${link}`);
            console.error(error.message);
        }
    }

};

const generateExampleONL = async (options) => {

    if (options.write && !options.destination) {
        options['destination'] = await promptDestinationPath();
    }

    if (options.schemastore) {
        const storeSchemas = await fetchSchemaStoreSchemata();

        const result = storeSchemas.schemas.flatMap(schema => {
            return JSON.parse(`{ "${schema['name']}": "${schema['url']}" }`);
        });

        await promptForEntities(result).then(async answer => {
            const fileLinks = answer.entities;

            await createExamples(fileLinks, options).then(() => {
                console.log('Examples created successfully');
                process.exit(0);
            })
        });

    } else {
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

                            const onlExample = YAML.stringify(JSONSchemaFaker.generate(JSON.parse(schema), { useExampleValue: options.example ? true : false, alwaysFakeOptionals: options.random ? true : false }));
                            if (options.write) {
                                await saveFile(onlExample, options.file ? options.file : fileLink.split("/").pop().replace(".d.json", ".onl"), options.destination);
                            }
                            else
                                console.log(onlExample);
                        })
                    })
                }

            })
    }


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
    ONLANG: 'onl'
}


module.exports = {
    fetchSchemata,
    showSchemata,
    fetchSchemaStoreSchemata,
    generateExampleONL,
    FileType
}