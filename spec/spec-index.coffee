assert = require 'assert'
hash = require '../src'

d = (a) ->
  cryptos = hash.digest a, { crypto: require('crypto') }
  ours = hash.digest a
  assert.equal cryptos, ours
  ours

describe 'jsonHash', ->

  it 'should have same hashes', ->
    assert.equal d(new Object()), d({})
    assert.equal d({foo:1,bar:2}), d({bar:2,foo:1})
    assert.equal d({foo:1,bar:2}), d({bar:2,foo:1})

  it 'should have different hashses for different structure', ->
    assert.notEqual d([1, [2]]), d([1, 2])

  it 'should have different hashes for 1 as a number and "1" as a string', ->
    assert.notEqual d(1), d('1')
    assert.notEqual d({foo:1}), d({foo:'1'})

  it 'should handle regexps', ->
    assert.equal 'f85f2e307ca8ff31576d7fcd5103eb57f325648e', d h: /abc/gi
    assert.notEqual d(/a/i), d(/a/gi)

  it 'should handle dates', ->
    assert.equal 'c47556bd0f06e9307acf8bb72a3f6d2e8747e94c',
      d({at: new Date(12345)})

    assert.equal d({ at: new Date 123 }), d({ at: new Date 123 })

    assert.notEqual d({ at: new Date 1401139632803 }),
      d({ at: new Date 1401139632803 + 123 })
