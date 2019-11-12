const path = require('path');
const fs = require('fs');
const SVGO = require('svgo');

const util = require('util');

const readdir = util.promisify(fs.readdir);
const readfile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);


const svgo = new SVGO({
    plugins: [{
        cleanupAttrs: true,
    }, {
        removeDoctype: true,
    }, {
        removeXMLProcInst: true,
    }, {
        removeComments: true,
    }, {
        removeMetadata: true,
    }, {
        removeTitle: true,
    }, {
        removeDesc: true,
    }, {
        removeUselessDefs: true,
    }, {
        removeEditorsNSData: true,
    }, {
        removeEmptyAttrs: true,
    }, {
        removeHiddenElems: true,
    }, {
        removeEmptyText: true,
    }, {
        removeEmptyContainers: true,
    }, {
        removeViewBox: false,
    }, {
        cleanupEnableBackground: true,
    }, {
        convertStyleToAttrs: true,
    }, {
        convertColors: true,
    }, {
        convertPathData: true,
    }, {
        convertTransform: true,
    }, {
        removeUnknownsAndDefaults: true,
    }, {
        removeNonInheritableGroupAttrs: true,
    }, {
        removeUselessStrokeAndFill: true,
    }, {
        removeUnusedNS: true,
    }, {
        cleanupIDs: true,
    }, {
        cleanupNumericValues: true,
    }, {
        moveElemsAttrsToGroup: true,
    }, {
        moveGroupAttrsToElems: true,
    }, {
        collapseGroups: true,
    }, {
        removeRasterImages: false,
    }, {
        mergePaths: true,
    }, {
        convertShapeToPath: true,
    }, {
        sortAttrs: true,
    }, {
        removeDimensions: true,
    }, {
        removeAttrs: {attrs: '(stroke|fill)'},
    }]
});


const directoryPath = path.join(__dirname, 'files');

let fileContent = '';

(async () => {
    try {
        const files = await readdir(directoryPath);
        let fileContent = '';

        for (const fileName of files) {
            const filenameWithoutEnding = fileName.split('.')[0];
            const data = await readfile(path.join(directoryPath, fileName), 'utf-8');
            const svgContent = data.replace(/\r?\n|\r/g, " ");
            const optimizedSvg = await svgo.optimize(svgContent);

            const fileNameUpperCase = filenameWithoutEnding[0].toUpperCase() + filenameWithoutEnding.slice(1);
            fileContent += `export const uxfIcon${fileNameUpperCase} = '${optimizedSvg.data}';`;
        }
        await writeFile(path.join(__dirname, 'dist', 'icons.ts'), fileContent);
    } catch (error) {
        console.log('Error', error);
    }
})();
