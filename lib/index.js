(function() {
  var cryptojs, digest;

  cryptojs = require('./crypto');

  digest = function(a, _arg) {
    var algorithm, crypto, element, enc, encoding, hash, i, key, _i, _j, _len, _len1, _ref, _ref1;
    _ref = _arg != null ? _arg : {}, algorithm = _ref.algorithm, encoding = _ref.encoding, crypto = _ref.crypto;
    if (algorithm == null) {
      algorithm = 'sha1';
    }
    if (encoding == null) {
      encoding = 'hex';
    }
    if (crypto == null) {
      crypto = cryptojs;
    }
    hash = crypto.createHash(algorithm);
    enc = void 0;
    switch (false) {
      case !(a === null):
        hash.update('n', enc);
        break;
      case !(a === false):
      case !(a === true):
      case !(a instanceof Boolean):
        hash.update(['f', a.valueOf()].join(':'), enc);
        break;
      case !(typeof a === 'number'):
      case !(a instanceof Number):
        hash.update(['i', "" + a].join(':'), enc);
        break;
      case !(typeof a === 'string'):
      case !(a instanceof String):
        hash.update(['s', "" + a].join(':'), enc);
        break;
      case !(a instanceof Date):
        hash.update(['d', a.toISOString()].join(':'), enc);
        break;
      case !(a instanceof RegExp):
        hash.update(['x', "" + a].join(':'), enc);
        break;
      case !(a instanceof Array):
        hash.update('[', enc);
        for (i = _i = 0, _len = a.length; _i < _len; i = ++_i) {
          element = a[i];
          hash.update([
            'a', digest(element, {
              algorithm: algorithm,
              encoding: encoding,
              crypto: crypto
            })
          ].join(':'), enc);
        }
        hash.update(']', enc);
        break;
      case !(a.constructor === Object):
        hash.update('{', enc);
        _ref1 = Object.keys(a).sort();
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          key = _ref1[_j];
          hash.update([
            'k', digest(key, {
              algorithm: algorithm,
              encoding: encoding,
              crypto: crypto
            }), 'v', digest(a[key], {
              algorithm: algorithm,
              encoding: encoding,
              crypto: crypto
            })
          ].join(':'), enc);
        }
        hash.update('}', enc);
        break;
      default:
        throw new Error('Unsupported type.');
    }
    return hash.digest(encoding);
  };

  module.exports = {
    digest: digest
  };

}).call(this);
