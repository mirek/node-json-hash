(function() {
  var crypto, digest;

  crypto = require('crypto');

  digest = function(a, options) {
    var algorithm, element, encoding, hash, i, key, _i, _j, _len, _len1, _ref;
    if (options == null) {
      options = {};
    }
    algorithm = options.algorithm || 'sha1';
    encoding = options.encoding || 'hex';
    hash = crypto.createHash(algorithm);
    switch (false) {
      case a !== null:
        hash.update('n');
        break;
      case a !== false:
      case a !== true:
      case !(a instanceof Boolean):
        hash.update(['f', a.valueOf()].join(':'));
        break;
      case !((typeof a === 'number') || a instanceof Number):
        hash.update(['i', a.toString()].join(':'));
        break;
      case !(typeof a === 'string' || a instanceof String):
        hash.update(['s', a.toString()].join(':'));
        break;
      case !(a instanceof RegExp):
        hash.update(['x', a.toString()].join(':'));
        break;
      case !(a instanceof Array):
        hash.update('[');
        for (i = _i = 0, _len = a.length; _i < _len; i = ++_i) {
          element = a[i];
          hash.update(['a', digest(element, options)].join(':'));
        }
        hash.update(']');
        break;
      case a.constructor !== Object:
        hash.update('{');
        _ref = Object.keys(a).sort();
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          key = _ref[_j];
          hash.update(['k', digest(key, options), 'v', digest(a[key], options)].join(':'));
        }
        hash.update('}');
        break;
      default:
        throw new Error('Unsupported type.');
    }
    return hash.digest(encoding);
  };

  if ((typeof module !== "undefined" && module !== null) && module.exports) {
    module.exports.digest = digest;
  }

}).call(this);
