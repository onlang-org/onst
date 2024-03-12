const { fetchSchemaList, promptForEntities, fetchMatchingFiles } = require('./github');
const { promptDestinationPath, saveFile, saveFilesFromURL, getFileContent } = require('./fileutil');
const { JSONSchemaFaker } = require('json-schema-faker');
const YAML = require('json-to-pretty-yaml');

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

        const answers = await fetchSchemaList(owner, repo, SCHEMALIST)
            .then(schemaList => promptForEntities(schemaList));

        const selectedEntities = answers.entities;
        console.log('Selected entities:', selectedEntities);

        for (const prefix of selectedEntities) {
            const matchingFiles = await fetchMatchingFiles(owner, repo, path, prefix);
            await promptForEntities(matchingFiles.map(file => {
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
    }


}

function initialize() {

    // Load environment variables

    if (!process.env.GITHUB_OWNER || !process.env.GITHUB_REPO || !process.env.GITHUB_PATH) {
        console.error('GitHub owner, repo, or path is not specified in the .env file.');
        //create new env file
        const fs = require('fs');
        const path = require('path');

        const envFilePath = path.join(__dirname, '.env');

        // Check if .env file exists
        if (!fs.existsSync(envFilePath)) {
            // Create .env file with default values
            const defaultEnvContent = `GITHUB_OWNER=${Environment.GITHUB_OWNER}
GITHUB_REPO=${Environment.GITHUB_REPO}
GITHUB_PATH=${Environment.GITHUB_PATH}`;

            fs.writeFileSync(envFilePath, defaultEnvContent);

        } else {
            // append .env file with default values
            if (!process.env.GITHUB_OWNER) {
                fs.writeFileSync(envFilePath, `\nGITHUB_OWNER=${Environment.GITHUB_OWNER}`, { flag: 'a' });
            }
            if (!process.env.GITHUB_REPO) {
                fs.writeFileSync(envFilePath, `\nGITHUB_REPO=${Environment.GITHUB_REPO}`, { flag: 'a' });
            }
            if (!process.env.GITHUB_PATH) {
                fs.writeFileSync(envFilePath, `\nGITHUB_PATH=${Environment.GITHUB_PATH}`, { flag: 'a' });
            }
        }

        console.log('.env file created with default values.');
    }

    require('dotenv').config();

    return { owner: process.env.GITHUB_OWNER, repo: process.env.GITHUB_REPO, path: process.env.GITHUB_PATH };
}

const FileType = {
    SCHEMA: 'json',
    ONLANG: 'onl'
}

const Environment = {
    GITHUB_OWNER: 'onlang-org',
    GITHUB_REPO: 'onst',
    GITHUB_PATH: 'schema'
}


module.exports = {
    fetchSchemata,
    showSchemata,
    fetchSchemaStoreSchemata,
    generateExampleONL,
    FileType,
    Environment
}