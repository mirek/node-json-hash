assert = require 'assert'
jsonHash = require '../src'

describe 'jsonHash', ->
  it 'should have same hashes', ->
    assert.equal jsonHash.digest(new Object()), jsonHash.digest({})
    assert.equal jsonHash.digest({foo:1,bar:2}), jsonHash.digest({bar:2,foo:1})
    assert.equal jsonHash.digest({foo:1,bar:2}), jsonHash.digest({bar:2,foo:1})
  
  it 'should have different hashses for different structure', ->
    assert.notEqual jsonHash.digest([1, [2]]), jsonHash.digest([1, 2])

  it 'should have different hashes for 1 as a number and "1" as a string', ->
    assert.notEqual jsonHash.digest(1), jsonHash.digest('1')
    assert.notEqual jsonHash.digest({foo:1}), jsonHash.digest({foo:'1'})

