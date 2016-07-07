
import assert from 'assert'

import * as crypto from './../src/index'
import * as browser from './../src/browser'

import bson from 'bson'

// Get digest from browser and crypto based versions.
function d(s, { sets } = {}) {
  let a = null;
  let b = null;
  for (let inputEncoding in [ undefined, 'binary', 'ascii', 'utf8' ]) {
    a = browser.digest(s, { inputEncoding, sets });
    b = crypto.digest(s, { inputEncoding, sets });
    assert.equal(a, b);
  }
  return a;
}

function eq(a, b, options) {
  assert.equal(d(a, options), d(b, options));
}

function ne(a, b, options) {
  assert.notEqual(d(a, options), d(b, options));
}

describe('jsonHash', () => {

  it('should have same hashes', () => {
    eq( new Object(), {} )
    eq( { foo: 1, bar: 2 }, { bar: 2, foo: 1 } )
    eq( { foo: 1, bar: 2 }, { bar: 2, foo: 1 } )
  })

  it('should have different hashses for different structure', function() {
    ne( [1, [2]], [1, 2] )
  })

  it('should have different hashes for arrays with different order', function () {
    ne(['foo', 'bar'], ['bar', 'foo']);
  });

  it('should have same hashes for arrays with different order with sets = true option', function () {
    eq(['foo', 'bar'], ['bar', 'foo'], { sets: true });
    eq({ foo: ['foo', 'bar'] }, { foo: ['bar', 'foo'] }, { sets: true });
  });

  it('should have different hashes for 1 as a number and "1" as a string', function() {
    ne( 1, '1' )
    ne( { foo: 1 }, { foo: '1' } )
  })

  it('should handle regexps', () => {
    assert.equal( 'f85f2e307ca8ff31576d7fcd5103eb57f325648e', d({ h: /abc/gi }))
    ne( d(/a/i), d(/a/gi) )
  })

  it('should handle dates', () => {
    assert.equal('c47556bd0f06e9307acf8bb72a3f6d2e8747e94c', d({
      at: new Date(12345)
    }))
    assert.equal(d({
      at: new Date(123)
    }), d({
      at: new Date(123)
    }))
    return assert.notEqual(d({
      at: new Date(1401139632803)
    }), d({
      at: new Date(1401139632803 + 123)
    }))
  })

  it('should handle BSON ObjectId', function () {
    let a = new bson.ObjectId()
    let b = new bson.ObjectId()
    ne(a, b)
  })

})
