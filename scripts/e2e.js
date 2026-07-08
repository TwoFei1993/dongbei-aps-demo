#!/usr/bin/env node
// Runs the globally installed @playwright/test CLI against this project,
// since @playwright/test is not (and should not be) a project dependency here.
const { execFileSync, execSync } = require('node:child_process')
const path = require('node:path')

const globalRoot = execSync('npm root -g').toString().trim()
const cli = path.join(globalRoot, '@playwright', 'test', 'cli.js')

const env = { ...process.env, NODE_PATH: globalRoot }
execFileSync(process.execPath, [cli, 'test', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env,
})
