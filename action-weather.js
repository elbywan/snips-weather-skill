#!/usr/bin/env node
const debug = require('debug')
const { name } = require('./package.json')

// Enable error print
debug.enable(name + ':error')

require('./src/index')
