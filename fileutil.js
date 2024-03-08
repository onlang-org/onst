const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');

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

async function saveFilesFromURL(matchingFiles, destinationPath) {
    // Create destination directory if it doesn't exist
    fs.mkdirSync(destinationPath, { recursive: true });

    for (const file of matchingFiles) {
        const decodedContent = await getFileContent(file.download_url);
        await saveFile(decodedContent, file.name, destinationPath);
    }
}

async function saveFile(decodedContent, fileName, destinationPath) {
    const filePath = `${destinationPath}/${fileName}`;
    console.log(`Saving ${fileName} to ${filePath}`);

    fs.mkdirSync(destinationPath, { recursive: true });

    try {
        fs.writeFileSync(path.resolve(filePath), decodedContent, { encoding: 'utf8', flag:'a+' });

        console.log(`${fileName} saved successfully.`);
    } catch (error) {
        console.error(`Error saving ${fileName}: ${error.message}`);
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
    saveFilesFromURL,
    getFileContent,
    saveFile
}