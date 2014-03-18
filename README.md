## Summary

Generates hash for JSON objects.

## Usage

    npm install json-hash

    var assert = require('assert')
    var jsonHash = require('json-hash')
    assert.equal(jsonHash.digest({foo:1,bar:1}), jsonHash.digest({bar:1,foo:1}))
