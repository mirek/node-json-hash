import assert from 'assert'

import * as crypto from './../src/index'
import * as browser from './../src/browser'

import bson from 'bson'

// Get digest from browser and crypto based versions.
function d(s) {
  let a = null;
  let b = null;
  for (let e in [undefined, 'binary', 'ascii', 'utf8']) {
    a = browser.digest(s, e);
    b = crypto.digest(s, e);
    assert.equal(a, b)
  }
  return a;
}

function eq(a, b) {
  assert.equal(d(a), d(b))
}

function ne(a, b) {
  assert.notEqual(d(a), d(b))
}

describe('jsonHash', () => {

  it('should have same hashes', () => {
    eq(new Object(), {});
    eq({foo: 1, bar: 2}, {bar: 2, foo: 1});
    eq({foo: 1, bar: 2}, {bar: 2, foo: 1});
  });

  it('should have different hashses for different structure', function () {
    ne([1, [2]], [1, 2]);
  });

  it('should have different hashes for 1 as a number and "1" as a string', function () {
    ne(1, '1');
    ne({foo: 1}, {foo: '1'});
  });

  it('should handle regexps', () => {
    assert.equal('f85f2e307ca8ff31576d7fcd5103eb57f325648e', d({h: /abc/gi}));
    ne(d(/a/i), d(/a/gi));
  });

  it('should handle dates', () => {
    assert.equal('c47556bd0f06e9307acf8bb72a3f6d2e8747e94c', d({
      at: new Date(12345)
    }));
    assert.equal(d({
      at: new Date(123)
    }), d({
      at: new Date(123)
    }));
    return assert.notEqual(d({
      at: new Date(1401139632803)
    }), d({
      at: new Date(1401139632803 + 123)
    }))
  });

  it('should handle BSON ObjectId', function () {
    let a = new bson.ObjectId();
    let b = new bson.ObjectId();
    ne(a, b)
  });

  describe('Array tests', () => {

    it('should handle arrays of strings', () => {
      eq(['1', '2', '3'], ['3', '1', '2']);
    });

    it('should handle arrays of numbers', () => {
      eq([1, 2, 3], [3, 2, 1]);
    });

    it('should have different hashes for an array of numbers and an array of strings', () => {
      ne([1, 2, 3], ['1', '2', '3']);
    });

    it('should have different hashes for arrays of unequal length', () => {
      ne([1, 2, 3], [1,2]);
      ne([1, 2, 3], [3,2]);
      ne(['1', '2', '3'], ['1','2']);
      ne(['1', '2', '3'], ['3','2']);
    });

    describe('Arrays of Objects', () => {
      it('should produce the same hash for simple object arrays (same order)', () => {
        let a = [{k1: 'v1', k2: 'v2'}, {k3: 'v3', k4: 'v4'}];
        let b = [{k1: 'v1', k2: 'v2'}, {k3: 'v3', k4: 'v4'}];

        eq(a, b);
      });

      it('should produce the same hash for simple object arrays (reverse order)', () => {
        let a = [{k1: 'v1', k2: 'v2'}, {k3: 'v3', k4: 'v4'}];
        let b = [{k3: 'v3', k4: 'v4'}, {k1: 'v1', k2: 'v2'}];

        eq(a, b);
      });

      it('should produce the same hash for simple object arrays (reverse element key order)', () => {
        let a = [{k2: 'v2', k1: 'v1'}, {k3: 'v3', k4: 'v4'}];
        let b = [{k4: 'v4', k3: 'v3'}, {k1: 'v1', k2: 'v2'}];

        eq(a, b);
      });

      it('should handle an object which has an array property', () => {

        let obj1 = {
          key1: {
            key3: "val3",
            key4: "val4"
          },
          key2: [
            {
              key5: "01d579c3-65b8-4ec4-a1a9-f33acc6e04da",
              key6: "cc7b6954-79ae-41a6-9849-4d0bef286508"
            },
            {
              key6: "66e17f2d-11e5-46c4-9037-7b0ad5babbac",
              key5: "5f649495-f0c0-4dc5-9cd0-bb010768dab6"
            }
          ]
        };

        let obj2 = {
          key1: {
            key3: "val3",
            key4: "val4"
          },
          key2: [
            {
              key6: "cc7b6954-79ae-41a6-9849-4d0bef286508",
              key5: "01d579c3-65b8-4ec4-a1a9-f33acc6e04da"
            },
            {
              key5: "5f649495-f0c0-4dc5-9cd0-bb010768dab6",
              key6: "66e17f2d-11e5-46c4-9037-7b0ad5babbac"
            }
          ]
        };

        eq(obj1, obj2);
      });

      it('should handle multi level objects which have arrays', () => {
        let obj1 = {
          a: {
            b: {
              c: [{d: {e: '1'}}, {d: {e: '2'}}, {d: {e: '3'}}],
              f: {g: '4'}
            },
            g: ['a', 'b', 'c']
          },
          h: {
            i: 1,
            j: 2,
            k: 3
          }
        };

        let obj2 = {
          h: {
            k: 3,
            j: 2,
            i: 1
          },
          a: {
            b: {
              f: {g: '4'},
              c: [{d: {e: '2'}}, {d: {e: '1'}}, {d: {e: '3'}}]
            },
            g: ['c', 'a', 'b']
          }
        };

        eq(obj1, obj2);
      });
    });
  });
});
