const fs = require('fs');
const inquirer = require('inquirer');

async function promptDestinationPath() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'destinationPath',
            message: 'Enter the destination path:',
            default: './', // Set a default value or leave it empty based on your preference
        },
    ]);

    return answers.destinationPath;
}

async function saveFiles(matchingFiles, destinationPath) {
    // Create destination directory if it doesn't exist
    fs.mkdirSync(destinationPath, { recursive: true });

    for (const file of matchingFiles) {
        const fileName = file.name;
        const filePath = `${destinationPath}/${fileName}`;
        console.log(`Saving ${fileName} to ${filePath}`);

        try {
            const decodedContent = await getFileContent(file.download_url);
            fs.writeFileSync(filePath, decodedContent);

            console.log(`${fileName} saved successfully.`);
        } catch (error) {
            console.error(`Error saving ${file}: ${error.message}`);
        }
    }
}

async function getFileContent(download_url) {
    try {
        const fileContent = await fetch(download_url, {
            method: 'GET',
        }
        );

        return fileContent.text();
    }
    catch (error) {
        throw new Error(`Error fetching file content: ${error.message}`);
    }
}

module.exports = {
    promptDestinationPath,
    saveFiles
}