// file-watcher.js
const fs = require('fs');
const path = require('path');

// Ensure a filename is provided as a command line argument
if (process.argv.length < 3) {
    console.error('Usage: node file-watcher.js <filename>');
    process.exit(1);
}

// Get the filename from the command line arguments
const scriptFileName = process.argv[2];
const scriptFilePath = path.join(__dirname, scriptFileName);

// Function to get the current date and time in YYYY.MM.DD.build_hh.mm.ss format
function getFormattedDateTime() {
    const now = new Date();
    const build = `build_${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}.${String(now.getSeconds()).padStart(2, '0')}`;
    const date = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
    return `${date}.${build}`;
}

// Function to extract the current version from the content
function extractVersion(content) {
    const versionMatch = content.match(/\/\/ @version\s+([\d.]+)/);
    return versionMatch ? versionMatch[1] : null;
}

// Function to update the version and VERSION_BUILD constant
function updateScriptContent(content, newVersion) {
    // Update the version
    let updatedContent = content.replace(/\/\/ @version\s+.*$/m, `// @version      ${newVersion}`);
    // Update the VERSION_BUILD constant
    updatedContent = updatedContent.replace(/const VERSION_BUILD\s*=\s*'.*';/, `const VERSION_BUILD = '${newVersion}';`);
    return updatedContent;
}
// Function to read, update and save the script file
function modifyScriptFile() {
    fs.readFile(scriptFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading the file: ${err}`);
            return;
        }
        const previousVersion = extractVersion(data);
        const newVersion = getFormattedDateTime();
        const updatedContent = updateScriptContent(data, newVersion);
        fs.writeFile(scriptFilePath, updatedContent, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing to the file: ${err}`);
            } else {
                console.log(`Bumped version from ${previousVersion} to ${newVersion}`);
                console.log('File updated successfully!');
            }
        });
    });
}

// Apply the version modification immediately
modifyScriptFile();