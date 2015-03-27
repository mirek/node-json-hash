## Summary

Generates hash for JSON objects.

## Usage

    // If you're not on babel use:
    // require('babel/polyfill')

    npm install json-hash

    var assert = require('assert')
    var hash = require('json-hash')

    // hash.digest(any, options?)
    assert.equal(hash.digest({foo:1,bar:1}), hash.digest({bar:1,foo:1}))

We're compatible with browserify by using a JavaScript implementation of SHA1.

If you want to use nodejs one, pass `hash.digest(foo, { crypto: require('crypto') })`.

## Changes

* 2.0.0 - defaults to internal js implementation of sha1, pass { crypto: require('crypto') } to use nodejs one.
