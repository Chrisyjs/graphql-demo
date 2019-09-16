require('babel-core/register')({
    'presets': [
        'stage-3',
        ["latest-node", { "target": "current" }]
    ]
})

// require('babel-polyfill')
require('./server')

const open = require('open');
open('http://localhost:4001');
