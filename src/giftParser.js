const fs = require('fs');
const path = require('path');
const Parser = require("gift-parser-ide").default;

const folderPath = "../files/";

let parse = new Parser();
let jsonParse = () => {
    let quiz = null;
    if (!fs.existsSync('../jsonResult')) {
        fs.mkdirSync('../jsonResult');
    }

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error("Erreur lors de la lecture du dossier :", err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(folderPath, file);

            fs.readFile(filePath, 'utf8', (err, fileContent) => {
                if (err) {
                    console.error('Erreur lors de la lecture du fichier :', err);
                    return;
                }

                parse.update(fileContent);
                quiz = parse.result();

                fs.writeFile(`../jsonResult/${file}.json`, JSON.stringify(quiz, null, 2), (err) => {
                    if (err) throw err;
                });
            });
        });
    });
}

let correctFile = async () => {
    try {
        const files = fs.readdirSync(folderPath);

        for (const file of files) {
            const filePath = path.join(folderPath, file);

            const fileContent = await fs.promises.readFile(filePath, 'utf8');

            // Faire un regex pour remplacer les ~= par =
            const correctedContent = fileContent.replace(/~=/g, "=");

            await fs.promises.writeFile(filePath, correctedContent);
        }
    } catch (err) {
        console.error('Erreur lors de la lecture ou de la correction des fichiers :', err);
        throw err;
    }
}

// Wrap the function calls in an async function to use await
const parser = async () => {
    try {
        await correctFile();
        await jsonParse();
    } catch (err) {
        console.error('Erreur dans le processus principal :', err);
    }
};


module.exports = { jsonParse, correctFile, parser};
