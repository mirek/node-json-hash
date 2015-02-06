assert = require 'assert'
crypto = require 'crypto'
our = require '../src/crypto'

arrize = (a) ->
  if Array.isArray(a) then a else [ a ]

# Crypto based sha1.
cryptos = (as, e) ->
  h = crypto.createHash 'sha1'
  for b in arrize as
    h.update b, e
  h.digest 'hex'

ours = (as, e) ->
  h = our.createHash 'sha1'
  for b in arrize as
    h.update b, e
  h.digest 'hex'

# Random string with specified length.
rnd = (n) ->
  latin = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  polish = 'ąćęłńóśżź'
  special = '\0\t\n\r'
  codes = (latin + polish + special).split('')
  [0...n].map(-> codes[Math.random() * codes.length | 0]).join('')

# m random strings with up to n length
rnds = (n, m) ->
  [0...m].map -> rnd (Math.random() * n) | 0

describe 'sha1', ->

  it 'should generate same hash for different sizes', ->
    for i in [0...1025]
      r = rnd i
      for e in [ undefined, 'binary', 'ascii', 'utf8' ]
        assert.equal ours(r, e), cryptos(r, e)

  it 'should generate same hash for multiple updates', ->
    for i in [0...100]
      r = rnds 71, i
      for e in [ undefined, 'binary', 'ascii', 'utf8' ]
        assert.equal ours(r, e), cryptos(r, e)

  it 'should handle utf8', ->
    r = 'Dopóki nie skorzys­tałem z In­terne­tu, nie wie­działem, że na świecie jest ty­lu idiotów.' # Stanisław Lem
    for e in [ undefined, 'binary', 'ascii', 'utf8' ]
      assert.equal ours(r, e), cryptos(r, e)
