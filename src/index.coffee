crypto = require 'crypto'

# Compute hash for JSON object.
# @param [Object] a
# @param [Object] options
# @option options 
# @returns Digest hash
digest = (a, options = {}, stack = []) ->
  algo = options.algo or 'sha1'
  encoding = options.encoding or 'hex'
  map = options.map or (v, k, s) -> v

  hash = crypto.createHash algo
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
    when a instanceof Array
      hash.update '['
      for element in a
        hash.update ['a', jsonHash(algo, element)].join(':')
      hash.update ']'
    when a.constructor is Object
      hash.update '{'
      for key in Object.keys(a).sort()
        hash.update ['k', jsonHash(algo, key), 'v', jsonHash(algo, a[key])].join(':')
      hash.update '}'
    else
      throw new Error 'Unsupported type.'
  hash.digest encoding

if module? and module.exports
  module.exports.digest = digest
