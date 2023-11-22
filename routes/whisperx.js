const express = require("express");
const aws = require('aws-sdk');
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
require("dotenv").config();

const router = express.Router();

router.post('/', (req, res) => {
    function extractNameFromUrl(url) {
        const urlParts = url.split('/');
    
        let name = urlParts[urlParts.length - 1];
        if (name.includes('.')) {
          name = name.slice(0, name.lastIndexOf('.'));
        }
        return name;
      }
        let url = req.body.url;
        let filename = extractNameFromUrl(url);
        const outputDirectory = 'output'; 

    shell.exec(`whisperx ${url} --language=English --output_format=json --output_format=json --compute_type int8 --output_dir=output/${filename}`, function(code, output) {
        console.log('Exit code:', code);
        console.log('Program output:', output);

        if (code === 0) {
            // The command executed successfully, read the JSON file from the custom output directory
            const jsonFilePath = path.join(outputDirectory, `${filename}/${filename}.json`); // Update with the actual file name
            fs.readFile(jsonFilePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading JSON file:', err);
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    // Parse the JSON content
                    console.log("Subtitles Generated")
                    const jsonData = JSON.parse(data);
                    res.json(jsonData); // Send the JSON data as the response
                }
            });
        } else {
            res.status(500).json({ error: 'Command execution failed' });
        }
    });
});

module.exports = router;
