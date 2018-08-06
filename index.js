#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const argv = process.argv;

let childProcess;

function run() {
  if (childProcess) {
    childProcess.kill();
  }
  childProcess = spawn('node', [path.resolve(__dirname, './app')].concat(argv.slice(2)), { stdio: 'inherit' });

  childProcess.on('error', () => {
    console.log('Error occurred, restart...');
    run();
  });
}

fs.watchFile(process.argv[2], (curr, prev) => {
  console.log('Reload docs...');
  run();
});

run();

