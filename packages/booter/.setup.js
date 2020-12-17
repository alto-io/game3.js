#!/usr/bin/env node
const execSync = require('child_process').execSync

console.log(`============================================================`)
console.log(`Thank you for using Booter!`);
console.log(`Please choose your own unique package name for Booter to work.`)
console.log(`=============================================================`)

let exitCode = 0;

try {
  execSync('npm init', {stdio: 'inherit'})
} catch (err) {
  exitCode = err.status
}
if (exitCode) {
  process.exit(exitCode);
}
