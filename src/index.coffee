crypto = require 'crypto'

# Compute hash for JSON object.
# @param [Object] a
# @param [Object] options
# @option options [String] algorithm Defaults to sha1
# @option options [String] encoding Defaults to hex
# @returns Digest hash with specifed encoding
digest = (a, options = {}) ->
  algorithm = options.algorithm or 'sha1'
  encoding = options.encoding or 'hex'
  hash = crypto.createHash algorithm
  switch
    when a is null
      hash.update 'n'

    when a is false, a is true, a instanceof Boolean
      hash.update ['f', a.valueOf()].join(':')

    # NOTE: All numbers are doubles in javascript json
    when (typeof a is 'number') or a instanceof Number
      hash.update ['i', a.toString()].join(':')

    when typeof a is 'string' or a instanceof String
      hash.update ['s', a.toString()].join(':')

    when a instanceof RegExp
      hash.update ['x', a.toString()].join(':')

    when a instanceof Array
      hash.update '['
      for element, i in a
        hash.update ['a', digest(element, options)].join(':')
      hash.update ']'

    when a.constructor is Object
      hash.update '{'
      for key in Object.keys(a).sort()
        hash.update ['k', digest(key, options), 'v', digest(a[key], options)].join(':')
      hash.update '}'

    else
      throw new Error 'Unsupported type.'
  hash.digest encoding

if module? and module.exports
  module.exports.digest = digest
