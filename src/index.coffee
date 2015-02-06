
cryptojs = require './crypto'

# Compute hash for JSON object. Uses internal, pure js sha1 implementation as default.
# Pass options { crypto: require('crypto') } to speed up sha1 on nodejs or use another
# algorithm.
#
# @param [Object] a
# @param [Object] options
# @option options [String] algorithm 'sha1'
# @option options [String] encoding 'hex' or 'HEX'
# @option options [String] crypto Pass require('crypto') in nodejs to speed up sha1 or use another algo.
# @returns Digest hash with specifed encoding
digest = (a, { algorithm, encoding, crypto } = {}) ->
  algorithm ?= 'sha1'
  encoding ?= 'hex'
  crypto ?= cryptojs
  hash = crypto.createHash algorithm
  enc = undefined
  switch
    when (a is null)
      hash.update 'n', enc

    when (a is false), (a is true), (a instanceof Boolean)
      hash.update ['f', a.valueOf()].join(':'), enc

    # NOTE: All numbers are doubles in javascript json
    when (typeof a is 'number'), (a instanceof Number)
      hash.update ['i', "#{a}"].join(':'), enc

    when (typeof a is 'string'), (a instanceof String)
      hash.update ['s', "#{a}"].join(':'), enc

    when (a instanceof Date)
      hash.update ['d', a.toISOString()].join(':'), enc

    when (a instanceof RegExp)
      hash.update ['x', "#{a}"].join(':'), enc

    when (a instanceof Array)
      hash.update '[', enc
      for element, i in a
        hash.update ['a', digest(element, { algorithm, encoding, crypto })].join(':'), enc
      hash.update ']', enc

    when (a.constructor is Object)
      hash.update '{', enc
      for key in Object.keys(a).sort()
        hash.update [
          'k', digest(key, { algorithm, encoding, crypto })
          'v', digest(a[key], { algorithm, encoding, crypto })
        ].join(':'), enc
      hash.update '}', enc

    else
      throw new Error 'Unsupported type.'

  hash.digest encoding

module.exports = {
  digest
}
