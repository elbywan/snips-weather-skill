#!/usr/bin/env node
const debug = require('debug')

// Enable error print
debug.enable('weather:error')

require('./src/index')
