const express = require("express");
const aws = require('aws-sdk');
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
require("dotenv").config();

const router = express.Router();

router.post('/', (req, res) => {
    shell.exec(`backgroundremover -i "./brollimages/broll14.jpeg" -o "./bgremoveoutput/broll14.png"`, function(code, output) {
        console.log('Exit code:', code);
        console.log('Program output:', output);
        if (code === 0) {
            res.send("Removed Background ")
        } else {
            res.status(500).json({ error: 'Command execution failed' });
        }
    });
});

module.exports = router;
