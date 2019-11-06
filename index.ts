const path = require('path');
const fs = require('fs');

const directoryPath = path.join(__dirname, 'files');

fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    files.forEach(function (fileName) {
        const filenameWithoutEnding = fileName.split('.')[0];
        console.log(fileName);

        fs.readFile(path.join(directoryPath, fileName), 'utf-8', function (err, data) {
            if (err) throw err;

            const svgContent = data.replace(/\r?\n|\r/g, " ");
            const outPath = path.join(__dirname, 'out');

            const content = `const ${filenameWithoutEnding} = '${svgContent}';`;
            fs.writeFile(path.join(outPath, filenameWithoutEnding) + '.js', content, function (err) {
                console.log('Done');
            });
        });
    });
});
